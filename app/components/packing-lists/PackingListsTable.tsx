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
import { deleteExistingPackingList } from "@/lib/actions";

// Types
import type { SheetPackingListRow } from "@/lib/sheets";

type SortField = "packing_list_number" | "exporter_name" | "consignee_name" | "date";
type SortDirection = "asc" | "desc";

type PackingListsTableProps = {
  packingLists: SheetPackingListRow[];
  locale: string;
};

const statusColorMap: Record<string, string> = {
  draft: "bg-muted text-muted-foreground",
  sent: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
  completed: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
};

export default function PackingListsTable({ packingLists, locale }: PackingListsTableProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortField, setSortField] = useState<SortField>("packing_list_number");
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
    let result = [...packingLists];

    // Filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (pl) =>
          pl.exporter_name.toLowerCase().includes(query) ||
          pl.consignee_name.toLowerCase().includes(query) ||
          pl.buyer_name.toLowerCase().includes(query) ||
          pl.packing_list_number.toString().includes(query) ||
          pl.invoice_number.toLowerCase().includes(query)
      );
    }

    // Sort
    result.sort((a, b) => {
      let comparison = 0;
      switch (sortField) {
        case "packing_list_number":
          comparison = a.packing_list_number - b.packing_list_number;
          break;
        case "exporter_name":
          comparison = a.exporter_name.localeCompare(b.exporter_name);
          break;
        case "consignee_name":
          comparison = a.consignee_name.localeCompare(b.consignee_name);
          break;
        case "date":
          comparison = a.date.localeCompare(b.date);
          break;
      }
      return sortDirection === "asc" ? comparison : -comparison;
    });

    return result;
  }, [packingLists, searchQuery, sortField, sortDirection]);

  const handleDelete = async (packingListNumber: number) => {
    setDeletingId(packingListNumber);
    startTransition(async () => {
      const result = await deleteExistingPackingList(packingListNumber);
      if (result.success) {
        toast({
          title: "Packing List deleted",
          description: `Packing List #${packingListNumber} has been removed.`,
        });
        router.refresh();
      } else {
        toast({
          variant: "destructive",
          title: "Error",
          description: result.error || "Failed to delete packing list.",
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
    <TableHead className="cursor-pointer" onClick={() => handleSort(field)}>
      <div className="flex items-center gap-1">
        {children}
        <ArrowUpDown className="h-4 w-4" />
      </div>
    </TableHead>
  );

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-6 w-6" />
              Packing Lists
            </CardTitle>
            <CardDescription>
              Manage your packing lists stored in Google Sheets
            </CardDescription>
          </div>
          <Link href={`/${locale}/new`}>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              New Packing List
            </Button>
          </Link>
        </div>
      </CardHeader>
      <CardContent>
        {/* Search */}
        <div className="mb-4 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by exporter, consignee, invoice number..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Table */}
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <SortableHeader field="packing_list_number">PL No.</SortableHeader>
                <SortableHeader field="exporter_name">Exporter</SortableHeader>
                <SortableHeader field="consignee_name">Consignee</SortableHeader>
                <TableHead>Invoice No.</TableHead>
                <TableHead>Total Boxes</TableHead>
                <TableHead>Total Weight</TableHead>
                <SortableHeader field="date">Date</SortableHeader>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredAndSorted.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={9} className="text-center py-8 text-muted-foreground">
                    {searchQuery ? "No packing lists found matching your search." : "No packing lists yet. Create your first one!"}
                  </TableCell>
                </TableRow>
              ) : (
                filteredAndSorted.map((pl) => (
                  <TableRow key={pl.packing_list_number}>
                    <TableCell className="font-medium">#{pl.packing_list_number}</TableCell>
                    <TableCell>{pl.exporter_name}</TableCell>
                    <TableCell>{pl.consignee_name}</TableCell>
                    <TableCell>{pl.invoice_number || "-"}</TableCell>
                    <TableCell>{pl.total_boxes}</TableCell>
                    <TableCell>
                      {pl.total_net_weight.toFixed(2)} / {pl.total_gross_weight.toFixed(2)} KG
                    </TableCell>
                    <TableCell>
                      {pl.date ? new Date(pl.date).toLocaleDateString() : "-"}
                    </TableCell>
                    <TableCell>
                      <Badge className={statusColorMap[pl.status] || statusColorMap.draft}>
                        {pl.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          asChild
                          title="Edit packing list"
                        >
                          <Link href={`/${locale}/packing-list/${pl.packing_list_number}`}>
                            <Pencil className="h-4 w-4" />
                          </Link>
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button
                              variant="ghost"
                              size="sm"
                              disabled={deletingId === pl.packing_list_number}
                              title="Delete packing list"
                            >
                              {deletingId === pl.packing_list_number ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                              ) : (
                                <Trash2 className="h-4 w-4 text-destructive" />
                              )}
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Delete Packing List?</AlertDialogTitle>
                              <AlertDialogDescription>
                                This will permanently delete Packing List #{pl.packing_list_number} from
                                Google Sheets. This action cannot be undone.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleDelete(pl.packing_list_number)}
                                className="bg-destructive hover:bg-destructive/90"
                              >
                                Delete
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        {/* Summary */}
        {filteredAndSorted.length > 0 && (
          <div className="mt-4 text-sm text-muted-foreground">
            Showing {filteredAndSorted.length} of {packingLists.length} packing list(s)
          </div>
        )}
      </CardContent>
    </Card>
  );
}
