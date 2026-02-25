"use server";

import { GoogleSpreadsheet } from "google-spreadsheet";
import { JWT } from "google-auth-library";

// Types for sheet rows
export type SheetInvoiceRow = {
  invoice_number: number;
  customer_name: string;
  customer_email: string;
  invoice_date: string;
  due_date: string;
  items: string; // JSON stringified array
  subtotal: number;
  tax: number;
  total: number;
  status: string;
  created_at: string;
  pdf_url: string;
  full_data: string; // JSON stringified full InvoiceType
};

const SCOPES = ["https://www.googleapis.com/auth/spreadsheets"];

const SHEET_HEADERS = [
  "invoice_number",
  "customer_name",
  "customer_email",
  "invoice_date",
  "due_date",
  "items",
  "subtotal",
  "tax",
  "total",
  "status",
  "created_at",
  "pdf_url",
  "full_data",
];

/**
 * Gets an authenticated Google Spreadsheet instance
 */
async function getSheet() {
  const email = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
  const key = process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, "\n");
  const sheetId = process.env.GOOGLE_SHEET_ID;

  if (!email || !key || !sheetId) {
    throw new Error(
      "Missing Google Sheets environment variables. Please set GOOGLE_SERVICE_ACCOUNT_EMAIL, GOOGLE_PRIVATE_KEY, and GOOGLE_SHEET_ID."
    );
  }

  const jwt = new JWT({
    email,
    key,
    scopes: SCOPES,
  });

  const doc = new GoogleSpreadsheet(sheetId, jwt);
  await doc.loadInfo();

  // Get or create the "Invoice" sheet
  let sheet = doc.sheetsByTitle["Invoice"];

  if (!sheet) {
    sheet = await doc.addSheet({
      title: "Invoice",
      headerValues: SHEET_HEADERS,
    });
  } else {
    // Ensure headers exist
    try {
      await sheet.loadHeaderRow();
    } catch {
      await sheet.setHeaderRow(SHEET_HEADERS);
    }
  }

  return sheet;
}

/**
 * Gets the next auto-incremented invoice number
 */
export async function getNextInvoiceNumber(): Promise<number> {
  const sheet = await getSheet();
  const rows = await sheet.getRows();

  if (rows.length === 0) return 1;

  const maxNumber = rows.reduce((max, row) => {
    const num = parseInt(row.get("invoice_number") || "0", 10);
    return num > max ? num : max;
  }, 0);

  return maxNumber + 1;
}

/**
 * Gets all invoices from the sheet, sorted by invoice_number desc
 */
export async function getAllInvoices(): Promise<SheetInvoiceRow[]> {
  const sheet = await getSheet();
  const rows = await sheet.getRows();

  const invoices: SheetInvoiceRow[] = rows.map((row) => ({
    invoice_number: parseInt(row.get("invoice_number") || "0", 10),
    customer_name: row.get("customer_name") || "",
    customer_email: row.get("customer_email") || "",
    invoice_date: row.get("invoice_date") || "",
    due_date: row.get("due_date") || "",
    items: row.get("items") || "[]",
    subtotal: parseFloat(row.get("subtotal") || "0"),
    tax: parseFloat(row.get("tax") || "0"),
    total: parseFloat(row.get("total") || "0"),
    status: row.get("status") || "draft",
    created_at: row.get("created_at") || "",
    pdf_url: row.get("pdf_url") || "",
    full_data: row.get("full_data") || "{}",
  }));

  // Sort by invoice_number descending
  invoices.sort((a, b) => b.invoice_number - a.invoice_number);

  return invoices;
}

/**
 * Gets a single invoice by invoice_number
 */
export async function getInvoiceByNumber(
  invoiceNumber: number
): Promise<SheetInvoiceRow | null> {
  const sheet = await getSheet();
  const rows = await sheet.getRows();

  const row = rows.find(
    (r) => parseInt(r.get("invoice_number") || "0", 10) === invoiceNumber
  );

  if (!row) return null;

  return {
    invoice_number: parseInt(row.get("invoice_number") || "0", 10),
    customer_name: row.get("customer_name") || "",
    customer_email: row.get("customer_email") || "",
    invoice_date: row.get("invoice_date") || "",
    due_date: row.get("due_date") || "",
    items: row.get("items") || "[]",
    subtotal: parseFloat(row.get("subtotal") || "0"),
    tax: parseFloat(row.get("tax") || "0"),
    total: parseFloat(row.get("total") || "0"),
    status: row.get("status") || "draft",
    created_at: row.get("created_at") || "",
    pdf_url: row.get("pdf_url") || "",
    full_data: row.get("full_data") || "{}",
  };
}

/**
 * Creates a new invoice in the sheet with auto-incrementing invoice_number
 */
export async function createInvoice(
  data: Omit<SheetInvoiceRow, "invoice_number" | "created_at">
): Promise<SheetInvoiceRow> {
  const sheet = await getSheet();
  const invoiceNumber = await getNextInvoiceNumber();
  const createdAt = new Date().toISOString();

  const rowData = {
    invoice_number: invoiceNumber,
    customer_name: data.customer_name,
    customer_email: data.customer_email,
    invoice_date: data.invoice_date,
    due_date: data.due_date,
    items: data.items,
    subtotal: data.subtotal,
    tax: data.tax,
    total: data.total,
    status: data.status || "draft",
    created_at: createdAt,
    pdf_url: data.pdf_url || "",
    full_data: data.full_data,
  };

  await sheet.addRow(rowData);

  return { ...rowData, invoice_number: invoiceNumber, created_at: createdAt };
}

/**
 * Updates an existing invoice by invoice_number
 */
export async function updateInvoiceByNumber(
  invoiceNumber: number,
  data: Partial<SheetInvoiceRow>
): Promise<SheetInvoiceRow | null> {
  const sheet = await getSheet();
  const rows = await sheet.getRows();

  const row = rows.find(
    (r) => parseInt(r.get("invoice_number") || "0", 10) === invoiceNumber
  );

  if (!row) return null;

  // Update each field that's provided
  if (data.customer_name !== undefined)
    row.set("customer_name", data.customer_name);
  if (data.customer_email !== undefined)
    row.set("customer_email", data.customer_email);
  if (data.invoice_date !== undefined)
    row.set("invoice_date", data.invoice_date);
  if (data.due_date !== undefined) row.set("due_date", data.due_date);
  if (data.items !== undefined) row.set("items", data.items);
  if (data.subtotal !== undefined) row.set("subtotal", data.subtotal);
  if (data.tax !== undefined) row.set("tax", data.tax);
  if (data.total !== undefined) row.set("total", data.total);
  if (data.status !== undefined) row.set("status", data.status);
  if (data.pdf_url !== undefined) row.set("pdf_url", data.pdf_url);
  if (data.full_data !== undefined) row.set("full_data", data.full_data);

  await row.save();

  return {
    invoice_number: invoiceNumber,
    customer_name: row.get("customer_name") || "",
    customer_email: row.get("customer_email") || "",
    invoice_date: row.get("invoice_date") || "",
    due_date: row.get("due_date") || "",
    items: row.get("items") || "[]",
    subtotal: parseFloat(row.get("subtotal") || "0"),
    tax: parseFloat(row.get("tax") || "0"),
    total: parseFloat(row.get("total") || "0"),
    status: row.get("status") || "draft",
    created_at: row.get("created_at") || "",
    pdf_url: row.get("pdf_url") || "",
    full_data: row.get("full_data") || "{}",
  };
}

/**
 * Deletes an invoice by invoice_number
 */
export async function deleteInvoiceByNumber(
  invoiceNumber: number
): Promise<boolean> {
  const sheet = await getSheet();
  const rows = await sheet.getRows();

  const row = rows.find(
    (r) => parseInt(r.get("invoice_number") || "0", 10) === invoiceNumber
  );

  if (!row) return false;

  await row.delete();
  return true;
}
