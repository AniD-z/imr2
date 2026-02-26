"use client";

// Components
import {
    FormInput,
    FormFile,
    Subheading,
} from "@/app/components";

const SignatoryDetailsSection = () => {
    return (
        <section className="flex flex-col gap-3">
            <Subheading>Signatory & Company Stamp Details:</Subheading>
            
            <FormFile
                name="details.signatoryDetails.companyStamp"
                label="Company Stamp/Seal"
                placeholder="Upload company stamp"
            />

            <FormInput
                name="details.signatoryDetails.name"
                label="Signatory Name"
                placeholder="e.g., N. Rajender"
            />
            
            <FormInput
                name="details.signatoryDetails.designation"
                label="Signatory Designation"
                placeholder="e.g., Head Section"
            />

            <FormInput
                name="details.signatoryDetails.department"
                label="Department"
                placeholder="e.g., Supply & Procurement"
            />

            <FormInput
                name="details.signatoryDetails.phone"
                label="Contact Phone"
                placeholder="e.g., +919095959743"
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

export default SignatoryDetailsSection;
