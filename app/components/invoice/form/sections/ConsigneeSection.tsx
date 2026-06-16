"use client";

// Components
import { FormInput, Subheading } from "@/app/components";

const ConsigneeSection = () => {
    return (
        <section className="flex flex-col gap-3 max-w-xl">
            <Subheading>Consignee (Ship to):</Subheading>
            <p className="text-sm text-muted-foreground -mt-1">All fields are optional</p>

            <FormInput
                name="consignee.name"
                label="Consignee Name"
                placeholder="Consignee name"
                vertical
                className="w-full"
            />
            <FormInput
                name="consignee.address"
                label="Address"
                placeholder="Consignee address"
                vertical
                className="w-full"
            />

            <div className="grid grid-cols-2 gap-3">
                <FormInput
                    name="consignee.zipCode"
                    label="Zip Code"
                    placeholder="Zip code"
                    vertical
                    className="w-full"
                />
                <FormInput
                    name="consignee.city"
                    label="City"
                    placeholder="City"
                    vertical
                    className="w-full"
                />
            </div>

            <FormInput
                name="consignee.country"
                label="Country"
                placeholder="Country"
                vertical
                className="w-full"
            />

            <div className="grid grid-cols-2 gap-3">
                <FormInput
                    name="consignee.email"
                    label="Email"
                    placeholder="Email"
                    vertical
                    className="w-full"
                />
                <FormInput
                    name="consignee.phone"
                    label="Phone"
                    placeholder="Phone"
                    vertical
                    className="w-full"
                    type="text"
                    inputMode="tel"
                    pattern="[0-9+\-\(\)\s]*"
                    onInput={(e) => {
                        const target = e.target as HTMLInputElement;
                        target.value = target.value.replace(/[^\d\+\-\(\)\s]/g, "");
                    }}
                />
            </div>
        </section>
    );
};

export default ConsigneeSection;
