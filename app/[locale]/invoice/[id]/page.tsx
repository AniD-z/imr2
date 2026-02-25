import { fetchInvoiceByNumber } from "@/lib/actions";
import InvoiceEditor from "@/app/components/invoices/InvoiceEditor";

export const dynamic = "force-dynamic";

export default async function EditInvoicePage(props: {
  params: Promise<{ locale: string; id: string }>;
}) {
  const params = await props.params;
  const invoiceNumber = parseInt(params.id, 10);

  if (isNaN(invoiceNumber)) {
    return (
      <main className="py-10 lg:container px-4">
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <h2 className="text-xl font-semibold text-destructive">
            Invalid Invoice Number
          </h2>
          <p className="text-sm text-muted-foreground mt-2">
            The invoice number provided is not valid.
          </p>
        </div>
      </main>
    );
  }

  const result = await fetchInvoiceByNumber(invoiceNumber);

  if (!result.success || !result.data) {
    return (
      <main className="py-10 lg:container px-4">
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <h2 className="text-xl font-semibold text-destructive">
            Invoice Not Found
          </h2>
          <p className="text-sm text-muted-foreground mt-2">
            {result.error || `Invoice #${invoiceNumber} could not be found.`}
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="py-10 lg:container">
      <InvoiceEditor
        invoiceNumber={invoiceNumber}
        fullData={result.data.full_data}
      />
    </main>
  );
}
