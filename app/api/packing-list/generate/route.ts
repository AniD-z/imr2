export const runtime = "nodejs";
export const maxDuration = 60;

import { NextRequest, NextResponse } from "next/server";
import puppeteer from "puppeteer";
import { renderToStaticMarkup } from "react-dom/server";

// Template
import PackingListTemplate from "@/app/components/templates/invoice-pdf/PackingListTemplate";

// Types
import { PackingListType } from "@/types";

export async function POST(req: NextRequest) {
    try {
        const data: PackingListType = await req.json();

        // Render the packing list template to HTML
        const htmlContent = renderToStaticMarkup(PackingListTemplate(data));
        const fullHtml = `
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="UTF-8">
                <script src="https://cdn.tailwindcss.com"></script>
            </head>
            <body>
                ${htmlContent}
            </body>
            </html>
        `;

        // Launch Puppeteer
        const browser = await puppeteer.launch({
            headless: true,
            args: [
                "--no-sandbox",
                "--disable-setuid-sandbox",
                "--disable-dev-shm-usage",
                "--disable-gpu",
            ],
        });

        const page = await browser.newPage();
        await page.setContent(fullHtml, { waitUntil: "networkidle0" });

        // Generate PDF
        const pdfBuffer = await page.pdf({
            format: "A4",
            printBackground: true,
            margin: {
                top: "10mm",
                bottom: "10mm",
                left: "10mm",
                right: "10mm",
            },
        });

        await browser.close();

        // Return PDF as response
        return new NextResponse(Buffer.from(pdfBuffer), {
            headers: {
                "Content-Type": "application/pdf",
                "Content-Disposition": `attachment; filename="Packing-List-${data.details?.packingListNumber || "draft"}.pdf"`,
            },
        });
    } catch (error) {
        console.error("Error generating packing list PDF:", error);
        return NextResponse.json(
            { error: "Failed to generate PDF" },
            { status: 500 }
        );
    }
}
