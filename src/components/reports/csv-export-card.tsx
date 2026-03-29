"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { buttonVariants } from "@/lib/button-variants";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { Upload } from "lucide-react";

export function CsvExportCard({ isAdmin }: { isAdmin: boolean }) {
  const [importing, setImporting] = useState(false);

  async function onImportFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setImporting(true);
    const formData = new FormData();
    formData.append("file", file);
    const res = await fetch("/api/import/clients", {
      method: "POST",
      body: formData,
    });
    setImporting(false);
    e.target.value = "";

    if (res.ok) {
      const data = (await res.json()) as { created?: number; skipped?: number; message?: string };
      if (data.message) {
        toast.message(data.message);
      } else {
        toast.success(`Imported ${data.created ?? 0} clients (${data.skipped ?? 0} skipped).`);
      }
    } else {
      const data = await res.json().catch(() => ({}));
      toast.error((data as { error?: string }).error ?? "Import failed.");
    }
  }

  if (!isAdmin) {
    return (
      <Card size="sm">
        <CardHeader>
          <CardTitle className="font-heading text-base">Data export & import</CardTitle>
          <CardDescription>
            Client CSV export and bulk client import are limited to administrators.
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card size="sm">
      <CardHeader>
        <CardTitle className="font-heading text-base">Data export & import</CardTitle>
        <CardDescription>
          Download roster or full service history as CSV. Upload a spreadsheet to create many client profiles at once
          (headers: first_name, last_name, date_of_birth, phone, email, address).
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
        <a
          href="/api/export/csv"
          className={cn(buttonVariants({ variant: "secondary", size: "sm" }))}
          download
        >
          Download clients (CSV)
        </a>
        <a
          href="/api/export/service-logs"
          className={cn(buttonVariants({ variant: "secondary", size: "sm" }))}
          download
        >
          Download service logs (CSV)
        </a>
        <label
          className={cn(
            buttonVariants({ variant: "outline", size: "sm" }),
            "cursor-pointer gap-2 has-[input:disabled]:pointer-events-none has-[input:disabled]:opacity-60"
          )}
        >
          <Upload className="size-4" />
          {importing ? "Importing…" : "Import clients (CSV)"}
          <input type="file" accept=".csv,text/csv" className="sr-only" disabled={importing} onChange={onImportFile} />
        </label>
      </CardContent>
    </Card>
  );
}
