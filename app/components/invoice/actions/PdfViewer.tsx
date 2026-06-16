"use client";

// Debounce
import { useDebounce } from "use-debounce";

// RHF
import { useFormContext } from "react-hook-form";

// Components
import { FinalPdf, LivePreview } from "@/app/components";

// Contexts
import { useInvoiceContext } from "@/contexts/InvoiceContext";

// Types
import { InvoiceType } from "@/types";

const DATE_OPTIONS: Intl.DateTimeFormatOptions = { day: "numeric", month: "long", year: "numeric" };

// At runtime, date pickers store Date objects even though the Zod output type is string.
// This helper converts them to strings so the templates can safely render them.
const serializeDate = (val: unknown): string | undefined => {
    if (!val) return undefined;
    if ((val as unknown) instanceof Date) {
        return (val as Date).toLocaleDateString("en-US", DATE_OPTIONS);
    }
    return String(val);
};

const PdfViewer = () => {
    const { invoicePdf } = useInvoiceContext();

    const { watch } = useFormContext<InvoiceType>();

    const [debouncedWatch] = useDebounce(watch, 1000);
    const rawValues = debouncedWatch();

    const formValues: InvoiceType = rawValues?.details
        ? {
              ...rawValues,
              details: {
                  ...rawValues.details,
                  invoiceDate: serializeDate(rawValues.details.invoiceDate),
                  dueDate: serializeDate(rawValues.details.dueDate),
              },
          }
        : rawValues;

    return (
        <div className="my-3">
            {invoicePdf.size == 0 ? (
                <LivePreview data={formValues} />
            ) : (
                <FinalPdf />
            )}
        </div>
    );
};

export default PdfViewer;
