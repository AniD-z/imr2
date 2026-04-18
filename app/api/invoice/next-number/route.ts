import { NextRequest, NextResponse } from "next/server";
import { getAllInvoices } from "@/lib/sheets";
import { 
  extractInvoiceSequence,
  getCountryAbbreviation,
  getFiscalYearRange 
} from "@/lib/numberGenerator";

export async function POST(request: NextRequest) {
  try {
    const { country } = await request.json();

    if (!country) {
      return NextResponse.json(
        { error: "Country is required" },
        { status: 400 }
      );
    }

    // Get all invoices from sheets
    const invoices = await getAllInvoices();

    // Determine the next sequence globally from existing invoice numbers.
    // This prevents resets when country/fiscal prefixes vary between invoices.
    const abbrev = getCountryAbbreviation(country);
    let maxSequence = 0;
    let sequenceDigits = 0;
    let fiscalYear = getFiscalYearRange();

    for (const inv of invoices) {
      let fullData: Record<string, unknown> = {};
      try {
        fullData = JSON.parse(inv.full_data || "{}");
      } catch {
        fullData = {};
      }

      const details = (fullData as { details?: { invoiceNumber?: string } }).details;
      const invoiceNumber = details?.invoiceNumber || "";
      const sequenceMatch = invoiceNumber.match(/\/(\d+)$/);
      const sequence = extractInvoiceSequence(invoiceNumber);

      if (sequence > maxSequence) {
        maxSequence = sequence;
        sequenceDigits = sequenceMatch ? sequenceMatch[1].length : 0;

        const fiscalMatch = invoiceNumber.match(/\d{2}-\d{2}/);
        if (fiscalMatch) {
          fiscalYear = fiscalMatch[0];
        }
      }
    }

    // Keep numbering continuous with the latest stored invoice.
    const nextSequence = maxSequence + 1;
    const nextSequencePart =
      sequenceDigits > 0
        ? nextSequence.toString().padStart(sequenceDigits, "0")
        : nextSequence.toString();
    const nextInvoiceNumber = `IMR/${abbrev}${fiscalYear}/${nextSequencePart}`;

    return NextResponse.json({
      invoiceNumber: nextInvoiceNumber,
      sequence: nextSequence,
    });
  } catch (error) {
    console.error("Error generating invoice number:", error);
    return NextResponse.json(
      { error: "Failed to generate invoice number" },
      { status: 500 }
    );
  }
}
