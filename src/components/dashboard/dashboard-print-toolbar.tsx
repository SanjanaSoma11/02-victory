"use client";

import { Printer } from "lucide-react";
import { Button } from "@/components/ui/button";

export function DashboardPrintToolbar() {
  return (
    <div className="no-print flex flex-wrap items-center justify-end gap-2">
      <Button type="button" variant="outline" size="sm" className="gap-2" onClick={() => window.print()}>
        <Printer className="size-4" />
        Print / Save as PDF
      </Button>
    </div>
  );
}
