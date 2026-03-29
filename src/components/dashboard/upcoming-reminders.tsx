import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { buttonVariants } from "@/lib/button-variants";
import { CalendarClock } from "lucide-react";
import type { AppointmentRow } from "@/lib/data/queries";
import { cn } from "@/lib/utils";

function formatWhen(iso: string) {
  const d = new Date(iso);
  return d.toLocaleString(undefined, {
    weekday: "short",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

export function UpcomingReminders({ items }: { items: AppointmentRow[] }) {
  if (items.length === 0) return null;

  return (
    <Card className="border-primary/20 bg-primary/5" size="sm">
      <CardHeader className="flex flex-row items-start justify-between gap-4 pb-2">
        <div className="space-y-1">
          <CardTitle className="font-heading flex items-center gap-2 text-base">
            <CalendarClock className="size-4 text-primary" aria-hidden />
            Upcoming appointments
          </CardTitle>
          <CardDescription>
            In-app reminders for the next few days. Email delivery can be enabled when mail is configured.
          </CardDescription>
        </div>
        <Link href="/calendar" className={cn(buttonVariants({ variant: "outline", size: "sm" }))}>
          Open calendar
        </Link>
      </CardHeader>
      <CardContent className="space-y-2 text-sm">
        <ul className="divide-y divide-border rounded-lg border border-border bg-card">
          {items.slice(0, 6).map((a) => {
            const name = a.client
              ? `${a.client.first_name} ${a.client.last_name}`
              : "Client";
            return (
              <li key={a.id} className="flex flex-wrap items-baseline justify-between gap-2 px-3 py-2">
                <span className="font-medium text-foreground">{a.title ?? "Appointment"}</span>
                <span className="text-muted-foreground">{name}</span>
                <span className="ml-auto shrink-0 text-xs text-muted-foreground">{formatWhen(a.starts_at)}</span>
              </li>
            );
          })}
        </ul>
      </CardContent>
    </Card>
  );
}
