"use client";

// ShadCn
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Components
import { InvoiceMain, PackingListMain } from "@/app/components";

// Contexts
import PackingListProvider from "@/contexts/PackingListProvider";

export const dynamic = "force-dynamic";

export default function NewInvoicePage() {
  return (
    <main className="py-10 lg:container">
      <Tabs defaultValue="invoice" className="w-full">
        <TabsList className="grid w-full max-w-md mx-auto grid-cols-2 mb-6">
          <TabsTrigger value="invoice">Invoice</TabsTrigger>
          <TabsTrigger value="packing-list">Packing List</TabsTrigger>
        </TabsList>
        
        <TabsContent value="invoice">
          <InvoiceMain />
        </TabsContent>
        
        <TabsContent value="packing-list">
          <PackingListProvider>
            <PackingListMain />
          </PackingListProvider>
        </TabsContent>
      </Tabs>
    </main>
  );
}
