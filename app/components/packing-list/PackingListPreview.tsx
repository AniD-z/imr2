"use client";

import { useDebounce } from "use-debounce";
import { useFormContext } from "react-hook-form";

import PackingListTemplate from "@/app/components/templates/invoice-pdf/PackingListTemplate";
import Subheading from "@/app/components/reusables/Subheading";
import { PackingListType } from "@/types";

const DATE_OPTIONS: Intl.DateTimeFormatOptions = { day: "numeric", month: "long", year: "numeric" };

const serializeDate = (val: unknown): string => {
    if (!val) return "";
    if (val instanceof Date) {
        return val.toLocaleDateString("en-US", DATE_OPTIONS);
    }
    return String(val);
};

const PackingListPreview = () => {
    const { watch } = useFormContext<PackingListType>();
    const [debouncedWatch] = useDebounce(watch, 1000);
    const rawValues = debouncedWatch();

    const formValues: PackingListType = rawValues?.details
        ? {
              ...rawValues,
              details: {
                  ...rawValues.details,
                  date: serializeDate(rawValues.details.date),
              },
          }
        : rawValues;

    return (
        <>
            <Subheading>Live Preview:</Subheading>
            <div className="border dark:border-gray-600 rounded-xl my-1">
                <PackingListTemplate {...formValues} />
            </div>
        </>
    );
};

export default PackingListPreview;
