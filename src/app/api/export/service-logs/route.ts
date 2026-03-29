import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getAdminContext } from "@/lib/auth/admin";
import { demoClients, demoServiceEntries } from "@/lib/data/demo";

function csvCell(value: string) {
  if (/[",\n\r]/.test(value)) {
    return `"${value.replace(/"/g, '""')}"`;
  }
  return value;
}

export async function GET() {
  const { isAdmin } = await getAdminContext();
  if (!isAdmin) {
    return NextResponse.json({ error: "Only administrators can export service logs." }, { status: 403 });
  }

  const supabase = await createClient();

  type Row = {
    id: string;
    client_id: string;
    client_name: string;
    service_date: string;
    service_type: string;
    duration_minutes: string;
    notes: string;
  };

  let rows: Row[];

  if (supabase) {
    const { data, error } = await supabase
      .from("service_entries")
      .select(
        "id, client_id, service_date, duration_minutes, notes, service_types(name), clients(first_name, last_name)"
      )
      .order("service_date", { ascending: false });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    rows = (data ?? []).map(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (e: any) => {
        const fn = e.clients?.first_name ?? "";
        const ln = e.clients?.last_name ?? "";
        return {
          id: e.id,
          client_id: e.client_id,
          client_name: `${fn} ${ln}`.trim() || e.client_id,
          service_date: e.service_date?.split("T")[0] ?? "",
          service_type: e.service_types?.name ?? "",
          duration_minutes: e.duration_minutes != null ? String(e.duration_minutes) : "",
          notes: (e.notes ?? "").replace(/\s+/g, " ").trim(),
        };
      }
    );
  } else {
    const nameById = new Map(demoClients.map((c) => [c.id, `${c.first_name} ${c.last_name}`]));
    rows = demoServiceEntries.map((e) => ({
      id: e.id,
      client_id: e.client_id,
      client_name: nameById.get(e.client_id) ?? e.client_id,
      service_date: e.service_date.split("T")[0] ?? "",
      service_type: e.service_types?.name ?? "",
      duration_minutes: e.duration_minutes != null ? String(e.duration_minutes) : "",
      notes: (e.notes ?? "").replace(/\s+/g, " ").trim(),
    }));
  }

  const header =
    "entry_id,client_id,client_name,service_date,service_type,duration_minutes,notes";
  const lines = rows.map((r) =>
    [r.id, r.client_id, r.client_name, r.service_date, r.service_type, r.duration_minutes, r.notes]
      .map((v) => csvCell(String(v)))
      .join(",")
  );
  const csv = [header, ...lines].join("\n");

  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": 'attachment; filename="service-logs-export.csv"',
    },
  });
}
