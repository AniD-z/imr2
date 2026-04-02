import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

// Chromium
import chromium from "@sparticuz/chromium";
import { PDFDocument, StandardFonts, rgb } from "pdf-lib";

// Helpers
import { getInvoiceTemplate } from "@/lib/helpers";

// Variables
import { ENV, TAILWIND_CDN } from "@/lib/variables";

// Types
import { InvoiceType } from "@/types";

/**
 * Generate a PDF document of an invoice based on the provided data.
 *
 * @async
 * @param {NextRequest} req - The Next.js request object.
 * @throws {Error} If there is an error during the PDF generation process.
 * @returns {Promise<NextResponse>} A promise that resolves to a NextResponse object containing the generated PDF.
 */
export async function generatePdfService(req: NextRequest) {
    const body: InvoiceType = await req.json();
    let browser;
    let page;

    try {
        // Load the header image as base64
		const imagePath = path.join(process.cwd(), "public/assets/img/top.jpeg");
        const imageBuffer = fs.readFileSync(imagePath);
        const imageBase64 = imageBuffer.toString("base64");
		const headerImageUrl = `data:image/jpeg;base64,${imageBase64}`;

        // Add header image to data
        const enrichedData = {
            ...body,
            details: {
                ...body.details,
                headerImage: headerImageUrl,
            },
        };

        const ReactDOMServer = (await import("react-dom/server")).default;
        const templateId = enrichedData.details.pdfTemplate;
        const InvoiceTemplate = await getInvoiceTemplate(templateId);
        const htmlTemplate = ReactDOMServer.renderToStaticMarkup(
            InvoiceTemplate(enrichedData)
        );

		if (ENV === "production") {
			const puppeteer = (await import("puppeteer-core")).default;
			browser = await puppeteer.launch({
				args: [...chromium.args, "--disable-dev-shm-usage", "--ignore-certificate-errors"],
				executablePath: await chromium.executablePath(),
				headless: true,
			});
		} else {
			const puppeteer = (await import("puppeteer")).default;
			browser = await puppeteer.launch({
				args: ["--no-sandbox", "--disable-setuid-sandbox"],
				headless: true,
			});
		}

        if (!browser) {
            throw new Error("Failed to launch browser");
        }

        page = await browser.newPage();
        await page.setContent(await htmlTemplate, {
            waitUntil: ["networkidle0", "load", "domcontentloaded"],
            timeout: 30000,
        });

        await page.addStyleTag({
            url: TAILWIND_CDN,
        });

		const pdf: Uint8Array = await page.pdf({
			format: "a4",
			printBackground: true,
			preferCSSPageSize: true,
		});

		// Template 3: add footer details only on the last page (bottom-aligned)
		// and draw the footer separator line on every page (without affecting layout/pagination).
		if (String(templateId) === "3") {
			const pdfDoc = await PDFDocument.load(pdf);
			const pages = pdfDoc.getPages();
			const lastPageIndex = Math.max(0, pages.length - 1);
			const fontRegular = await pdfDoc.embedFont(StandardFonts.Helvetica);
			const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

			const marginX = 24;
			const footerLineY = 30; // points from bottom (kept above the footer text)
			const footerColor = rgb(0.6118, 0.6392, 0.6863); // gray-400 (#9ca3af)

			// Footer details (last page only), positioned below the line
			const lastPage = pages[lastPageIndex];
			const { width: lastWidth } = lastPage.getSize();
			// Footer separator line (last page only)
			lastPage.drawLine({
				start: { x: marginX, y: footerLineY },
				end: { x: lastWidth - marginX, y: footerLineY },
				thickness: 1,
				color: footerColor,
			});
			const fontSize = 8;
			const bottomPadding = 14;
			const sep = "  |  ";
			const segments: Array<{ text: string; font: typeof fontRegular }> = [
				{ text: "E-Mail: ", font: fontBold },
				{ text: "mail.imrengineeringsg@gmail.com", font: fontRegular },
				{ text: sep, font: fontRegular },
				{ text: "Website: ", font: fontBold },
				{ text: "https://www.imrengineeringservices.in/", font: fontRegular },
				{ text: sep, font: fontRegular },
				{ text: "GSTIN: ", font: fontBold },
				{ text: "36AAGCI8221A1S", font: fontRegular },
			];

			const totalWidth = segments.reduce(
				(sum, s) => sum + s.font.widthOfTextAtSize(s.text, fontSize),
				0
			);
			let x = (lastWidth - totalWidth) / 2;
			const y = bottomPadding;
			for (const s of segments) {
				lastPage.drawText(s.text, {
					x,
					y,
					size: fontSize,
					font: s.font,
					color: rgb(0, 0, 0),
				});
				x += s.font.widthOfTextAtSize(s.text, fontSize);
			}

			const stampedPdf = await pdfDoc.save();
			return new NextResponse(new Blob([stampedPdf], { type: "application/pdf" }), {
				headers: {
					"Content-Type": "application/pdf",
					"Content-Disposition": "attachment; filename=invoice.pdf",
					"Cache-Control": "no-cache",
					Pragma: "no-cache",
				},
				status: 200,
			});
		}

		return new NextResponse(new Blob([pdf], { type: "application/pdf" }), {
			headers: {
				"Content-Type": "application/pdf",
				"Content-Disposition": "attachment; filename=invoice.pdf",
				"Cache-Control": "no-cache",
				Pragma: "no-cache",
			},
			status: 200,
		});
	} catch (error: any) {
		console.error("PDF Generation Error:", error);
		return new NextResponse(
			JSON.stringify({ error: "Failed to generate PDF" }),
			{
				status: 500,
				headers: {
					"Content-Type": "application/json",
				},
			}
		);
	} finally {
		if (page) {
			try {
				await page.close();
			} catch (e) {
				console.error("Error closing page:", e);
			}
		}
		if (browser) {
			try {
				const pages = await browser.pages();
				await Promise.all(pages.map((p) => p.close()));
				await browser.close();
			} catch (e) {
				console.error("Error closing browser:", e);
			}
		}
	}
}
