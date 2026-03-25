/**
 * Auto-increment number generator for invoices and packing lists
 * Invoice format: IMR/[LOCATION-ABBREV][FISCAL-YEAR]/[NUMBER] - Example: IMR/SDN25-26/053
 * Packing List format: IMR/[LOCATION]/[YEAR]/[NUMBER] - Example: IMR/SUDAN/2025/01
 */

/**
 * Country to abbreviation mapping
 */
const COUNTRY_ABBREVIATIONS: Record<string, string> = {
  SUDAN: "SDN",
  INDIA: "IND",
  USA: "USA",
  UK: "UK",
  CANADA: "CAN",
  AUSTRALIA: "AUS",
  GERMANY: "DEU",
  FRANCE: "FRA",
  JAPAN: "JPN",
  CHINA: "CHN",
};

/**
 * Get country abbreviation from country name
 */
export function getCountryAbbreviation(country: string): string {
  const countryUpper = country.toUpperCase().trim();
  // Try direct match first
  if (COUNTRY_ABBREVIATIONS[countryUpper]) {
    return COUNTRY_ABBREVIATIONS[countryUpper];
  }
  // If no match, extract first 3 letters
  return countryUpper.substring(0, 3);
}

/**
 * Get fiscal year range (e.g., 25-26 for 2025-2026)
 */
export function getFiscalYearRange(): string {
  const now = new Date();
  const year = now.getFullYear();
  const nextYear = year + 1;
  // Get last 2 digits
  const yearStr = year.toString().slice(-2);
  const nextYearStr = nextYear.toString().slice(-2);
  return `${yearStr}-${nextYearStr}`;
}

/**
 * Get current year (2-digit or 4-digit format)
 */
export function getCurrentYear(format: "2digit" | "4digit" = "4digit"): string {
  const year = new Date().getFullYear();
  if (format === "2digit") {
    return year.toString().slice(-2);
  }
  return year.toString();
}

/**
 * Generate invoice number
 * Format: IMR/[LOCATION-ABBREV][FISCAL-YEAR]/[NUMBER]
 * Example: IMR/SDN25-26/053
 */
export function generateInvoiceNumber(
  country: string,
  sequenceNumber: number
): string {
  const abbrev = getCountryAbbreviation(country);
  const fiscalYear = getFiscalYearRange();
  const paddedNumber = sequenceNumber.toString().padStart(3, "0");
  return `IMR/${abbrev}${fiscalYear}/${paddedNumber}`;
}

/**
 * Generate packing list number
 * Format: IMR/[LOCATION]/[YEAR]/[NUMBER]
 * Example: IMR/SUDAN/2025/01
 */
export function generatePackingListNumber(
  country: string,
  sequenceNumber: number
): string {
  const countryUpper = country.toUpperCase().trim();
  const year = getCurrentYear("4digit");
  const paddedNumber = sequenceNumber.toString().padStart(2, "0");
  return `IMR/${countryUpper}/${year}/${paddedNumber}`;
}

/**
 * Extract sequence number from invoice number
 * Example: "IMR/SDN25-26/053" -> 53
 */
export function extractInvoiceSequence(invoiceNumber: string): number {
  const match = invoiceNumber.match(/\/(\d+)$/);
  return match ? parseInt(match[1], 10) : 0;
}

/**
 * Extract sequence number from packing list number
 * Example: "IMR/SUDAN/2025/01" -> 1
 */
export function extractPackingListSequence(packingListNumber: string): number {
  const match = packingListNumber.match(/\/(\d+)$/);
  return match ? parseInt(match[1], 10) : 0;
}
