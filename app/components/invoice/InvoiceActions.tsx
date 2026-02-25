"use client";

import { useState } from "react";
import { useFormContext } from "react-hook-form";
import { useRouter } from "next/navigation";

// ShadCn
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { toast } from "@/components/ui/use-toast";

// Components
import {
  PdfViewer,
  BaseButton,
  NewInvoiceAlert,
  InvoiceLoaderModal,
  InvoiceExportModal,
} from "@/app/components";

// Contexts
import { useInvoiceContext } from "@/contexts/InvoiceContext";
import { useTranslationContext } from "@/contexts/TranslationContext";

// Actions
import { createNewInvoice, updateExistingInvoice } from "@/lib/actions";

// Types
import { InvoiceType } from "@/types";

// Icons
import { FileInput, FolderUp, Import, Plus, RotateCcw, Save, Loader2 } from "lucide-react";

type InvoiceActionsProps = {
  editMode?: boolean;
  invoiceNumber?: number;
};

const InvoiceActions = ({ editMode, invoiceNumber }: InvoiceActionsProps) => {
  const { invoicePdfLoading, newInvoice } = useInvoiceContext();
  const { _t } = useTranslationContext();
  const { getValues } = useFormContext<InvoiceType>();
  const router = useRouter();
  const [saving, setSaving] = useState(false);

  const handleSaveToSheets = async () => {
    setSaving(true);
    try {
      const formValues = getValues();
      const fullData = JSON.stringify(formValues);

      const customerName = formValues.receiver?.name || "";
      const customerEmail = formValues.receiver?.email || "";
      const invoiceDate = String(formValues.details?.invoiceDate || "");
      const dueDate = String(formValues.details?.dueDate || "");
      const items = JSON.stringify(formValues.details?.items || []);
      const subtotal = Number(formValues.details?.subTotal) || 0;
      const tax = Number(formValues.details?.taxDetails?.amount) || 0;
      const total = Number(formValues.details?.totalAmount) || 0;

      if (editMode && invoiceNumber) {
        const result = await updateExistingInvoice(
          invoiceNumber,
          fullData,
          customerName,
          customerEmail,
          invoiceDate,
          dueDate,
          items,
          subtotal,
          tax,
          total,
          "draft"
        );
        if (result.success) {
          toast({
            title: "Invoice updated",
            description: `Invoice #${invoiceNumber} has been saved to Google Sheets.`,
          });
        } else {
          toast({
            variant: "destructive",
            title: "Error",
            description: result.error || "Failed to update invoice.",
          });
        }
      } else {
        const result = await createNewInvoice(
          fullData,
          customerName,
          customerEmail,
          invoiceDate,
          dueDate,
          items,
          subtotal,
          tax,
          total,
          "draft"
        );
        if (result.success) {
          toast({
            title: "Invoice created",
            description: `Invoice #${result.data?.invoice_number} has been saved to Google Sheets.`,
          });
          // Navigate to the invoices list
          router.push("/invoices");
        } else {
          toast({
            variant: "destructive",
            title: "Error",
            description: result.error || "Failed to create invoice.",
          });
        }
      }
    } catch (err) {
      console.error("Save to sheets error:", err);
      toast({
        variant: "destructive",
        title: "Error",
        description: "An unexpected error occurred while saving.",
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className={`xl:w-[45%]`}>
      <Card className="h-auto sticky top-0 px-2">
        <CardHeader>
          <CardTitle>{_t("actions.title")}</CardTitle>
          <CardDescription>{_t("actions.description")}</CardDescription>
        </CardHeader>

        <div className="flex flex-col flex-wrap items-center gap-2">
          <div className="flex flex-wrap gap-3">
            {/* Save to Google Sheets button */}
            <BaseButton
              variant="default"
              tooltipLabel={editMode ? "Update invoice in Google Sheets" : "Save invoice to Google Sheets"}
              disabled={saving || invoicePdfLoading}
              onClick={handleSaveToSheets}
            >
              {saving ? <Loader2 className="animate-spin" /> : <Save />}
              {saving ? "Saving..." : editMode ? "Update Invoice" : "Save to Sheets"}
            </BaseButton>
          </div>

          <div className="flex flex-wrap gap-3">
            {/* Load modal button */}
            <InvoiceLoaderModal>
              <BaseButton
                variant="outline"
                tooltipLabel="Open load invoice menu"
                disabled={invoicePdfLoading}
              >
                <FolderUp />
                {_t("actions.loadInvoice")}
              </BaseButton>
            </InvoiceLoaderModal>

            {/* Export modal button */}
            <InvoiceExportModal>
              <BaseButton
                variant="outline"
                tooltipLabel="Open load invoice menu"
                disabled={invoicePdfLoading}
              >
                <Import />
                {_t("actions.exportInvoice")}
              </BaseButton>
            </InvoiceExportModal>
          </div>

          <div className="flex flex-wrap gap-3">
            {/* New invoice button */}
            <NewInvoiceAlert>
              <BaseButton
                variant="outline"
                tooltipLabel="Get a new invoice form"
                disabled={invoicePdfLoading}
              >
                <Plus />
                {_t("actions.newInvoice")}
              </BaseButton>
            </NewInvoiceAlert>

            {/* Reset form button */}
            <NewInvoiceAlert
              title="Reset form?"
              description="This will clear all fields and the saved draft."
              confirmLabel="Reset"
              onConfirm={newInvoice}
            >
              <BaseButton
                variant="destructive"
                tooltipLabel="Reset entire form"
                disabled={invoicePdfLoading}
              >
                <RotateCcw />
                Reset Form
              </BaseButton>
            </NewInvoiceAlert>

            {/* Generate pdf button */}
            <BaseButton
              type="submit"
              tooltipLabel="Generate your invoice"
              loading={invoicePdfLoading}
              loadingText="Generating your invoice"
            >
              <FileInput />
              {_t("actions.generatePdf")}
            </BaseButton>
          </div>

          <div className="w-full">
            {/* Live preview and Final pdf */}
            <PdfViewer />
          </div>
        </div>
      </Card>
    </div>
  );
};

export default InvoiceActions;
