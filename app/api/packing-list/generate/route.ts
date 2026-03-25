export const runtime = "nodejs";
export const maxDuration = 60;

import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

// Chromium
import chromium from "@sparticuz/chromium";

// Template
import PackingListTemplate from "@/app/components/templates/invoice-pdf/PackingListTemplate";

// Variables
import { ENV, TAILWIND_CDN } from "@/lib/variables";

// Types
import { PackingListType } from "@/types";

export async function POST(req: NextRequest) {
    let browser;
    let page;

    try {
        const data: PackingListType = await req.json();

        // Load the header image as base64
        const imagePath = path.join(process.cwd(), "public/assets/img/top.png");
        const imageBuffer = fs.readFileSync(imagePath);
        const imageBase64 = imageBuffer.toString("base64");
        const headerImageUrl = `data:image/png;base64,${imageBase64}`;

        // Add header image to data
        const enrichedData = {
            ...data,
            details: {
                ...data.details,
                headerImage: headerImageUrl,
            },
        };

        // Dynamically import react-dom/server
        const ReactDOMServer = (await import("react-dom/server")).default;
        
        // Render the packing list template to HTML
        const htmlContent = ReactDOMServer.renderToStaticMarkup(
            PackingListTemplate(enrichedData)
        );

        // Launch Puppeteer based on environment
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
        await page.setContent(await htmlContent, {
            waitUntil: ["networkidle0", "load", "domcontentloaded"],
            timeout: 30000,
        });

        await page.addStyleTag({
            url: TAILWIND_CDN,
        });

        // Generate PDF
        const pdf = await page.pdf({
            format: "a4",
            printBackground: true,
            preferCSSPageSize: true,
        });

        return new NextResponse(Buffer.from(pdf), {
            headers: {
                "Content-Type": "application/pdf",
                "Content-Disposition": `attachment; filename="Packing-List-${data.details?.packingListNumber || "draft"}.pdf"`,
                "Cache-Control": "no-cache",
                Pragma: "no-cache",
            },
            status: 200,
        });
    } catch (error: any) {
        console.error("Packing List PDF Generation Error:", error);
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
                await browser.close();
            } catch (e) {
                console.error("Error closing browser:", e);
            }
        }
    }
}
