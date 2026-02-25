"use client";

import React, { useState, useMemo, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

// ShadCn
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { toast } from "@/components/ui/use-toast";

// Icons
import {
  Plus,
  Search,
  Pencil,
  Trash2,
  ArrowUpDown,
  FileText,
  Loader2,
} from "lucide-react";

// Actions
import { deleteExistingInvoice } from "@/lib/actions";

// Types
import type { SheetInvoiceRow } from "@/lib/sheets";

type SortField = "invoice_number" | "customer_name" | "total" | "status" | "invoice_date";
type SortDirection = "asc" | "desc";

type InvoicesTableProps = {
  invoices: SheetInvoiceRow[];
  locale: string;
};

const statusColorMap: Record<string, string> = {
  draft: "bg-muted text-muted-foreground",
  sent: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
  paid: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
  overdue: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
};

export default function InvoicesTable({ invoices, locale }: InvoicesTableProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortField, setSortField] = useState<SortField>("invoice_number");
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc");

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("desc");
    }
  };

  const filteredAndSorted = useMemo(() => {
    let result = [...invoices];

    // Filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (inv) =>
          inv.customer_name.toLowerCase().includes(query) ||
          inv.customer_email.toLowerCase().includes(query) ||
          inv.invoice_number.toString().includes(query) ||
          inv.status.toLowerCase().includes(query)
      );
    }

    // Sort
    result.sort((a, b) => {
      let comparison = 0;
      switch (sortField) {
        case "invoice_number":
          comparison = a.invoice_number - b.invoice_number;
          break;
        case "customer_name":
          comparison = a.customer_name.localeCompare(b.customer_name);
          break;
        case "total":
          comparison = a.total - b.total;
          break;
        case "status":
          comparison = a.status.localeCompare(b.status);
          break;
        case "invoice_date":
          comparison = a.invoice_date.localeCompare(b.invoice_date);
          break;
      }
      return sortDirection === "asc" ? comparison : -comparison;
    });

    return result;
  }, [invoices, searchQuery, sortField, sortDirection]);

  const handleDelete = async (invoiceNumber: number) => {
    setDeletingId(invoiceNumber);
    startTransition(async () => {
      const result = await deleteExistingInvoice(invoiceNumber);
      if (result.success) {
        toast({
          title: "Invoice deleted",
          description: `Invoice #${invoiceNumber} has been removed.`,
        });
        router.refresh();
      } else {
        toast({
          variant: "destructive",
          title: "Error",
          description: result.error || "Failed to delete invoice.",
        });
      }
      setDeletingId(null);
    });
  };

  const SortableHeader = ({
    field,
    children,
  }: {
    field: SortField;
    children: React.ReactNode;
  }) => (
    <TableHead>
      <button
        className="flex items-center gap-1 font-medium hover:text-foreground transition-colors"
        onClick={() => handleSort(field)}
      >
        {children}
        <ArrowUpDown className="h-3.5 w-3.5 text-muted-foreground" />
      </button>
    </TableHead>
  );

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <CardTitle className="text-2xl font-bold">Invoices</CardTitle>
            <CardDescription>
              Manage all your invoices. {invoices.length} total invoice
              {invoices.length !== 1 ? "s" : ""}.
            </CardDescription>
          </div>
          <Link href={`/${locale}/new`}>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              New Invoice
            </Button>
          </Link>
        </div>
      </CardHeader>
      <CardContent>
        {/* Search */}
        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search by name, email, number, or status..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Table */}
        {filteredAndSorted.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <FileText className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold">No invoices found</h3>
            <p className="text-sm text-muted-foreground mt-1">
              {searchQuery
                ? "Try a different search term."
                : "Create your first invoice to get started."}
            </p>
            {!searchQuery && (
              <Link href={`/${locale}/new`} className="mt-4">
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Create Invoice
                </Button>
              </Link>
            )}
          </div>
        ) : (
          <div className="rounded-md border overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <SortableHeader field="invoice_number">#</SortableHeader>
                  <SortableHeader field="customer_name">
                    Customer
                  </SortableHeader>
                  <SortableHeader field="invoice_date">Date</SortableHeader>
                  <SortableHeader field="total">Total</SortableHeader>
                  <SortableHeader field="status">Status</SortableHeader>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredAndSorted.map((invoice) => (
                  <TableRow key={invoice.invoice_number}>
                    <TableCell className="font-medium">
                      {invoice.invoice_number}
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium">{invoice.customer_name}</p>
                        <p className="text-xs text-muted-foreground">
                          {invoice.customer_email}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell className="whitespace-nowrap">
                      {invoice.invoice_date}
                    </TableCell>
                    <TableCell className="font-semibold whitespace-nowrap">
                      ${invoice.total.toLocaleString("en-US", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </TableCell>
                    <TableCell>
                      <Badge
                        className={`capitalize ${
                          statusColorMap[invoice.status] || statusColorMap.draft
                        }`}
                        variant="secondary"
                      >
                        {invoice.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          href={`/${locale}/invoice/${invoice.invoice_number}`}
                        >
                          <Button variant="outline" size="sm">
                            <Pencil className="h-3.5 w-3.5 mr-1" />
                            Edit
                          </Button>
                        </Link>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button
                              variant="destructive"
                              size="sm"
                              disabled={deletingId === invoice.invoice_number}
                            >
                              {deletingId === invoice.invoice_number ? (
                                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                              ) : (
                                <Trash2 className="h-3.5 w-3.5" />
                              )}
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>
                                Delete Invoice #{invoice.invoice_number}?
                              </AlertDialogTitle>
                              <AlertDialogDescription>
                                This will permanently remove the invoice from
                                Google Sheets. This action cannot be undone.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() =>
                                  handleDelete(invoice.invoice_number)
                                }
                              >
                                Delete
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
