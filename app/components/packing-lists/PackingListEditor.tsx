"use client";

import { useEffect, useRef } from "react";
import { useFormContext } from "react-hook-form";

// Components
import PackingListMain from "@/app/components/packing-list/PackingListMain";

// Types
import { PackingListType } from "@/types";

type PackingListEditorProps = {
  packingListNumber: number;
  fullData: string;
};

export default function PackingListEditor({
  packingListNumber,
  fullData,
}: PackingListEditorProps) {
  const { reset } = useFormContext<PackingListType>();
  const hasLoaded = useRef(false);

  useEffect(() => {
    if (hasLoaded.current) return;
    hasLoaded.current = true;

    try {
      const parsedData = JSON.parse(fullData);

      // Ensure packingListNumber is set
      if (parsedData?.details) {
        parsedData.details.packingListNumber = String(packingListNumber);
      }

      reset(parsedData, { keepDefaultValues: false });
    } catch (err) {
      console.error("Failed to parse packing list data:", err);
    }
  }, [fullData, reset, packingListNumber]);

  return <PackingListMain editMode packingListNumber={packingListNumber} />;
}
