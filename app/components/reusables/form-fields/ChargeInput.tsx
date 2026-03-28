"use client";

import React from "react";

// RHF
import { useFormContext } from "react-hook-form";

// ShadCn
import {
    FormControl,
    FormField,
    FormItem,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

// Components
import { BaseButton } from "@/app/components";

// Icons
import { Percent, RefreshCw } from "lucide-react";

// Types
import { NameType } from "@/types";

type ChargeInputProps = {
    label: string;
    name: NameType;
    switchAmountType: (
        type: string,
        setType: React.Dispatch<React.SetStateAction<string>>
    ) => void;
    type: string;
    setType: React.Dispatch<React.SetStateAction<string>>;
    currency: string;
    showToggle?: boolean;
};

const normalizeNumericInput = (value: string) => {
    const sanitized = value.replace(/,/g, "").replace(/[^\d.]/g, "");
    const [wholePart, ...decimalParts] = sanitized.split(".");
    const decimalPart = decimalParts.join("");

    if (decimalParts.length === 0) {
        return wholePart;
    }

    return `${wholePart}.${decimalPart}`;
};

const formatWithThousands = (value: string) => {
    if (!value) {
        return "";
    }

    const [wholePart, decimalPart] = value.split(".");
    const formattedWhole = wholePart.replace(/\B(?=(\d{3})+(?!\d))/g, ",");

    if (value.endsWith(".")) {
        return `${formattedWhole}.`;
    }

    return decimalPart != undefined
        ? `${formattedWhole}.${decimalPart}`
        : formattedWhole;
};

const ChargeInput = ({
    label,
    name,
    switchAmountType,
    type,
    setType,
    currency,
    showToggle = true,
}: ChargeInputProps) => {
    const { control } = useFormContext();

    return (
        <>
            <div className="flex justify-between items-center">
                <div>{label}</div>

                <div className="flex items-center gap-1">
                    {showToggle && (
                        <BaseButton
                            variant="ghost"
                            size="icon"
                            onClick={() => switchAmountType(type, setType)}
                        >
                            <RefreshCw />
                        </BaseButton>
                    )}

                    <FormField
                        control={control}
                        name={name}
                        render={({ field }) => (
                            <FormItem>
                                <div className="flex justify-between items-center text-sm">
                                    <FormControl>
                                        <Input
                                            {...field}
                                            value={formatWithThousands(String(field.value ?? ""))}
                                            className="w-[7rem]"
                                            placeholder={label}
                                            type="text"
                                            inputMode="decimal"
                                            min="0"
                                            max="1000000"
                                            step="0.01"
                                            onChange={(event) => {
                                                field.onChange(normalizeNumericInput(event.target.value));
                                            }}
                                            onBlur={(event) => {
                                                field.onBlur();
                                            }}
                                        />
                                    </FormControl>
                                </div>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    {showToggle && type == "percentage" ? <Percent /> : <div>{currency}</div>}
                </div>
            </div>
        </>
    );
};

export default ChargeInput;
