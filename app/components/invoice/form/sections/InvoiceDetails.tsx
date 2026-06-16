"use client";

// Components
import {
    CurrencySelector,
    DatePickerFormField,
    FormInput,
    FormFile,
    Subheading,
    TemplateSelector,
} from "@/app/components";

// Contexts
import { useTranslationContext } from "@/contexts/TranslationContext";

const InvoiceDetails = () => {
    const { _t } = useTranslationContext();

    return (
        <section className="flex flex-col gap-5 w-full">
            <Subheading>{_t("form.steps.invoiceDetails.heading")}:</Subheading>

            <div className="flex flex-col lg:flex-row gap-8">
                <div className="flex flex-col gap-3 flex-1 max-w-sm">
                    <FormFile
                        name="details.invoiceLogo"
                        label={_t("form.steps.invoiceDetails.invoiceLogo.label")}
                        placeholder={_t("form.steps.invoiceDetails.invoiceLogo.placeholder")}
                    />

                    <FormInput
                        name="details.invoiceNumber"
                        label={_t("form.steps.invoiceDetails.invoiceNumber")}
                        placeholder="Invoice number"
                        vertical
                        className="w-full"
                    />

                    <div className="grid grid-cols-2 gap-3">
                        <DatePickerFormField
                            name="details.invoiceDate"
                            label={_t("form.steps.invoiceDetails.issuedDate")}
                        />
                        <DatePickerFormField
                            name="details.dueDate"
                            label={_t("form.steps.invoiceDetails.dueDate")}
                        />
                    </div>

                    <CurrencySelector
                        name="details.currency"
                        label={_t("form.steps.invoiceDetails.currency")}
                        placeholder="Select Currency"
                    />
                </div>

                <div className="flex flex-col gap-2">
                    <TemplateSelector />
                </div>
            </div>
        </section>
    );
};

export default InvoiceDetails;
