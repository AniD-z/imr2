"use client";

import { ReactNode, useEffect, useRef } from "react";

// RHF
import { FormProvider, useForm, useWatch } from "react-hook-form";

// Zod
import { zodResolver } from "@hookform/resolvers/zod";

// Schema
import { PackingListSchema } from "@/lib/schemas";

// Types
import { PackingListType } from "@/types";

// Variables
import { PACKING_LIST_DEFAULT_VALUES } from "@/lib/variables";

type PackingListProviderProps = {
    children: ReactNode;
};

const PackingListProvider = ({ children }: PackingListProviderProps) => {
    const form = useForm<PackingListType>({
        resolver: zodResolver(PackingListSchema),
        defaultValues: PACKING_LIST_DEFAULT_VALUES,
    });

    const exporterCountry = useWatch({
        control: form.control,
        name: "exporter.country",
    });

    const packingListNumber = useWatch({
        control: form.control,
        name: "details.packingListNumber",
    });

    const lastCountryRef = useRef<string>("");
    const isFetchingRef = useRef(false);

    // Auto-generate packing list number when exporter country changes
    useEffect(() => {
        const generatePackingListNumber = async () => {
            // Only generate if country changed and we don't have a number yet
            if (!exporterCountry || packingListNumber || isFetchingRef.current) {
                return;
            }

            // Only fetch if it's a different country than the last one we fetched for
            if (lastCountryRef.current === exporterCountry) {
                return;
            }

            isFetchingRef.current = true;
            lastCountryRef.current = exporterCountry;

            try {
                const response = await fetch("/api/packing-list/next-number", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ country: exporterCountry }),
                });

                if (response.ok) {
                    const data = await response.json();
                    form.setValue("details.packingListNumber", data.packingListNumber, {
                        shouldValidate: false,
                        shouldDirty: false,
                        shouldTouch: false,
                    });
                }
            } catch (error) {
                console.error("Failed to generate packing list number:", error);
            } finally {
                isFetchingRef.current = false;
            }
        };

        generatePackingListNumber();
    }, [exporterCountry, packingListNumber, form]);

    return <FormProvider {...form}>{children}</FormProvider>;
};

export default PackingListProvider;
