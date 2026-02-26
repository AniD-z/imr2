"use client";

// RHF
import { useFormContext } from "react-hook-form";

// Components
import {
    FormInput,
    Subheading,
} from "@/app/components";

// Contexts
import { useTranslationContext } from "@/contexts/TranslationContext";

const ConsigneeSection = () => {
    const { _t } = useTranslationContext();

    return (
        <section className="flex flex-col gap-3">
            <Subheading>Consignee (Ship to):</Subheading>
            <FormInput
                name="consignee.name"
                label="Consignee Name"
                placeholder="Consignee name"
            />
            <FormInput
                name="consignee.address"
                label="Consignee Address"
                placeholder="Consignee address"
            />
            <FormInput
                name="consignee.zipCode"
                label="Zip Code"
                placeholder="Consignee zip code"
            />
            <FormInput
                name="consignee.city"
                label="City"
                placeholder="Consignee city"
            />
            <FormInput
                name="consignee.country"
                label="Country"
                placeholder="Consignee country"
            />
            <FormInput
                name="consignee.email"
                label="Email (Optional)"
                placeholder="Consignee email"
            />
            <FormInput
                name="consignee.phone"
                label="Phone (Optional)"
                placeholder="Consignee phone number"
                type="text"
                inputMode="tel"
                pattern="[0-9+\\-\\(\\)\\s]*"
                onInput={(e) => {
                    const target = e.target as HTMLInputElement;
                    target.value = target.value.replace(/[^\d\+\-\(\)\s]/g, "");
                }}
            />
        </section>
    );
};

export default ConsigneeSection;
