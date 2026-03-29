import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { logAudit } from "@/lib/audit/log";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const typeName = body.service_type_name ?? body.service_type ?? null;
    const {
      client_id,
      service_date,
      duration_minutes,
      notes,
      ai_summary,
      ai_action_items,
      ai_mood_risk,
      source,
      audio_transcript,
      custom_fields,
    } = body;

    if (!client_id || !service_date) {
      return NextResponse.json(
        { error: "client_id and service_date required" },
        { status: 400 }
      );
    }

    const supabase = await createClient();

    if (!supabase) {
      return NextResponse.json({ id: crypto.randomUUID() });
    }

    const {
      data: { user },
    } = await supabase.auth.getUser();

    let service_type_id: string | null = null;
    if (typeName) {
      const { data: st } = await supabase
        .from("service_types")
        .select("id")
        .eq("name", typeName)
        .maybeSingle();
      service_type_id = st?.id ?? null;
    }

    const cf =
      custom_fields && typeof custom_fields === "object" && !Array.isArray(custom_fields)
        ? (custom_fields as Record<string, unknown>)
        : {};

    const { data, error } = await supabase
      .from("service_entries")
      .insert({
        client_id,
        service_type_id,
        staff_id: user?.id ?? null,
        service_date,
        duration_minutes: duration_minutes ?? null,
        notes: notes || null,
        ai_summary: ai_summary || null,
        ai_action_items: ai_action_items ?? [],
        ai_mood_risk: ai_mood_risk || null,
        source: source ?? "manual",
        audio_transcript: audio_transcript || null,
        ...(Object.keys(cf).length > 0 ? { custom_fields: cf } : {}),
      })
      .select("id")
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    await logAudit(supabase, {
      userId: user?.id ?? null,
      action: "create",
      tableName: "service_entries",
      recordId: data.id,
      payload: { client_id, service_date, duration_minutes },
    });

    return NextResponse.json({ id: data.id });
  } catch {
    return NextResponse.json({ error: "Failed to save service entry" }, { status: 500 });
  }
}
