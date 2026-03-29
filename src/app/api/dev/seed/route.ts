import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";
import { demoClients, demoServiceEntries } from "@/lib/data/demo";
import type { ServiceEntry } from "@/types";

/**
 * Development seed: 10+ clients and 30+ service entries for local demos.
 * POST only in development. Requires SUPABASE_SERVICE_ROLE_KEY.
 */
export async function POST() {
  if (process.env.NODE_ENV !== "development") {
    return NextResponse.json({ error: "Only available in development" }, { status: 403 });
  }

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceKey) {
    return NextResponse.json({ error: "Supabase not configured" }, { status: 500 });
  }

  const supabase = createClient(url, serviceKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });

  let userId: string | undefined;

  const { data: userData, error: userError } = await supabase.auth.admin.createUser({
    email: "test@victory.app",
    password: "Test1234!",
    user_metadata: { full_name: "Test Staff" },
    email_confirm: true,
  });

  if (userError) {
    const { data: list } = await supabase.auth.admin.listUsers();
    const existing = list?.users?.find((u) => u.email === "test@victory.app");
    userId = existing?.id;
    if (!userId) {
      return NextResponse.json({ error: userError.message }, { status: 500 });
    }
    await supabase.auth.admin.updateUserById(userId, {
      password: "Test1234!",
      email_confirm: true,
    });
  } else {
    userId = userData?.user?.id;
  }

  if (userId) {
    await supabase.from("profiles").upsert(
      { id: userId, full_name: "Test Staff", email: "test@victory.app", role: "staff" },
      { onConflict: "id" }
    );
  }

  await supabase.from("service_types").upsert(
    [
      { name: "Housing navigation" },
      { name: "Benefits enrollment" },
      { name: "Mental health referral" },
      { name: "Food assistance" },
      { name: "Employment coaching" },
    ],
    { onConflict: "name", ignoreDuplicates: true }
  );

  const { data: types } = await supabase.from("service_types").select("id, name");
  const typeMap = Object.fromEntries((types ?? []).map((t) => [t.name, t.id]));

  const clientRows = demoClients.map((c) => ({
    id: c.id,
    first_name: c.first_name,
    last_name: c.last_name,
    date_of_birth: c.date_of_birth,
    phone: c.phone,
    email: c.email,
    address: c.address,
    demographics: c.demographics ?? {},
    created_by: userId ?? null,
  }));

  const { error: clientErr } = await supabase.from("clients").upsert(clientRows, {
    onConflict: "id",
  });

  if (clientErr) {
    return NextResponse.json({ error: clientErr.message }, { status: 500 });
  }

  const clientIds = demoClients.map((c) => c.id);
  await supabase.from("service_entries").delete().in("client_id", clientIds);

  function entryToRow(e: ServiceEntry) {
    const typeName = e.service_types?.name;
    return {
      id: e.id,
      client_id: e.client_id,
      service_type_id: typeName ? typeMap[typeName] ?? null : null,
      staff_id: userId ?? null,
      service_date: e.service_date,
      duration_minutes: e.duration_minutes,
      notes: e.notes,
      ai_summary: e.ai_summary,
      ai_action_items: e.ai_action_items ?? [],
      ai_mood_risk: e.ai_mood_risk,
      source: e.source ?? "manual",
      audio_transcript: e.audio_transcript,
    };
  }

  const rows = demoServiceEntries.map(entryToRow);

  const typeNames = [
    "Housing navigation",
    "Benefits enrollment",
    "Mental health referral",
    "Food assistance",
    "Employment coaching",
  ];
  const notesTemplate = [
    "Quarterly check-in; goals reviewed.",
    "Resource referral and follow-up scheduled.",
    "Transportation assistance coordinated.",
    "Benefits paperwork assistance.",
    "Group workshop attendance.",
    "Phone intake follow-up.",
    "Home visit — safety plan reviewed.",
    "Partner agency warm handoff.",
  ];

  for (let i = 0; i < 18; i++) {
    const c = demoClients[i % demoClients.length];
    const t = typeNames[i % typeNames.length];
    const suffix = String(16 + i).padStart(12, "0");
    const id = `e1000000-0000-4000-8000-${suffix}`;
    const daysAgo = 20 + (i % 60);
    rows.push({
      id,
      client_id: c.id,
      service_type_id: typeMap[t] ?? null,
      staff_id: userId ?? null,
      service_date: new Date(Date.now() - 86400000 * daysAgo).toISOString(),
      duration_minutes: 30 + (i % 5) * 5,
      notes: notesTemplate[i % notesTemplate.length],
      ai_summary: null,
      ai_action_items: [],
      ai_mood_risk: null,
      source: "manual",
      audio_transcript: null,
    });
  }

  const { error: insErr } = await supabase.from("service_entries").insert(rows);
  if (insErr) {
    return NextResponse.json({ error: insErr.message }, { status: 500 });
  }

  return NextResponse.json({
    message: "Seed complete (10 clients, 33+ service entries)",
    counts: { clients: demoClients.length, service_entries: rows.length },
    credentials: { email: "test@victory.app", password: "Test1234!" },
  });
}
