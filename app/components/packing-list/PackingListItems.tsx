"use client";

// RHF
import { useFieldArray, useFormContext } from "react-hook-form";

// ShadCn
import { Button } from "@/components/ui/button";

// Components
import { FormInput, Subheading } from "@/app/components";

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
                        className="border rounded-lg p-4 relative"
                    >
                        <div className="absolute top-2 right-2">
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

                        <div className="space-y-3">
                            {/* First Row: Box No, Description, HSN Code */}
                            <div className="grid grid-cols-12 gap-3">
                                <div className="col-span-2">
                                    <FormInput
                                        name={`details.items.${index}.boxNo`}
                                        label="Box No"
                                        placeholder="1"
                                    />
                                </div>
                                <div className="col-span-6">
                                    <FormInput
                                        name={`details.items.${index}.description`}
                                        label="Description"
                                        placeholder="BUFFER FLY VALVES 200 MM"
                                    />
                                </div>
                                <div className="col-span-4">
                                    <FormInput
                                        name={`details.items.${index}.hsnCode`}
                                        label="HSN Code"
                                        placeholder="84812900"
                                    />
                                </div>
                            </div>

                            {/* Second Row: Quantity, Net Weight, Gross Weight */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                                <FormInput
                                    name={`details.items.${index}.quantity`}
                                    label="Quantity"
                                    placeholder="1"
                                    type="number"
                                />
                                <FormInput
                                    name={`details.items.${index}.netWeight`}
                                    label="Net Weight (KG)"
                                    placeholder="0.00"
                                    type="number"
                                    step="0.01"
                                />
                                <FormInput
                                    name={`details.items.${index}.grossWeight`}
                                    label="Gross Weight (KG)"
                                    placeholder="0.00"
                                    type="number"
                                    step="0.01"
                                />
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addNewItem}
                className="w-fit gap-2"
            >
                <Plus className="h-4 w-4" />
                Add Item
            </Button>
        </section>
    );
};

export default PackingListItems;
