import { fetchPackingListByNumber } from "@/lib/actions";
import PackingListEditor from "@/app/components/packing-lists/PackingListEditor";
import PackingListProvider from "@/contexts/PackingListProvider";

export const dynamic = "force-dynamic";

export default async function EditPackingListPage(props: {
  params: Promise<{ locale: string; id: string }>;
}) {
  const params = await props.params;
  const packingListNumber = parseInt(params.id, 10);

  if (isNaN(packingListNumber)) {
    return (
      <main className="py-10 lg:container px-4">
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <h2 className="text-xl font-semibold text-destructive">
            Invalid Packing List Number
          </h2>
          <p className="text-sm text-muted-foreground mt-2">
            The packing list number provided is not valid.
          </p>
        </div>
      </main>
    );
  }

  const result = await fetchPackingListByNumber(packingListNumber);

  if (!result.success || !result.data) {
    return (
      <main className="py-10 lg:container px-4">
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <h2 className="text-xl font-semibold text-destructive">
            Packing List Not Found
          </h2>
          <p className="text-sm text-muted-foreground mt-2">
            {result.error || `Packing List #${packingListNumber} could not be found.`}
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="py-10 lg:container">
      <PackingListProvider>
        <PackingListEditor
          packingListNumber={packingListNumber}
          fullData={result.data.full_data}
        />
      </PackingListProvider>
    </main>
  );
}
