"use client";

import { useState } from "react";

// RHF
import { useFormContext } from "react-hook-form";

// ShadCn
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";

// Utils
import { cn } from "@/lib/utils";

// Variables
import { DATE_OPTIONS } from "@/lib/variables";

// Icons
import { CalendarIcon } from "lucide-react";

type DatePickerFormFieldProps = {
    name: string;
    label?: string;
};

const DatePickerFormField = ({ name, label }: DatePickerFormFieldProps) => {
    const { control } = useFormContext();

    const [isPopoverOpen, setIsPopoverOpen] = useState(false);

    return (
        <>
            <FormField
                control={control}
                name={name}
                render={({ field }) => (
                    <FormItem className="flex flex-col gap-1">
                        <FormLabel>{label}:</FormLabel>
                        <Popover
                            open={isPopoverOpen}
                            onOpenChange={setIsPopoverOpen}
                        >
                            <PopoverTrigger asChild>
                                <FormControl>
                                    <Button
                                        variant={"outline"}
                                        className={cn(
                                            "w-full justify-start",
                                            !field.value && "text-muted-foreground"
                                        )}
                                    >
                                        <CalendarIcon className="mr-2 h-4 w-4 shrink-0" />
                                        <span className="truncate">
                                            {field.value ? (
                                                new Date(field.value).toLocaleDateString("en-US", DATE_OPTIONS)
                                            ) : (
                                                "Pick a date"
                                            )}
                                        </span>
                                    </Button>
                                </FormControl>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="start">
                                <Calendar
                                    mode="single"
                                    captionLayout="dropdown-buttons"
                                    defaultMonth={field.value}
                                    selected={new Date(field.value)}
                                    onSelect={(e) => {
                                        field.onChange(e);
                                        setIsPopoverOpen(false);
                                    }}
                                    disabled={(date) =>
                                        date < new Date("1900-01-01")
                                    }
                                    fromYear={1960}
                                    toYear={new Date().getFullYear() + 30}
                                    initialFocus
                                />
                            </PopoverContent>
                        </Popover>
                        <FormMessage />
                    </FormItem>
                )}
            />
        </>
    );
};

export default DatePickerFormField;
