"use client";

// RHF
import { useFormContext } from "react-hook-form";

// React Wizard
import { WizardValues } from "react-use-wizard";

// Components
import { BaseButton } from "@/app/components";

// Contexts
import { useTranslationContext } from "@/contexts/TranslationContext";

// Types
import { InvoiceType, WizardStepType } from "@/types";

type WizardProgressProps = {
    wizard: WizardValues;
};

const WizardProgress = ({ wizard }: WizardProgressProps) => {
    const { activeStep, stepCount } = wizard;

    const {
        formState: { errors },
    } = useFormContext<InvoiceType>();

    const { _t } = useTranslationContext();

    const step1Valid = !errors.sender && !errors.receiver;
    const step2Valid = !errors.consignee;
    const step3Valid =
        !errors.details?.invoiceNumber &&
        !errors.details?.dueDate &&
        !errors.details?.invoiceDate &&
        !errors.details?.currency;

    const step4Valid = !errors.details?.items;
    const step5Valid = !errors.details?.paymentInformation;
    const step6Valid =
        !errors.details?.paymentTerms &&
        !errors.details?.subTotal &&
        !errors.details?.totalAmount &&
        !errors.details?.discountDetails?.amount &&
        !errors.details?.taxDetails?.amount &&
        !errors.details?.shippingDetails?.cost;
    const step7Valid = !errors.details?.signatoryDetails;
    const step8Valid = true; // Summary step

    /**
     * Determines the button variant based on the given WizardStepType.
     *
     * @param {WizardStepType} step - The wizard step object
     * @returns The button variant ("destructive", "default", or "outline") based on the step's validity and active status.
     */
    const returnButtonVariant = (step: WizardStepType) => {
        if (!step.isValid) {
            return "destructive";
        }
        if (step.id === activeStep) {
            return "default";
        } else {
            return "outline";
        }
    };

    /**
     * Checks whether the given WizardStepType has been passed or not.
     *
     * @param {WizardStepType} currentStep - The WizardStepType object
     * @returns `true` if the step has been passed, `false` if it hasn't, or `undefined` if the step is not valid.
     */
    const stepPassed = (currentStep: WizardStepType) => {
        if (currentStep.isValid) {
            return activeStep > currentStep.id ? true : false;
        }
    };

    const steps: WizardStepType[] = [
        {
            id: 0,
            label: _t("form.wizard.fromAndTo"),
            isValid: step1Valid,
        },
        {
            id: 1,
            label: _t("form.wizard.consignee") || "Consignee",
            isValid: step2Valid,
        },
        {
            id: 2,
            label: _t("form.wizard.invoiceDetails"),
            isValid: step3Valid,
        },
        {
            id: 3,
            label: _t("form.wizard.shippingDetails") || "Shipping",
            isValid: true,
        },
        {
            id: 4,
            label: _t("form.wizard.lineItems"),
            isValid: step4Valid,
        },
        {
            id: 5,
            label: _t("form.wizard.paymentInfo"),
            isValid: step5Valid,
        },
        {
            id: 6,
            label: _t("form.wizard.signatoryDetails") || "Signatory",
            isValid: step7Valid,
        },
        {
            id: 7,
            label: _t("form.wizard.summary"),
            isValid: step8Valid,
        },
    ];

    return (
        <div className="w-full overflow-hidden">
            <div className="flex gap-2 overflow-x-auto p-2">
                {steps.map((step) => (
                    <div key={step.id} className="flex items-center gap-2">
                        <BaseButton
                            variant={returnButtonVariant(step)}
                            onClick={() => wizard.goToStep(step.id)}
                            className="flex-shrink-0"
                        >
                            {step.label}
                        </BaseButton>
                        {step.id < stepCount - 1 && (
                            <div
                                className={`h-1 w-4 rounded-full ${
                                    stepPassed(step)
                                        ? "bg-green-500"
                                        : "bg-gray-300"
                                }`}
                            ></div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default WizardProgress;
