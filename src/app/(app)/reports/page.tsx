import Link from "next/link";
import { AppHeader } from "@/components/layout/app-header";
import { ReportGenerator } from "@/components/reports/report-generator";
import { CsvExportCard } from "@/components/reports/csv-export-card";
import { buttonVariants } from "@/lib/button-variants";
import { demoReportId } from "@/lib/data/demo";
import { FileText } from "lucide-react";
import { cn } from "@/lib/utils";
import { getAdminContext } from "@/lib/auth/admin";

export default async function ReportsPage() {
  const { isAdmin } = await getAdminContext();

  return (
    <>
      <AppHeader
        title="Reports"
        description="Generate funder narratives from aggregated visits."
        actions={
          <Link
            href={`/reports/${demoReportId}`}
            className={cn(buttonVariants({ variant: "outline" }), "gap-2")}
          >
            <FileText className="size-4" />
            View sample
          </Link>
        }
      />
      <div className="flex-1 space-y-8 px-6 py-8">
        <ReportGenerator />
        <CsvExportCard isAdmin={isAdmin} />
      </div>
    </>
  );
}
