import { fetchAllInvoices, fetchAllPackingLists } from "@/lib/actions";
import InvoicesTable from "@/app/components/invoices/InvoicesTable";
import PackingListsTable from "@/app/components/packing-lists/PackingListsTable";

export const dynamic = "force-dynamic";

export default async function HomePage(props: {
  params: Promise<{ locale: string }>;
}) {
  const params = await props.params;
  const locale = params.locale;

  const invoicesResult = await fetchAllInvoices();
  const packingListsResult = await fetchAllPackingLists();

  return (
    <main className="py-10 h-screen overflow-hidden">
      <div className="h-full px-4 lg:container grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Invoices Column */}
        <div className="flex flex-col overflow-hidden rounded-lg border border-border bg-card">
          <div className="px-6 py-4 border-b border-border">
            <h2 className="text-lg font-semibold">Invoices</h2>
            <p className="text-sm text-muted-foreground">View and manage your invoices</p>
          </div>
          <div className="flex-1 overflow-y-auto">
            {!invoicesResult.success ? (
              <div className="flex flex-col items-center justify-center py-16 text-center px-4">
                <h3 className="text-lg font-semibold text-destructive">
                  Failed to Load Invoices
                </h3>
                <p className="text-sm text-muted-foreground mt-2">
                  {invoicesResult.error ||
                    "Could not connect to Google Sheets. Please check your environment variables."}
                </p>
              </div>
            ) : (
              <div className="p-4">
                <InvoicesTable invoices={invoicesResult.data || []} locale={locale} />
              </div>
            )}
          </div>
        </div>

        {/* Packing Lists Column */}
        <div className="flex flex-col overflow-hidden rounded-lg border border-border bg-card">
          <div className="px-6 py-4 border-b border-border">
            <h2 className="text-lg font-semibold">Packing Lists</h2>
            <p className="text-sm text-muted-foreground">View and manage your packing lists</p>
          </div>
          <div className="flex-1 overflow-y-auto">
            {!packingListsResult.success ? (
              <div className="flex flex-col items-center justify-center py-16 text-center px-4">
                <h3 className="text-lg font-semibold text-destructive">
                  Failed to Load Packing Lists
                </h3>
                <p className="text-sm text-muted-foreground mt-2">
                  {packingListsResult.error ||
                    "Could not connect to Google Sheets. Please check your environment variables."}
                </p>
              </div>
            ) : (
              <div className="p-4">
                <PackingListsTable packingLists={packingListsResult.data || []} locale={locale} />
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
