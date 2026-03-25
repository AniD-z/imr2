import { NextRequest, NextResponse } from "next/server";
import { getAllPackingLists } from "@/lib/sheets";
import { 
  generatePackingListNumber, 
  extractPackingListSequence,
  getCurrentYear 
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

    // Filter packing lists for the current country and year
    const countryUpper = country.toUpperCase().trim();
    const year = getCurrentYear("4digit");
    const currentPattern = `IMR/${countryUpper}/${year}/`;

    // Find packing lists matching the current pattern
    const matchingLists = packingLists.filter(pl => {
      const fullData = JSON.parse(pl.full_data || "{}");
      const packingListNumber = fullData.details?.packingListNumber || "";
      return packingListNumber.startsWith(currentPattern);
    });

    // Find the highest sequence number
    let maxSequence = 0;
    for (const pl of matchingLists) {
      const fullData = JSON.parse(pl.full_data || "{}");
      const packingListNumber = fullData.details?.packingListNumber || "";
      const sequence = extractPackingListSequence(packingListNumber);
      if (sequence > maxSequence) {
        maxSequence = sequence;
      }
    }

    // Generate next packing list number
    const nextSequence = maxSequence + 1;
    const nextPackingListNumber = generatePackingListNumber(country, nextSequence);

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
