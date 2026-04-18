import { NextRequest, NextResponse } from "next/server";
import { getAllPackingLists } from "@/lib/sheets";
import { 
  extractPackingListSequence
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

    // Get all packing lists from sheets
    const packingLists = await getAllPackingLists();

    // Determine next sequence globally from existing packing list numbers.
    // This prevents resets when country/year prefixes vary.
    const countryUpper = country.toUpperCase().trim();
    let maxSequence = 0;
    let sequenceDigits = 0;
    let year = new Date().getFullYear().toString();

    for (const pl of packingLists) {
      let fullData: Record<string, unknown> = {};
      try {
        fullData = JSON.parse(pl.full_data || "{}");
      } catch {
        fullData = {};
      }

      const details = (fullData as { details?: { packingListNumber?: string } }).details;
      const packingListNumber = details?.packingListNumber || "";
      const sequenceMatch = packingListNumber.match(/\/(\d+)$/);
      const sequence = extractPackingListSequence(packingListNumber);

      if (sequence > maxSequence) {
        maxSequence = sequence;
        sequenceDigits = sequenceMatch ? sequenceMatch[1].length : 0;

        const yearMatch = packingListNumber.match(/\/([12]\d{3})\//);
        if (yearMatch) {
          year = yearMatch[1];
        }
      }
    }

    // Keep numbering continuous with latest stored packing list.
    const nextSequence = maxSequence + 1;
    const nextSequencePart =
      sequenceDigits > 0
        ? nextSequence.toString().padStart(sequenceDigits, "0")
        : nextSequence.toString();
    const nextPackingListNumber = `IMR/${countryUpper}/${year}/${nextSequencePart}`;

    return NextResponse.json({
      packingListNumber: nextPackingListNumber,
      sequence: nextSequence,
    });
  } catch (error) {
    console.error("Error generating packing list number:", error);
    return NextResponse.json(
      { error: "Failed to generate packing list number" },
      { status: 500 }
    );
  }
}
