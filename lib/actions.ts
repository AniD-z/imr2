"use server";

import {
  getAllInvoices,
  getInvoiceByNumber,
  createInvoice,
  updateInvoiceByNumber,
  deleteInvoiceByNumber,
  getNextInvoiceNumber,
  type SheetInvoiceRow,
} from "@/lib/sheets";

export type ActionResult<T = unknown> = {
  success: boolean;
  data?: T;
  error?: string;
};

/**
 * Fetches all invoices from Google Sheets
 */
export async function fetchAllInvoices(): Promise<
  ActionResult<SheetInvoiceRow[]>
> {
  try {
    const invoices = await getAllInvoices();
    return { success: true, data: invoices };
  } catch (error) {
    console.error("Error fetching invoices:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Failed to fetch invoices",
    };
  }
}

/**
 * Fetches a single invoice by its number
 */
export async function fetchInvoiceByNumber(
  invoiceNumber: number
): Promise<ActionResult<SheetInvoiceRow>> {
  try {
    const invoice = await getInvoiceByNumber(invoiceNumber);
    if (!invoice) {
      return { success: false, error: "Invoice not found" };
    }
    return { success: true, data: invoice };
  } catch (error) {
    console.error("Error fetching invoice:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to fetch invoice",
    };
  }
}

/**
 * Creates a new invoice with auto-incrementing number
 */
export async function createNewInvoice(
  fullData: string,
  customerName: string,
  customerEmail: string,
  invoiceDate: string,
  dueDate: string,
  items: string,
  subtotal: number,
  tax: number,
  total: number,
  status: string = "draft"
): Promise<ActionResult<SheetInvoiceRow>> {
  try {
    const invoice = await createInvoice({
      customer_name: customerName,
      customer_email: customerEmail,
      invoice_date: invoiceDate,
      due_date: dueDate,
      items,
      subtotal,
      tax,
      total,
      status,
      pdf_url: "",
      full_data: fullData,
    });
    return { success: true, data: invoice };
  } catch (error) {
    console.error("Error creating invoice:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Failed to create invoice",
    };
  }
}

/**
 * Updates an existing invoice
 */
export async function updateExistingInvoice(
  invoiceNumber: number,
  fullData: string,
  customerName: string,
  customerEmail: string,
  invoiceDate: string,
  dueDate: string,
  items: string,
  subtotal: number,
  tax: number,
  total: number,
  status: string
): Promise<ActionResult<SheetInvoiceRow>> {
  try {
    const invoice = await updateInvoiceByNumber(invoiceNumber, {
      customer_name: customerName,
      customer_email: customerEmail,
      invoice_date: invoiceDate,
      due_date: dueDate,
      items,
      subtotal,
      tax,
      total,
      status,
      full_data: fullData,
    });
    if (!invoice) {
      return { success: false, error: "Invoice not found" };
    }
    return { success: true, data: invoice };
  } catch (error) {
    console.error("Error updating invoice:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Failed to update invoice",
    };
  }
}

/**
 * Deletes an invoice by number
 */
export async function deleteExistingInvoice(
  invoiceNumber: number
): Promise<ActionResult<boolean>> {
  try {
    const success = await deleteInvoiceByNumber(invoiceNumber);
    if (!success) {
      return { success: false, error: "Invoice not found" };
    }
    return { success: true, data: true };
  } catch (error) {
    console.error("Error deleting invoice:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Failed to delete invoice",
    };
  }
}

/**
 * Gets the next invoice number
 */
export async function fetchNextInvoiceNumber(): Promise<ActionResult<number>> {
  try {
    const nextNumber = await getNextInvoiceNumber();
    return { success: true, data: nextNumber };
  } catch (error) {
    console.error("Error getting next invoice number:", error);
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Failed to get next invoice number",
    };
  }
}
