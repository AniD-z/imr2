"use client";

// RHF
import { useFormContext, FieldErrors } from "react-hook-form";

// ShadCn
import { Form } from "@/components/ui/form";
import { toast } from "@/components/ui/use-toast";

// Components
import { InvoiceActions, InvoiceForm } from "@/app/components";

// Context
import { useInvoiceContext } from "@/contexts/InvoiceContext";

// Types
import { InvoiceType } from "@/types";

type InvoiceMainProps = {
    editMode?: boolean;
    invoiceNumber?: number;
};

const getValidationErrors = (errors: FieldErrors<InvoiceType>): string[] => {
    const fields: string[] = [];

    const senderErrors = errors.sender as Record<string, unknown> | undefined;
    if (senderErrors?.name) fields.push("Seller Name");
    if (senderErrors?.email) fields.push("Seller Email");

    const receiverErrors = errors.receiver as Record<string, unknown> | undefined;
    if (receiverErrors?.name) fields.push("Buyer Name");
    if (receiverErrors?.email) fields.push("Buyer Email");

    const detailsErrors = errors.details as Record<string, unknown> | undefined;
    if (detailsErrors?.invoiceNumber) fields.push("Invoice Number");
    if (detailsErrors?.invoiceDate) fields.push("Invoice Date");
    if (detailsErrors?.dueDate) fields.push("Due Date");
    if (detailsErrors?.paymentTerms) fields.push("Payment Terms");
    if (detailsErrors?.currency) fields.push("Currency");
    if (detailsErrors?.items) fields.push("Line Items (check name, quantity > 0, price > 0)");

    return fields;
};

const InvoiceMain = ({ editMode, invoiceNumber }: InvoiceMainProps) => {
    const { handleSubmit } = useFormContext<InvoiceType>();

    // Get the needed values from invoice context
    const { onFormSubmit } = useInvoiceContext();

    const handleValidationError = (errors: FieldErrors<InvoiceType>) => {
        const fields = getValidationErrors(errors);
        toast({
            variant: "destructive",
            title: "Cannot generate PDF — please fix the following:",
            description: fields.length > 0
                ? fields.join(", ")
                : "Some fields have invalid values. Check highlighted fields in the form.",
        });
    };

    return (
        <>
            <Form {...useFormContext<InvoiceType>()}>
                <form
                    onSubmit={handleSubmit(onFormSubmit, handleValidationError)}
                >
                    <div className="flex flex-wrap">
                        <InvoiceForm />
                        <InvoiceActions editMode={editMode} invoiceNumber={invoiceNumber} />
                    </div>
                </form>
            </Form>
        </>
    );
};

export default InvoiceMain;
