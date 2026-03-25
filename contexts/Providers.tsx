"use client";

import React, { useEffect } from "react";

// RHF
import { FormProvider, useForm, useWatch } from "react-hook-form";

// Zod
import { zodResolver } from "@hookform/resolvers/zod";

// Schema
import { InvoiceSchema } from "@/lib/schemas";

// Context
import { ThemeProvider } from "@/contexts/ThemeProvider";
import { TranslationProvider } from "@/contexts/TranslationContext";
import { InvoiceContextProvider } from "@/contexts/InvoiceContext";
import { ChargesContextProvider } from "@/contexts/ChargesContext";

// Types
import { InvoiceType } from "@/types";

// Variables
import {
  FORM_DEFAULT_VALUES,
  LOCAL_STORAGE_INVOICE_DRAFT_KEY,
} from "@/lib/variables";

// Helpers
const readDraftFromLocalStorage = (): InvoiceType | null => {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(LOCAL_STORAGE_INVOICE_DRAFT_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    // revive dates
    if (parsed?.details) {
      if (parsed.details.invoiceDate)
        parsed.details.invoiceDate = new Date(parsed.details.invoiceDate);
      if (parsed.details.dueDate)
        parsed.details.dueDate = new Date(parsed.details.dueDate);
    }
    return parsed;
  } catch {
    return null;
  }
};

type ProvidersProps = {
  children: React.ReactNode;
};

const Providers = ({ children }: ProvidersProps) => {
  const form = useForm<InvoiceType>({
    resolver: zodResolver(InvoiceSchema),
    defaultValues: FORM_DEFAULT_VALUES,
  });

  const senderCountry = useWatch({
    control: form.control,
    name: "sender.country",
  });

  const invoiceNumber = useWatch({
    control: form.control,
    name: "details.invoiceNumber",
  });

  const lastCountryRef = React.useRef<string>("");
  const isFetchingRef = React.useRef(false);

  // Hydrate once on mount
  useEffect(() => {
    const draft = readDraftFromLocalStorage();
    if (draft) {
      form.reset(draft, { keepDefaultValues: false });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Auto-generate invoice number when sender country changes
  useEffect(() => {
    const generateInvoiceNumber = async () => {
      // Only generate if country changed and we don't have a number yet
      if (!senderCountry || invoiceNumber || isFetchingRef.current) {
        return;
      }

      // Only fetch if it's a different country than the last one we fetched for
      if (lastCountryRef.current === senderCountry) {
        return;
      }

      isFetchingRef.current = true;
      lastCountryRef.current = senderCountry;

      try {
        const response = await fetch("/api/invoice/next-number", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ country: senderCountry }),
        });

        if (response.ok) {
          const data = await response.json();
          form.setValue("details.invoiceNumber", data.invoiceNumber, {
            shouldValidate: false,
            shouldDirty: false,
            shouldTouch: false,
          });
        }
      } catch (error) {
        console.error("Failed to generate invoice number:", error);
      } finally {
        isFetchingRef.current = false;
      }
    };

    generateInvoiceNumber();
  }, [senderCountry, invoiceNumber, form]);

  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="light"
      enableSystem
      disableTransitionOnChange
    >
      <TranslationProvider>
        <FormProvider {...form}>
          <InvoiceContextProvider>
            <ChargesContextProvider>{children}</ChargesContextProvider>
          </InvoiceContextProvider>
        </FormProvider>
      </TranslationProvider>
    </ThemeProvider>
  );
};

export default Providers;
