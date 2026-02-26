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
        <div className="xl:w-[55%]">
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
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                <FormInput
                                    name="exporter.name"
                                    label="Company Name"
                                    placeholder="Company name"
                                />
                                <FormInput
                                    name="exporter.address"
                                    label="Address"
                                    placeholder="Address"
                                />
                                <FormInput
                                    name="exporter.city"
                                    label="City"
                                    placeholder="City"
                                />
                                <FormInput
                                    name="exporter.zipCode"
                                    label="Zip Code"
                                    placeholder="Zip code"
                                />
                                <FormInput
                                    name="exporter.country"
                                    label="Country"
                                    placeholder="Country"
                                />
                                <FormInput
                                    name="exporter.gst"
                                    label="GST"
                                    placeholder="GST number"
                                />
                                <FormInput
                                    name="exporter.adCode"
                                    label="AD Code"
                                    placeholder="AD Code"
                                />
                            </div>
                        </section>

                        {/* Consignee Section */}
                        <section className="flex flex-col gap-3">
                            <Subheading>Consignee:</Subheading>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                <FormInput
                                    name="consignee.name"
                                    label="Name"
                                    placeholder="Consignee name"
                                />
                                <FormInput
                                    name="consignee.address"
                                    label="Address"
                                    placeholder="Address"
                                />
                                <FormInput
                                    name="consignee.city"
                                    label="City"
                                    placeholder="City"
                                />
                                <FormInput
                                    name="consignee.country"
                                    label="Country"
                                    placeholder="Country"
                                />
                            </div>
                        </section>

                        {/* Buyer Section */}
                        <section className="flex flex-col gap-3">
                            <Subheading>Buyer:</Subheading>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                <FormInput
                                    name="buyer.name"
                                    label="Name"
                                    placeholder="Buyer name"
                                />
                                <FormInput
                                    name="buyer.address"
                                    label="Address"
                                    placeholder="Address"
                                />
                                <FormInput
                                    name="buyer.city"
                                    label="City"
                                    placeholder="City"
                                />
                                <FormInput
                                    name="buyer.country"
                                    label="Country"
                                    placeholder="Country"
                                />
                            </div>
                        </section>

                        {/* Packing List Details */}
                        <section className="flex flex-col gap-3">
                            <Subheading>Packing List Details:</Subheading>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                <FormInput
                                    name="details.packingListNumber"
                                    label="Packing List No"
                                    placeholder="PL-001/2025"
                                />
                                <DatePickerFormField
                                    name="details.date"
                                    label="Date"
                                />
                                <FormInput
                                    name="details.invoiceNumber"
                                    label="Invoice No"
                                    placeholder="INV-001"
                                />
                                <FormInput
                                    name="details.buyerOrderNumber"
                                    label="Buyer's Order No"
                                    placeholder="PO-001"
                                />
                                <FormInput
                                    name="details.referenceNumber"
                                    label="Reference No"
                                    placeholder="REF-001"
                                />
                            </div>
                        </section>

                        {/* Items */}
                        <PackingListItems />

                        {/* Total Weights */}
                        <section className="flex flex-col gap-3">
                            <Subheading>Total Weights:</Subheading>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                <FormInput
                                    name="details.totalNetWeight"
                                    label="Total Net Weight (KG)"
                                    placeholder="0.00"
                                    type="number"
                                    step="0.01"
                                />
                                <FormInput
                                    name="details.totalGrossWeight"
                                    label="Total Gross Weight (KG)"
                                    placeholder="0.00"
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
