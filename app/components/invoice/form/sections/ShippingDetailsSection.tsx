"use client";

// Components
import {
    FormInput,
    FormTextarea,
    Subheading,
} from "@/app/components";

const ShippingDetailsSection = () => {
    return (
        <section className="flex flex-col gap-3">
            <Subheading>Shipping & Delivery Details:</Subheading>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <FormInput
                    name="details.purchaseOrderNumber"
                    label="Buyer's Order No."
                    placeholder="Purchase order number"
                />
                <FormInput
                    name="details.modeOfPayment"
                    label="Mode/Terms of Payment"
                    placeholder="e.g., Wire Transfer, Letter of Credit"
                />
            </div>

            <FormTextarea
                name="details.referenceNumbers"
                label="Reference No. & Date"
                placeholder="e.g., FPNO:2025/PO-HQ02317&#10;DATED: 2025-07-28"
                rows={3}
            />

            <FormTextarea
                name="details.otherReferences"
                label="Other References"
                placeholder="Additional reference information"
                rows={2}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <FormInput
                    name="details.dispatchDocNumber"
                    label="Dispatch Doc No."
                    placeholder="Dispatch document number"
                />
                <FormInput
                    name="details.deliveryNoteDate"
                    label="Delivery Note Date"
                    placeholder="Delivery note date"
                />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <FormInput
                    name="details.dispatchedThrough"
                    label="Dispatched Through"
                    placeholder="e.g., By Sea, By Air"
                />
                <FormInput
                    name="details.finalDestination"
                    label="Final Destination"
                    placeholder="Final destination location"
                />
            </div>

            <FormInput
                name="details.vesselFlightNo"
                label="Vessel/Flight No."
                placeholder="Vessel or flight number"
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <FormInput
                    name="details.portOfLoading"
                    label="City/Port of Loading"
                    placeholder="e.g., Vizag, India"
                />
                <FormInput
                    name="details.placeOfReceipt"
                    label="Place of Receipt by Shipper"
                    placeholder="Place of receipt"
                />
            </div>

            <FormInput
                name="details.portOfDischarge"
                label="City/Port of Discharge"
                placeholder="e.g., Port Sudan, SUDAN"
            />

            <FormInput
                name="details.consigneeCountry"
                label="Consignee Country"
                placeholder="e.g., Sudan"
            />

            <FormTextarea
                name="details.termsOfDelivery"
                label="Terms of Delivery"
                placeholder="Delivery terms and conditions"
                rows={2}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <FormInput
                    name="details.countryOfOrigin"
                    label="Country of Origin of Goods"
                    placeholder="e.g., INDIA"
                />
                <FormInput
                    name="details.countryOfDestination"
                    label="Country of Final Destination"
                    placeholder="e.g., KOSTI, SUDAN"
                />
            </div>
        </section>
    );
};

export default ShippingDetailsSection;
