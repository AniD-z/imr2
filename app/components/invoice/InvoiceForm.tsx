"use client";

import { useMemo } from "react";

// RHF
import { useFormContext, useWatch } from "react-hook-form";

// ShadCn
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

// React Wizard
import { Wizard } from "react-use-wizard";

// Components
import {
    WizardStep,
    BillFromSection,
    BillToSection,
    ConsigneeSection,
    InvoiceDetails,
    Items,
    PaymentInformation,
    InvoiceSummary,
    ShippingDetailsSection,
    SignatoryDetailsSection,
} from "@/app/components";

// Contexts
import { useTranslationContext } from "@/contexts/TranslationContext";

// Variables
import { FORM_FILL_VALUES } from "@/lib/variables";

// Icons
import { FileText } from "lucide-react";

const InvoiceForm = () => {
    const { _t } = useTranslationContext();

    const { control, reset } = useFormContext();

    // Get invoice number variable
    const invoiceNumber = useWatch({
        name: "details.invoiceNumber",
        control,
    });

    const invoiceNumberLabel = useMemo(() => {
        if (invoiceNumber) {
            return `#${invoiceNumber}`;
        } else {
            return _t("form.newInvBadge");
        }
    }, [invoiceNumber]);

    const handleFillTestData = () => {
        reset(FORM_FILL_VALUES);
    };

    return (
        <div className={`xl:w-[55%]`}>
            <Card>
                <CardHeader>
                    <div className="flex justify-between items-start">
                        <div className="flex gap-3">
                            <CardTitle className="flex items-center gap-3">
                                <span className="uppercase">
                                    {_t("form.title")}
                                </span>
                            </CardTitle>
                            <Badge variant="secondary" className="w-fit">
                                <p style={{ fontSize: "14px" }}>
                                    {invoiceNumberLabel}
                                </p>
                            </Badge>
                        </div>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={handleFillTestData}
                            className="gap-2"
                        >
                            <FileText className="h-4 w-4" />
                            Fill Test Data
                        </Button>
                    </div>
                    <CardDescription>{_t("form.description")}</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-8">
                        <Wizard>
                            <WizardStep>
                                <div className="flex gap-x-20 gap-y-10">
                                    <BillFromSection />

                                    <BillToSection />
                                </div>
                            </WizardStep>
                            <WizardStep>
                                <ConsigneeSection />
                            </WizardStep>
                            <WizardStep>
                                <div className="flex flex-wrap gap-y-10">
                                    <InvoiceDetails />
                                </div>
                            </WizardStep>

                            <WizardStep>
                                <ShippingDetailsSection />
                            </WizardStep>

                            <WizardStep>
                                <Items />
                            </WizardStep>

                            <WizardStep>
                                <PaymentInformation />
                            </WizardStep>

                            <WizardStep>
                                <SignatoryDetailsSection />
                            </WizardStep>

                            <WizardStep>
                                <InvoiceSummary />
                            </WizardStep>
                        </Wizard>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default InvoiceForm;
