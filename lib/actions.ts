"use server";

import {
  getAllInvoices,
  getInvoiceByNumber,
  createInvoice,
  updateInvoiceByNumber,
  deleteInvoiceByNumber,
  getNextInvoiceNumber,
  type SheetInvoiceRow,
  getAllPackingLists,
  getPackingListByNumber,
  createPackingList,
  updatePackingListByNumber,
  deletePackingListByNumber,
  getNextPackingListNumber,
  type SheetPackingListRow,
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

// ============================================
// PACKING LIST ACTIONS
// ============================================

/**
 * Fetches all packing lists from Google Sheets
 */
export async function fetchAllPackingLists(): Promise<
  ActionResult<SheetPackingListRow[]>
> {
  try {
    const packingLists = await getAllPackingLists();
    return { success: true, data: packingLists };
  } catch (error) {
    console.error("Error fetching packing lists:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Failed to fetch packing lists",
    };
  }
}

/**
 * Fetches a single packing list by its number
 */
export async function fetchPackingListByNumber(
  packingListNumber: number
): Promise<ActionResult<SheetPackingListRow>> {
  try {
    const packingList = await getPackingListByNumber(packingListNumber);
    if (!packingList) {
      return { success: false, error: "Packing list not found" };
    }
    return { success: true, data: packingList };
  } catch (error) {
    console.error("Error fetching packing list:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to fetch packing list",
    };
  }
}

/**
 * Creates a new packing list with auto-incrementing number
 */
export async function createNewPackingList(
  fullData: string,
  exporterName: string,
  consigneeName: string,
  buyerName: string,
  date: string,
  invoiceNumber: string,
  buyerOrderNumber: string,
  items: string,
  totalNetWeight: number,
  totalGrossWeight: number,
  totalBoxes: number,
  status: string = "draft"
): Promise<ActionResult<SheetPackingListRow>> {
  try {
    const packingList = await createPackingList({
      exporter_name: exporterName,
      consignee_name: consigneeName,
      buyer_name: buyerName,
      date,
      invoice_number: invoiceNumber,
      buyer_order_number: buyerOrderNumber,
      items,
      total_net_weight: totalNetWeight,
      total_gross_weight: totalGrossWeight,
      total_boxes: totalBoxes,
      status,
      pdf_url: "",
      full_data: fullData,
    });
    return { success: true, data: packingList };
  } catch (error) {
    console.error("Error creating packing list:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Failed to create packing list",
    };
  }
}

/**
 * Updates an existing packing list
 */
export async function updateExistingPackingList(
  packingListNumber: number,
  fullData: string,
  exporterName: string,
  consigneeName: string,
  buyerName: string,
  date: string,
  invoiceNumber: string,
  buyerOrderNumber: string,
  items: string,
  totalNetWeight: number,
  totalGrossWeight: number,
  totalBoxes: number,
  status: string
): Promise<ActionResult<SheetPackingListRow>> {
  try {
    const packingList = await updatePackingListByNumber(packingListNumber, {
      exporter_name: exporterName,
      consignee_name: consigneeName,
      buyer_name: buyerName,
      date,
      invoice_number: invoiceNumber,
      buyer_order_number: buyerOrderNumber,
      items,
      total_net_weight: totalNetWeight,
      total_gross_weight: totalGrossWeight,
      total_boxes: totalBoxes,
      status,
      full_data: fullData,
    });
    if (!packingList) {
      return { success: false, error: "Packing list not found" };
    }
    return { success: true, data: packingList };
  } catch (error) {
    console.error("Error updating packing list:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Failed to update packing list",
    };
  }
}

/**
 * Deletes a packing list by number
 */
export async function deleteExistingPackingList(
  packingListNumber: number
): Promise<ActionResult<boolean>> {
  try {
    const success = await deletePackingListByNumber(packingListNumber);
    if (!success) {
      return { success: false, error: "Packing list not found" };
    }
    return { success: true, data: true };
  } catch (error) {
    console.error("Error deleting packing list:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Failed to delete packing list",
    };
  }
}

/**
 * Gets the next packing list number
 */
export async function fetchNextPackingListNumber(): Promise<ActionResult<number>> {
  try {
    const nextNumber = await getNextPackingListNumber();
    return { success: true, data: nextNumber };
  } catch (error) {
    console.error("Error getting next packing list number:", error);
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Failed to get next packing list number",
    };
  }
}
