import { notFound } from "next/navigation";
import { AppHeader } from "@/components/layout/app-header";
import { ReportPreview } from "@/components/reports/report-preview";
import { demoReportId, demoSavedReport } from "@/lib/data/demo";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function ReportDetailPage({ params }: PageProps) {
  const { id } = await params;
  if (id !== demoReportId) notFound();

  return (
    <>
      <AppHeader
        title="Saved report"
        description="Read-only preview of a generated narrative (demo)."
      />
      <div className="flex-1 px-6 py-8">
        <ReportPreview
          title={demoSavedReport.title}
          periodStart={demoSavedReport.period_start}
          periodEnd={demoSavedReport.period_end}
          sections={demoSavedReport.sections}
        />
      </div>
    </>
  );
}
