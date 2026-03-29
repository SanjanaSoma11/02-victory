import Link from "next/link";
import { AppHeader } from "@/components/layout/app-header";
import { StatsCardsLoader } from "@/components/dashboard/stats-cards-loader";
import { DashboardPrintToolbar } from "@/components/dashboard/dashboard-print-toolbar";
import { UpcomingReminders } from "@/components/dashboard/upcoming-reminders";
import { getDashboardStats, getUpcomingAppointmentReminders } from "@/lib/data/queries";
import { buttonVariants } from "@/lib/button-variants";
import { UserPlus } from "lucide-react";
import { cn } from "@/lib/utils";

export default async function DashboardPage() {
  const [stats, reminders] = await Promise.all([
    getDashboardStats(),
    getUpcomingAppointmentReminders(72),
  ]);

  return (
    <>
      <AppHeader
        title="Dashboard"
        description="Program pulse: active caseload, period activity, and service mix."
        actions={
          <div className="flex flex-wrap items-center gap-2">
            <DashboardPrintToolbar />
            <Link href="/clients/new" className={cn(buttonVariants(), "gap-2")}>
              <UserPlus className="size-4" />
              New client
            </Link>
          </div>
        }
      />
      <div className="dashboard-print-area flex-1 space-y-8 px-6 py-8">
        <div className="print-only mb-4 border-b border-border pb-4">
          <p className="font-heading text-xl">Victory — Dashboard report</p>
          <p className="text-sm text-muted-foreground">
            Generated from live metrics. Use your browser print dialog to save as PDF.
          </p>
        </div>
        <UpcomingReminders items={reminders} />
        <StatsCardsLoader
          activeClients={stats.activeClients}
          totalRegistered={stats.totalRegistered}
          servicesWeek={stats.servicesWeek}
          servicesMonth={stats.servicesMonth}
          servicesQuarter={stats.servicesQuarter}
          totalEntries={stats.totalEntries}
          totalHours={stats.totalHours}
          weeklyTrend={stats.weeklyTrend}
          servicesByType={stats.servicesByType}
        />
      </div>
    </>
  );
}
