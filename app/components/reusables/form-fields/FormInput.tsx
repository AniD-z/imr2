"use client";

import type { KeyboardEvent } from "react";

// RHF
import { useFormContext } from "react-hook-form";

// ShadCn
import {
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input, InputProps } from "@/components/ui/input";

type FormInputProps = {
    name: string;
    label?: string;
    labelHelper?: string;
    placeholder?: string;
    vertical?: boolean;
    formatWithCommas?: boolean;
} & InputProps;

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

const focusNextField = (target: HTMLInputElement) => {
    const formScope = target.closest("form") as HTMLElement | null;
    const customScope = target.closest("[data-enter-nav-scope='true']") as HTMLElement | null;
    const scope = formScope || customScope || document.body;

    const selectors = [
        "input:not([type='hidden']):not([disabled])",
        "textarea:not([disabled])",
        "select:not([disabled])",
        "button:not([disabled])",
        "[tabindex]:not([tabindex='-1'])",
    ].join(",");

    const focusableFields = Array.from(scope.querySelectorAll<HTMLElement>(selectors)).filter((el) => {
        const style = window.getComputedStyle(el);
        if (style.display === "none" || style.visibility === "hidden") {
            return false;
        }

        return !el.hasAttribute("disabled") && !el.hasAttribute("readonly");
    });

    const currentIndex = focusableFields.indexOf(target);
    const nextField = focusableFields.slice(currentIndex + 1).find((el) => el.tabIndex !== -1);

    if (nextField) {
        nextField.focus();
    }
};

const FormInput = ({
    name,
    label,
    labelHelper,
    placeholder,
    vertical = false,
    formatWithCommas = false,
    ...props
}: FormInputProps) => {
    const { control } = useFormContext();

    const handleEnterNavigation = (event: KeyboardEvent<HTMLInputElement>) => {
        props.onKeyDown?.(event);

        if (event.defaultPrevented) {
            return;
        }

        if (event.key !== "Enter" || event.shiftKey) {
            return;
        }

        event.preventDefault();
        focusNextField(event.currentTarget);
    };

    const verticalInput = (
        <FormField
            control={control}
            name={name}
            render={({ field }) => (
                <FormItem>
                    {label && <FormLabel>{`${label}:`}</FormLabel>}

                    {labelHelper && (
                        <span className="text-xs"> {labelHelper}</span>
                    )}

                    <FormControl>
                        <Input
                            {...field}
                            value={
                                formatWithCommas
                                    ? formatWithThousands(String(field.value ?? ""))
                                    : field.value
                            }
                            placeholder={placeholder}
                            className="w-[13rem]"
                            {...props}
                            onKeyDown={handleEnterNavigation}
                            type={formatWithCommas ? "text" : props.type}
                            inputMode={formatWithCommas ? "decimal" : props.inputMode}
                            onChange={(event) => {
                                const nextValue = formatWithCommas
                                    ? normalizeNumericInput(event.target.value)
                                    : event.target.value;

                                field.onChange(nextValue);
                                props.onChange?.(event);
                            }}
                            onBlur={(event) => {
                                field.onBlur();
                                props.onBlur?.(event);
                            }}
                        />
                    </FormControl>
                    <FormMessage />
                </FormItem>
            )}
        />
    );

    const horizontalInput = (
        <FormField
            control={control}
            name={name}
            render={({ field }) => (
                <FormItem>
                    <div className="flex w-full gap-5 items-center text-sm">
                        {label && <FormLabel className="flex-1">{`${label}:`}</FormLabel>}
                        {labelHelper && (
                            <span className="text-xs"> {labelHelper}</span>
                        )}

                        <div className="flex-1">
                            <FormControl>
                                <Input
                                    {...field}
                                    value={
                                        formatWithCommas
                                            ? formatWithThousands(String(field.value ?? ""))
                                            : field.value
                                    }
                                    placeholder={placeholder}
                                    className="w-[13rem]"
                                    {...props}
                                    onKeyDown={handleEnterNavigation}
                                    type={formatWithCommas ? "text" : props.type}
                                    inputMode={formatWithCommas ? "decimal" : props.inputMode}
                                    onChange={(event) => {
                                        const nextValue = formatWithCommas
                                            ? normalizeNumericInput(event.target.value)
                                            : event.target.value;

                                        field.onChange(nextValue);
                                        props.onChange?.(event);
                                    }}
                                    onBlur={(event) => {
                                        field.onBlur();
                                        props.onBlur?.(event);
                                    }}
                                />
                            </FormControl>
                            <FormMessage />
                        </div>
                    </div>
                </FormItem>
            )}
        />
    );
    return vertical ? verticalInput : horizontalInput;
};

export default FormInput;
