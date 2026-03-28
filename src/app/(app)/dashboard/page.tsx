import Link from "next/link";
import { AppHeader } from "@/components/layout/app-header";
import { StatsCardsLoader } from "@/components/dashboard/stats-cards-loader";
import { buttonVariants } from "@/lib/button-variants";
import { UserPlus } from "lucide-react";
import { cn } from "@/lib/utils";

export default function DashboardPage() {
  return (
    <>
      <AppHeader
        title="Dashboard"
        description="Program pulse: visits, hours, and service mix. Demo metrics light up the UI before Supabase is connected."
        actions={
          <Link href="/clients/new" className={cn(buttonVariants(), "gap-2")}>
            <UserPlus className="size-4" />
            New client
          </Link>
        }
      />
      <div className="flex-1 space-y-8 px-6 py-8">
        <StatsCardsLoader />
      </div>
    </>
  );
}
