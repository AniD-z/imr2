"use client";

// RHF
import { useFieldArray, useFormContext } from "react-hook-form";

// ShadCn
import { Button } from "@/components/ui/button";

// Components
import { FormInput, Subheading, BaseButton } from "@/app/components";

// Icons
import { Plus, Trash2 } from "lucide-react";

// Types
import { PackingListType } from "@/types";

const PackingListItems = () => {
    const { control } = useFormContext<PackingListType>();

    const { fields, append, remove } = useFieldArray({
        control: control,
        name: "details.items",
    });

    const addNewItem = () => {
        append({
            boxNo: "",
            description: "",
            hsnCode: "",
            quantity: 1,
            boxDimension: "",
            netWeight: 0,
            grossWeight: 0,
        });
    };

    const removeItem = (index: number) => {
        remove(index);
    };

    return (
        <section className="flex flex-col gap-3">
            <Subheading>Items:</Subheading>

            <div className="space-y-4">
                {fields.map((field, index) => (
                    <div
                        key={field.id}
                        className="border rounded-lg p-3 sm:p-4 bg-gray-50 dark:bg-slate-800 dark:border-gray-600"
                    >
                        {/* Item Header */}
                        <div className="flex justify-between items-center mb-4 pb-3 border-b">
                            <p className="font-medium text-sm">
                                Item #{index + 1}
                            </p>
                            <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={() => removeItem(index)}
                                disabled={fields.length === 1}
                            >
                                <Trash2 className="h-4 w-4 text-red-500" />
                            </Button>
                        </div>

                        {/* Form Fields */}
                        <div className="flex flex-wrap gap-3">
                            <FormInput
                                name={`details.items.${index}.boxNo`}
                                label="Box No"
                                placeholder="1"
                                className="w-[5rem]"
                                vertical
                            />
                            <FormInput
                                name={`details.items.${index}.description`}
                                label="Description"
                                placeholder="BUFFER FLY VALVES 200 MM"
                                className="flex-1 min-w-[12rem]"
                                vertical
                            />
                            <FormInput
                                name={`details.items.${index}.hsnCode`}
                                label="HSN Code"
                                placeholder="84812900"
                                className="w-[7rem]"
                                vertical
                            />
                            <FormInput
                                name={`details.items.${index}.quantity`}
                                label="Qty"
                                placeholder="1"
                                type="number"
                                className="w-[5rem]"
                                vertical
                            />
                            <FormInput
                                name={`details.items.${index}.boxDimension`}
                                label="Box Dimension"
                                placeholder="L x W x H"
                                className="w-[8rem]"
                                vertical
                            />
                            <FormInput
                                name={`details.items.${index}.netWeight`}
                                label="Net Wt (KG)"
                                placeholder="0.00"
                                type="number"
                                step="0.01"
                                className="w-[7rem]"
                                vertical
                            />
                            <FormInput
                                name={`details.items.${index}.grossWeight`}
                                label="Gross Wt (KG)"
                                placeholder="0.00"
                                type="number"
                                step="0.01"
                                className="w-[7rem]"
                                vertical
                            />
                        </div>
                    </div>
                ))}
            </div>

            <BaseButton
                onClick={addNewItem}
                className="w-fit gap-2"
            >
                <Plus className="h-4 w-4" />
                Add Item
            </BaseButton>
        </section>
    );
};

export default PackingListItems;
