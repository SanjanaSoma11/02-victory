"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { AppointmentRow } from "@/lib/data/queries";

function dayLabel(d: Date) {
  return d.toLocaleDateString(undefined, { weekday: "long", month: "short", day: "numeric" });
}

function groupByDay(rows: AppointmentRow[], start: Date, end: Date) {
  const map = new Map<string, AppointmentRow[]>();
  const cur = new Date(start);
  while (cur <= end) {
    const key = toYmd(cur);
    map.set(key, []);
    cur.setDate(cur.getDate() + 1);
  }
  for (const a of rows) {
    const d = new Date(a.starts_at);
    const key = toYmd(d);
    if (!map.has(key)) map.set(key, []);
    map.get(key)!.push(a);
  }
  for (const list of map.values()) {
    list.sort((x, y) => new Date(x.starts_at).getTime() - new Date(y.starts_at).getTime());
  }
  return map;
}

function toYmd(d: Date) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export function CalendarAgenda({
  start,
  end,
  initialAppointments,
}: {
  start: Date;
  end: Date;
  initialAppointments: AppointmentRow[];
}) {
  const grouped = groupByDay(initialAppointments, start, end);
  const keys = Array.from(grouped.keys()).sort();

  return (
    <div className="space-y-4">
      <h2 className="font-heading text-lg">Agenda — today &amp; this week</h2>
      <div className="grid gap-4 lg:grid-cols-2">
        {keys.map((key) => {
          const dayDate = new Date(key + "T12:00:00");
          const items = grouped.get(key) ?? [];
          return (
            <Card key={key} size="sm">
              <CardHeader className="pb-2">
                <CardTitle className="font-heading text-base">{dayLabel(dayDate)}</CardTitle>
                <CardDescription>{items.length} scheduled</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                {items.length === 0 ? (
                  <p className="text-muted-foreground">No appointments</p>
                ) : (
                  <ul className="space-y-2">
                    {items.map((a) => {
                      const name = a.client
                        ? `${a.client.first_name} ${a.client.last_name}`
                        : "Client";
                      const t = new Date(a.starts_at).toLocaleTimeString(undefined, {
                        hour: "numeric",
                        minute: "2-digit",
                      });
                      return (
                        <li key={a.id} className="rounded-lg border border-border bg-card px-3 py-2">
                          <p className="font-medium">{a.title ?? "Appointment"}</p>
                          <p className="text-muted-foreground">{name}</p>
                          <p className="text-xs text-muted-foreground">{t}</p>
                          {a.notes ? <p className="mt-1 text-xs">{a.notes}</p> : null}
                        </li>
                      );
                    })}
                  </ul>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
