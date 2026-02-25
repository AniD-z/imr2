import { fetchAllInvoices } from "@/lib/actions";
import InvoicesTable from "@/app/components/invoices/InvoicesTable";

export const dynamic = "force-dynamic";

export default async function InvoicesPage(props: {
  params: Promise<{ locale: string }>;
}) {
  const params = await props.params;
  const { locale } = params;

  const result = await fetchAllInvoices();

  if (!result.success) {
    return (
      <main className="py-10 lg:container px-4">
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <h2 className="text-xl font-semibold text-destructive">
            Failed to Load Invoices
          </h2>
          <p className="text-sm text-muted-foreground mt-2 max-w-md">
            {result.error ||
              "Could not connect to Google Sheets. Please check your environment variables and service account configuration."}
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="py-10 lg:container px-4">
      <InvoicesTable invoices={result.data || []} locale={locale} />
    </main>
  );
}
