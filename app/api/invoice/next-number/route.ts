import { NextRequest, NextResponse } from "next/server";
import { getAllInvoices } from "@/lib/sheets";
import { 
  generateInvoiceNumber, 
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

    // Filter invoices for the current country and fiscal year
    const abbrev = getCountryAbbreviation(country);
    const fiscalYear = getFiscalYearRange();
    const currentPattern = `IMR/${abbrev}${fiscalYear}/`;

    // Find invoices matching the current pattern
    const matchingInvoices = invoices.filter(inv => {
      const fullData = JSON.parse(inv.full_data || "{}");
      const invoiceNumber = fullData.details?.invoiceNumber || "";
      return invoiceNumber.startsWith(currentPattern);
    });

    // Find the highest sequence number
    let maxSequence = 0;
    for (const inv of matchingInvoices) {
      const fullData = JSON.parse(inv.full_data || "{}");
      const invoiceNumber = fullData.details?.invoiceNumber || "";
      const sequence = extractInvoiceSequence(invoiceNumber);
      if (sequence > maxSequence) {
        maxSequence = sequence;
      }
    }

    // Generate next invoice number
    const nextSequence = maxSequence + 1;
    const nextInvoiceNumber = generateInvoiceNumber(country, nextSequence);

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
