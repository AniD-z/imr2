"use server";

import { GoogleSpreadsheet, GoogleSpreadsheetWorksheet } from "google-spreadsheet";
import { JWT } from "google-auth-library";

// ============================================
// IN-MEMORY CACHE
// ============================================
// Data cache: 60 seconds TTL (invalidated on writes)
const DATA_TTL_MS = 60_000;
// Sheet connection cache: 25 minutes TTL (JWT tokens last ~1 hour)
const SHEET_TTL_MS = 25 * 60_000;

const _cache = new Map<string, { value: unknown; expiresAt: number }>();

function getFromCache<T>(key: string): T | null {
  const entry = _cache.get(key);
  if (entry && Date.now() < entry.expiresAt) return entry.value as T;
  _cache.delete(key);
  return null;
}

function setInCache<T>(key: string, value: T, ttl = DATA_TTL_MS): void {
  _cache.set(key, { value, expiresAt: Date.now() + ttl });
}

function invalidateCache(...keys: string[]): void {
  keys.forEach((k) => _cache.delete(k));
}

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
  currency: string;
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
 * Returns an authenticated sheet tab, caching the reference for 25 minutes.
 * Avoids calling doc.loadInfo() + loadHeaderRow() on every request.
 */
async function getNamedSheet(
  title: string,
  headers: string[]
) {
  const cacheKey = `sheet:${title}`;
  const cached = getFromCache<GoogleSpreadsheetWorksheet>(cacheKey);
  if (cached) return cached;

  const serviceAccountJson = process.env.GOOGLE_SERVICE_ACCOUNT_JSON;
  const sheetId = process.env.GOOGLE_SHEET_ID;

  if (!serviceAccountJson || !sheetId) {
    throw new Error(
      "Missing Google Sheets environment variables. Please set GOOGLE_SERVICE_ACCOUNT_JSON and GOOGLE_SHEET_ID."
    );
  }

  let credentials: { client_email: string; private_key: string };
  try {
    credentials = JSON.parse(serviceAccountJson);
  } catch {
    throw new Error(
      "Invalid GOOGLE_SERVICE_ACCOUNT_JSON format. Please ensure it's valid JSON."
    );
  }

  const jwt = new JWT({
    email: credentials.client_email,
    key: credentials.private_key,
    scopes: SCOPES,
  });

  const doc = new GoogleSpreadsheet(sheetId, jwt);
  await doc.loadInfo();

  let sheet = doc.sheetsByTitle[title];
  if (!sheet) {
    sheet = await doc.addSheet({ title, headerValues: headers });
  } else {
    try {
      await sheet.loadHeaderRow();
    } catch {
      await sheet.setHeaderRow(headers);
    }
  }

  setInCache(cacheKey, sheet, SHEET_TTL_MS);
  return sheet;
}

const getSheet = () => getNamedSheet("Invoice", SHEET_HEADERS);

/**
 * Gets the next auto-incremented invoice number.
 * Uses the list cache when available to avoid an extra API call.
 */
export async function getNextInvoiceNumber(): Promise<number> {
  const list = getFromCache<SheetInvoiceRow[]>("invoices");
  if (list && list.length > 0) {
    return Math.max(...list.map((r) => r.invoice_number)) + 1;
  }
  if (list) return 1; // empty cached list

  const sheet = await getSheet();
  const rows = await sheet.getRows();
  if (rows.length === 0) return 1;
  return Math.max(...rows.map((r) => parseInt(r.get("invoice_number") || "0", 10))) + 1;
}

/**
 * Gets all invoices from the sheet, sorted by invoice_number desc
 */
export async function getAllInvoices(): Promise<SheetInvoiceRow[]> {
  const cached = getFromCache<SheetInvoiceRow[]>("invoices");
  if (cached) return cached;

  const sheet = await getSheet();
  const rows = await sheet.getRows();

  const invoices: SheetInvoiceRow[] = rows.map((row) => {
    const fullData = row.get("full_data") || "{}";
    let currency = "INR";
    try { currency = JSON.parse(fullData)?.details?.currency || "INR"; } catch {}
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
      currency,
      status: row.get("status") || "draft",
      created_at: row.get("created_at") || "",
      pdf_url: row.get("pdf_url") || "",
      full_data: fullData,
    };
  });

  // Sort by invoice_number descending
  invoices.sort((a, b) => b.invoice_number - a.invoice_number);

  setInCache("invoices", invoices);
  return invoices;
}

/**
 * Gets a single invoice by invoice_number
 */
export async function getInvoiceByNumber(
  invoiceNumber: number
): Promise<SheetInvoiceRow | null> {
  const cacheKey = `invoice-${invoiceNumber}`;
  const cached = getFromCache<SheetInvoiceRow>(cacheKey);
  if (cached) return cached;

  // Derive from list cache if available — avoids a second API round-trip
  const list = getFromCache<SheetInvoiceRow[]>("invoices");
  if (list) {
    const found = list.find((r) => r.invoice_number === invoiceNumber) ?? null;
    if (found) setInCache(cacheKey, found);
    return found;
  }

  const sheet = await getSheet();
  const rows = await sheet.getRows();

  const row = rows.find(
    (r) => parseInt(r.get("invoice_number") || "0", 10) === invoiceNumber
  );

  if (!row) return null;

  const fullData = row.get("full_data") || "{}";
  let currency = "INR";
  try { currency = JSON.parse(fullData)?.details?.currency || "INR"; } catch {}

  const result: SheetInvoiceRow = {
    invoice_number: parseInt(row.get("invoice_number") || "0", 10),
    customer_name: row.get("customer_name") || "",
    customer_email: row.get("customer_email") || "",
    invoice_date: row.get("invoice_date") || "",
    due_date: row.get("due_date") || "",
    items: row.get("items") || "[]",
    subtotal: parseFloat(row.get("subtotal") || "0"),
    tax: parseFloat(row.get("tax") || "0"),
    total: parseFloat(row.get("total") || "0"),
    currency,
    status: row.get("status") || "draft",
    created_at: row.get("created_at") || "",
    pdf_url: row.get("pdf_url") || "",
    full_data: fullData,
  };
  setInCache(`invoice-${invoiceNumber}`, result);
  return result;
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

  let parsedCurrency = "INR";
  try { parsedCurrency = JSON.parse(data.full_data)?.details?.currency || "INR"; } catch {}

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
    currency: data.currency || parsedCurrency,
    status: data.status || "draft",
    created_at: createdAt,
    pdf_url: data.pdf_url || "",
    full_data: data.full_data,
  };

  await sheet.addRow(rowData);
  invalidateCache("invoices");

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
  invalidateCache("invoices", `invoice-${invoiceNumber}`);

  const updatedFullData = row.get("full_data") || "{}";
  let updatedCurrency = "INR";
  try { updatedCurrency = JSON.parse(updatedFullData)?.details?.currency || "INR"; } catch {}

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
    currency: updatedCurrency,
    status: row.get("status") || "draft",
    created_at: row.get("created_at") || "",
    pdf_url: row.get("pdf_url") || "",
    full_data: updatedFullData,
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
  invalidateCache("invoices", `invoice-${invoiceNumber}`);
  return true;
}

// ============================================
// PACKING LIST FUNCTIONS
// ============================================

export type SheetPackingListRow = {
  packing_list_number: number;
  exporter_name: string;
  consignee_name: string;
  buyer_name: string;
  date: string;
  invoice_number: string;
  buyer_order_number: string;
  items: string; // JSON stringified array
  total_net_weight: number;
  total_gross_weight: number;
  total_boxes: number;
  status: string;
  created_at: string;
  pdf_url: string;
  full_data: string; // JSON stringified full PackingListType
};

const PACKING_LIST_HEADERS = [
  "packing_list_number",
  "exporter_name",
  "consignee_name",
  "buyer_name",
  "date",
  "invoice_number",
  "buyer_order_number",
  "items",
  "total_net_weight",
  "total_gross_weight",
  "total_boxes",
  "status",
  "created_at",
  "pdf_url",
  "full_data",
];

const getPackingListSheet = () => getNamedSheet("PackingList", PACKING_LIST_HEADERS);

/**
 * Gets the next auto-incremented packing list number.
 * Uses the list cache when available to avoid an extra API call.
 */
export async function getNextPackingListNumber(): Promise<number> {
  const list = getFromCache<SheetPackingListRow[]>("packing-lists");
  if (list && list.length > 0) {
    return Math.max(...list.map((r) => r.packing_list_number)) + 1;
  }
  if (list) return 1;

  const sheet = await getPackingListSheet();
  const rows = await sheet.getRows();
  if (rows.length === 0) return 1;
  return Math.max(...rows.map((r) => parseInt(r.get("packing_list_number") || "0", 10))) + 1;
}

/**
 * Gets all packing lists from the sheet, sorted by packing_list_number desc
 */
export async function getAllPackingLists(): Promise<SheetPackingListRow[]> {
  const cached = getFromCache<SheetPackingListRow[]>("packing-lists");
  if (cached) return cached;

  const sheet = await getPackingListSheet();
  const rows = await sheet.getRows();

  const packingLists: SheetPackingListRow[] = rows.map((row) => ({
    packing_list_number: parseInt(row.get("packing_list_number") || "0", 10),
    exporter_name: row.get("exporter_name") || "",
    consignee_name: row.get("consignee_name") || "",
    buyer_name: row.get("buyer_name") || "",
    date: row.get("date") || "",
    invoice_number: row.get("invoice_number") || "",
    buyer_order_number: row.get("buyer_order_number") || "",
    items: row.get("items") || "[]",
    total_net_weight: parseFloat(row.get("total_net_weight") || "0"),
    total_gross_weight: parseFloat(row.get("total_gross_weight") || "0"),
    total_boxes: parseInt(row.get("total_boxes") || "0", 10),
    status: row.get("status") || "draft",
    created_at: row.get("created_at") || "",
    pdf_url: row.get("pdf_url") || "",
    full_data: row.get("full_data") || "{}",
  }));

  // Sort by packing_list_number descending
  packingLists.sort((a, b) => b.packing_list_number - a.packing_list_number);

  setInCache("packing-lists", packingLists);
  return packingLists;
}

/**
 * Gets a single packing list by packing_list_number
 */
export async function getPackingListByNumber(
  packingListNumber: number
): Promise<SheetPackingListRow | null> {
  const cacheKey = `packing-list-${packingListNumber}`;
  const cached = getFromCache<SheetPackingListRow>(cacheKey);
  if (cached) return cached;

  // Derive from list cache if available — avoids a second API round-trip
  const list = getFromCache<SheetPackingListRow[]>("packing-lists");
  if (list) {
    const found = list.find((r) => r.packing_list_number === packingListNumber) ?? null;
    if (found) setInCache(cacheKey, found);
    return found;
  }

  const sheet = await getPackingListSheet();
  const rows = await sheet.getRows();

  const row = rows.find(
    (r) => parseInt(r.get("packing_list_number") || "0", 10) === packingListNumber
  );

  if (!row) return null;

  const result: SheetPackingListRow = {
    packing_list_number: parseInt(row.get("packing_list_number") || "0", 10),
    exporter_name: row.get("exporter_name") || "",
    consignee_name: row.get("consignee_name") || "",
    buyer_name: row.get("buyer_name") || "",
    date: row.get("date") || "",
    invoice_number: row.get("invoice_number") || "",
    buyer_order_number: row.get("buyer_order_number") || "",
    items: row.get("items") || "[]",
    total_net_weight: parseFloat(row.get("total_net_weight") || "0"),
    total_gross_weight: parseFloat(row.get("total_gross_weight") || "0"),
    total_boxes: parseInt(row.get("total_boxes") || "0", 10),
    status: row.get("status") || "draft",
    created_at: row.get("created_at") || "",
    pdf_url: row.get("pdf_url") || "",
    full_data: row.get("full_data") || "{}",
  };
  setInCache(cacheKey, result);
  return result;
}

/**
 * Creates a new packing list in the sheet with auto-incrementing packing_list_number
 */
export async function createPackingList(
  data: Omit<SheetPackingListRow, "packing_list_number" | "created_at">
): Promise<SheetPackingListRow> {
  const sheet = await getPackingListSheet();
  const packingListNumber = await getNextPackingListNumber();
  const createdAt = new Date().toISOString();

  const rowData = {
    packing_list_number: packingListNumber,
    exporter_name: data.exporter_name,
    consignee_name: data.consignee_name,
    buyer_name: data.buyer_name,
    date: data.date,
    invoice_number: data.invoice_number,
    buyer_order_number: data.buyer_order_number,
    items: data.items,
    total_net_weight: data.total_net_weight,
    total_gross_weight: data.total_gross_weight,
    total_boxes: data.total_boxes,
    status: data.status || "draft",
    created_at: createdAt,
    pdf_url: data.pdf_url || "",
    full_data: data.full_data,
  };

  await sheet.addRow(rowData);
  invalidateCache("packing-lists");

  return { ...rowData, packing_list_number: packingListNumber, created_at: createdAt };
}

/**
 * Updates an existing packing list by packing_list_number
 */
export async function updatePackingListByNumber(
  packingListNumber: number,
  data: Partial<SheetPackingListRow>
): Promise<SheetPackingListRow | null> {
  const sheet = await getPackingListSheet();
  const rows = await sheet.getRows();

  const row = rows.find(
    (r) => parseInt(r.get("packing_list_number") || "0", 10) === packingListNumber
  );

  if (!row) return null;

  // Update each field that's provided
  if (data.exporter_name !== undefined) row.set("exporter_name", data.exporter_name);
  if (data.consignee_name !== undefined) row.set("consignee_name", data.consignee_name);
  if (data.buyer_name !== undefined) row.set("buyer_name", data.buyer_name);
  if (data.date !== undefined) row.set("date", data.date);
  if (data.invoice_number !== undefined) row.set("invoice_number", data.invoice_number);
  if (data.buyer_order_number !== undefined) row.set("buyer_order_number", data.buyer_order_number);
  if (data.items !== undefined) row.set("items", data.items);
  if (data.total_net_weight !== undefined) row.set("total_net_weight", data.total_net_weight);
  if (data.total_gross_weight !== undefined) row.set("total_gross_weight", data.total_gross_weight);
  if (data.total_boxes !== undefined) row.set("total_boxes", data.total_boxes);
  if (data.status !== undefined) row.set("status", data.status);
  if (data.pdf_url !== undefined) row.set("pdf_url", data.pdf_url);
  if (data.full_data !== undefined) row.set("full_data", data.full_data);

  await row.save();
  invalidateCache("packing-lists", `packing-list-${packingListNumber}`);

  return {
    packing_list_number: packingListNumber,
    exporter_name: row.get("exporter_name") || "",
    consignee_name: row.get("consignee_name") || "",
    buyer_name: row.get("buyer_name") || "",
    date: row.get("date") || "",
    invoice_number: row.get("invoice_number") || "",
    buyer_order_number: row.get("buyer_order_number") || "",
    items: row.get("items") || "[]",
    total_net_weight: parseFloat(row.get("total_net_weight") || "0"),
    total_gross_weight: parseFloat(row.get("total_gross_weight") || "0"),
    total_boxes: parseInt(row.get("total_boxes") || "0", 10),
    status: row.get("status") || "draft",
    created_at: row.get("created_at") || "",
    pdf_url: row.get("pdf_url") || "",
    full_data: row.get("full_data") || "{}",
  };
}

/**
 * Deletes a packing list by packing_list_number
 */
export async function deletePackingListByNumber(
  packingListNumber: number
): Promise<boolean> {
  const sheet = await getPackingListSheet();
  const rows = await sheet.getRows();

  const row = rows.find(
    (r) => parseInt(r.get("packing_list_number") || "0", 10) === packingListNumber
  );

  if (!row) return false;

  await row.delete();
  invalidateCache("packing-lists", `packing-list-${packingListNumber}`);
  return true;
}
