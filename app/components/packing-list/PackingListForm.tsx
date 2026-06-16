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

// Components
import {
    FormInput,
    DatePickerFormField,
    Subheading,
} from "@/app/components";
import PackingListItems from "./PackingListItems";

// Variables
import { PACKING_LIST_FILL_VALUES } from "@/lib/variables";

// Icons
import { FileText } from "lucide-react";

// Types
import { PackingListType } from "@/types";

const PackingListForm = () => {
    const { control, reset } = useFormContext<PackingListType>();

    const packingListNumber = useWatch({
        name: "details.packingListNumber",
        control,
    });

    const packingListLabel = useMemo(() => {
        if (packingListNumber) {
            return `#${packingListNumber}`;
        } else {
            return "New Packing List";
        }
    }, [packingListNumber]);

    const handleFillTestData = () => {
        reset(PACKING_LIST_FILL_VALUES);
    };

    return (
        <div className="w-full xl:w-[55%]" data-enter-nav-scope="true">
            <Card>
                <CardHeader>
                    <div className="flex justify-between items-start">
                        <div className="flex gap-3">
                            <CardTitle className="flex items-center gap-3">
                                <span className="uppercase">Packing List</span>
                            </CardTitle>
                            <Badge variant="secondary" className="w-fit">
                                <p style={{ fontSize: "14px" }}>
                                    {packingListLabel}
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
                    <CardDescription>
                        Create a packing list for shipment documentation
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-8">
                        {/* Exporter Section */}
                        <section className="flex flex-col gap-3">
                            <Subheading>Exporter:</Subheading>
                            <FormInput
                                name="exporter.name"
                                label="Company Name"
                                placeholder="Company name"
                                vertical
                                className="w-full"
                            />
                            <FormInput
                                name="exporter.address"
                                label="Address"
                                placeholder="Address"
                                vertical
                                className="w-full"
                            />
                            <div className="grid grid-cols-2 gap-3">
                                <FormInput
                                    name="exporter.zipCode"
                                    label="Zip Code"
                                    placeholder="Zip code"
                                    vertical
                                    className="w-full"
                                />
                                <FormInput
                                    name="exporter.city"
                                    label="City"
                                    placeholder="City"
                                    vertical
                                    className="w-full"
                                />
                            </div>
                            <FormInput
                                name="exporter.country"
                                label="Country"
                                placeholder="Country"
                                vertical
                                className="w-full"
                            />
                            <div className="grid grid-cols-2 gap-3">
                                <FormInput
                                    name="exporter.gst"
                                    label="GST"
                                    placeholder="GST number"
                                    vertical
                                    className="w-full"
                                />
                                <FormInput
                                    name="exporter.adCode"
                                    label="AD Code"
                                    placeholder="AD Code"
                                    vertical
                                    className="w-full"
                                />
                            </div>
                        </section>

                        {/* Consignee Section */}
                        <section className="flex flex-col gap-3">
                            <Subheading>Consignee:</Subheading>
                            <FormInput
                                name="consignee.name"
                                label="Name"
                                placeholder="Consignee name"
                                vertical
                                className="w-full"
                            />
                            <FormInput
                                name="consignee.address"
                                label="Address"
                                placeholder="Address"
                                vertical
                                className="w-full"
                            />
                            <div className="grid grid-cols-2 gap-3">
                                <FormInput
                                    name="consignee.city"
                                    label="City"
                                    placeholder="City"
                                    vertical
                                    className="w-full"
                                />
                                <FormInput
                                    name="consignee.country"
                                    label="Country"
                                    placeholder="Country"
                                    vertical
                                    className="w-full"
                                />
                            </div>
                        </section>

                        {/* Buyer Section */}
                        <section className="flex flex-col gap-3">
                            <Subheading>Buyer:</Subheading>
                            <FormInput
                                name="buyer.name"
                                label="Name"
                                placeholder="Buyer name"
                                vertical
                                className="w-full"
                            />
                            <FormInput
                                name="buyer.address"
                                label="Address"
                                placeholder="Address"
                                vertical
                                className="w-full"
                            />
                            <div className="grid grid-cols-2 gap-3">
                                <FormInput
                                    name="buyer.city"
                                    label="City"
                                    placeholder="City"
                                    vertical
                                    className="w-full"
                                />
                                <FormInput
                                    name="buyer.country"
                                    label="Country"
                                    placeholder="Country"
                                    vertical
                                    className="w-full"
                                />
                            </div>
                        </section>

                        {/* Packing List Details */}
                        <section className="flex flex-col gap-3">
                            <Subheading>Packing List Details:</Subheading>
                            <FormInput
                                name="details.packingListNumber"
                                label="Packing List No"
                                placeholder="PL-001/2025"
                                vertical
                                className="w-full"
                            />
                            <DatePickerFormField
                                name="details.date"
                                label="Date"
                            />
                            <div className="grid grid-cols-2 gap-3">
                                <FormInput
                                    name="details.invoiceNumber"
                                    label="Invoice No"
                                    placeholder="INV-001"
                                    vertical
                                    className="w-full"
                                />
                                <FormInput
                                    name="details.buyerOrderNumber"
                                    label="Buyer's Order No"
                                    placeholder="PO-001"
                                    vertical
                                    className="w-full"
                                />
                            </div>
                            <FormInput
                                name="details.referenceNumber"
                                label="Reference No"
                                placeholder="REF-001"
                                vertical
                                className="w-full"
                            />
                        </section>

                        {/* Shipment Details */}
                        <section className="flex flex-col gap-3">
                            <Subheading>Shipment Details:</Subheading>
                            <div className="grid grid-cols-2 gap-3">
                                <FormInput
                                    name="details.iecNo"
                                    label="IEC No"
                                    placeholder="IEC number"
                                    vertical
                                    className="w-full"
                                />
                                <FormInput
                                    name="details.freightMode"
                                    label="Freight Mode"
                                    placeholder="e.g., By Sea"
                                    vertical
                                    className="w-full"
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                                <FormInput
                                    name="details.portOfLoading"
                                    label="Port of Loading"
                                    placeholder="e.g., Mumbai - India"
                                    vertical
                                    className="w-full"
                                />
                                <FormInput
                                    name="details.countryOfOrigin"
                                    label="Country of Origin"
                                    placeholder="e.g., INDIA"
                                    vertical
                                    className="w-full"
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                                <FormInput
                                    name="details.portOfDischarge"
                                    label="Port of Discharge"
                                    placeholder="e.g., Port Sudan"
                                    vertical
                                    className="w-full"
                                />
                                <FormInput
                                    name="details.finalDestination"
                                    label="Final Destination"
                                    placeholder="e.g., Kosti, Sudan"
                                    vertical
                                    className="w-full"
                                />
                            </div>
                            <FormInput
                                name="details.countryOfFinalDestination"
                                label="Country of Final Destination"
                                placeholder="e.g., SUDAN"
                                vertical
                                className="w-full"
                            />
                        </section>

                        {/* Items */}
                        <PackingListItems />

                        {/* Total Weights */}
                        <section className="flex flex-col gap-3">
                            <Subheading>Total Weights:</Subheading>
                            <div className="grid grid-cols-2 gap-3">
                                <FormInput
                                    name="details.totalNetWeight"
                                    label="Total Net Weight (KG)"
                                    placeholder="0.00"
                                    vertical
                                    className="w-full"
                                    type="number"
                                    step="0.01"
                                />
                                <FormInput
                                    name="details.totalGrossWeight"
                                    label="Total Gross Weight (KG)"
                                    placeholder="0.00"
                                    vertical
                                    className="w-full"
                                    type="number"
                                    step="0.01"
                                />
                            </div>
                        </section>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default PackingListForm;
