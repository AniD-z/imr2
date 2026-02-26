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
import { BaseButton } from "@/app/components";

// Actions
import { createNewPackingList, updateExistingPackingList } from "@/lib/actions";

// Types
import { PackingListType } from "@/types";

// Icons
import { Save, Loader2, FileInput } from "lucide-react";

type PackingListActionsProps = {
  editMode?: boolean;
  packingListNumber?: number;
};

const PackingListActions = ({ editMode, packingListNumber }: PackingListActionsProps) => {
  const { getValues } = useFormContext<PackingListType>();
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [generating, setGenerating] = useState(false);

  const handleSaveToSheets = async () => {
    setSaving(true);
    try {
      const formValues = getValues();
      const fullData = JSON.stringify(formValues);

      const exporterName = formValues.exporter?.name || "";
      const consigneeName = formValues.consignee?.name || "";
      const buyerName = formValues.buyer?.name || "";
      const date = String(formValues.details?.date || "");
      const invoiceNumber = formValues.details?.invoiceNumber || "";
      const buyerOrderNumber = formValues.details?.buyerOrderNumber || "";
      const items = JSON.stringify(formValues.details?.items || []);
      const totalNetWeight = Number(formValues.details?.totalNetWeight) || 0;
      const totalGrossWeight = Number(formValues.details?.totalGrossWeight) || 0;
      const totalBoxes = formValues.details?.items?.length || 0;

      if (editMode && packingListNumber) {
        const result = await updateExistingPackingList(
          packingListNumber,
          fullData,
          exporterName,
          consigneeName,
          buyerName,
          date,
          invoiceNumber,
          buyerOrderNumber,
          items,
          totalNetWeight,
          totalGrossWeight,
          totalBoxes,
          "draft"
        );
        if (result.success) {
          toast({
            title: "Packing List updated",
            description: `Packing List #${packingListNumber} has been saved to Google Sheets.`,
          });
        } else {
          toast({
            variant: "destructive",
            title: "Error",
            description: result.error || "Failed to update packing list.",
          });
        }
      } else {
        const result = await createNewPackingList(
          fullData,
          exporterName,
          consigneeName,
          buyerName,
          date,
          invoiceNumber,
          buyerOrderNumber,
          items,
          totalNetWeight,
          totalGrossWeight,
          totalBoxes,
          "draft"
        );
        if (result.success) {
          toast({
            title: "Packing List created",
            description: `Packing List #${result.data?.packing_list_number} has been saved to Google Sheets.`,
          });
          // Navigate to the packing lists page (we'll create this later)
          router.push("/packing-lists");
        } else {
          toast({
            variant: "destructive",
            title: "Error",
            description: result.error || "Failed to create packing list.",
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

  const handleGeneratePDF = async () => {
    setGenerating(true);
    try {
      const formValues = getValues();
      
      // Generate PDF by sending data to API
      const response = await fetch("/api/packing-list/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formValues),
      });

      if (!response.ok) {
        throw new Error("Failed to generate PDF");
      }

      // Download the PDF
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `Packing-List-${formValues.details?.packingListNumber || "draft"}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      toast({
        title: "PDF Generated",
        description: "Packing list PDF has been downloaded successfully.",
      });
    } catch (err) {
      console.error("Generate PDF error:", err);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to generate PDF. Please try again.",
      });
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div className={`xl:w-[45%]`}>
      <Card className="h-auto sticky top-0 px-2">
        <CardHeader>
          <CardTitle>Actions</CardTitle>
          <CardDescription>Save and manage your packing list</CardDescription>
        </CardHeader>

        <div className="flex flex-col flex-wrap items-center gap-2">
          <div className="flex flex-wrap gap-3">
            {/* Save to Google Sheets button */}
            <BaseButton
              variant="default"
              tooltipLabel={editMode ? "Update packing list in Google Sheets" : "Save packing list to Google Sheets"}
              disabled={saving}
              onClick={handleSaveToSheets}
            >
              {saving ? <Loader2 className="animate-spin" /> : <Save />}
              {saving ? "Saving..." : editMode ? "Update Packing List" : "Save to Sheets"}
            </BaseButton>

            {/* Generate PDF button */}
            <BaseButton
              variant="outline"
              tooltipLabel="Generate packing list PDF"
              disabled={generating}
              onClick={handleGeneratePDF}
            >
              {generating ? <Loader2 className="animate-spin" /> : <FileInput />}
              {generating ? "Generating..." : "Generate PDF"}
            </BaseButton>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default PackingListActions;
