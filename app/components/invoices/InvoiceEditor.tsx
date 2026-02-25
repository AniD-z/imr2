"use client";

import { useEffect, useRef } from "react";
import { useFormContext } from "react-hook-form";

// Components
import { InvoiceMain } from "@/app/components";

// Types
import { InvoiceType } from "@/types";

type InvoiceEditorProps = {
  invoiceNumber: number;
  fullData: string;
};

export default function InvoiceEditor({
  invoiceNumber,
  fullData,
}: InvoiceEditorProps) {
  const { reset } = useFormContext<InvoiceType>();
  const hasLoaded = useRef(false);

  useEffect(() => {
    if (hasLoaded.current) return;
    hasLoaded.current = true;

    try {
      const parsedData = JSON.parse(fullData);

      // Revive dates
      if (parsedData?.details) {
        if (parsedData.details.invoiceDate) {
          parsedData.details.invoiceDate = new Date(
            parsedData.details.invoiceDate
          );
        }
        if (parsedData.details.dueDate) {
          parsedData.details.dueDate = new Date(parsedData.details.dueDate);
        }
      }

      // Clear signature and logo (they are binary/base64 and don't persist well)
      if (parsedData?.details) {
        parsedData.details.invoiceLogo = "";
        parsedData.details.signature = { data: "" };
      }

      // Ensure subTotal and totalAmount are strings if the form expects them
      if (parsedData?.details) {
        if (typeof parsedData.details.subTotal === "number") {
          parsedData.details.subTotal = String(parsedData.details.subTotal);
        }
        if (typeof parsedData.details.totalAmount === "number") {
          parsedData.details.totalAmount = String(parsedData.details.totalAmount);
        }
      }

      reset(parsedData, { keepDefaultValues: false });
    } catch (err) {
      console.error("Failed to parse invoice data:", err);
    }
  }, [fullData, reset]);

  return <InvoiceMain editMode invoiceNumber={invoiceNumber} />;
}
