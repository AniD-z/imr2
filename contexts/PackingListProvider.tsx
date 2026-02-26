"use client";

import { ReactNode } from "react";

// RHF
import { FormProvider, useForm } from "react-hook-form";

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

    return <FormProvider {...form}>{children}</FormProvider>;
};

export default PackingListProvider;
