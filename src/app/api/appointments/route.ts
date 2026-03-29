import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getAppointmentsInRange } from "@/lib/data/queries";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const startParam = searchParams.get("start");
  const endParam = searchParams.get("end");

  const start = startParam ? new Date(startParam) : new Date();
  const end = endParam
    ? new Date(endParam)
    : new Date(start.getTime() + 7 * 86400000);

  const rows = await getAppointmentsInRange(start, end);
  return NextResponse.json({ appointments: rows });
}

export async function POST(req: Request) {
  const supabase = await createClient();
  const body = await req.json();
  const { client_id, title, starts_at, ends_at, notes } = body;

  if (!client_id || !starts_at) {
    return NextResponse.json({ error: "client_id and starts_at are required" }, { status: 400 });
  }

  if (!supabase) {
    return NextResponse.json({ id: crypto.randomUUID() });
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data, error } = await supabase
    .from("appointments")
    .insert({
      client_id,
      staff_id: user?.id ?? null,
      title: title || null,
      starts_at,
      ends_at: ends_at || null,
      notes: notes || null,
    })
    .select("id")
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ id: data.id });
}
