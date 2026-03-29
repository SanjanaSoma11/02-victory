import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getAdminContext } from "@/lib/auth/admin";

export async function GET(req: Request) {
  const supabase = await createClient();
  const { searchParams } = new URL(req.url);
  const appliesTo = searchParams.get("applies_to") === "service" ? "service" : "client";

  if (!supabase) {
    return NextResponse.json({ fields: [] });
  }

  const { data, error } = await supabase
    .from("custom_field_definitions")
    .select("*")
    .eq("applies_to", appliesTo)
    .order("order_index", { ascending: true });

  if (error) {
    return NextResponse.json({ fields: [] });
  }

  return NextResponse.json({ fields: data ?? [] });
}

export async function POST(req: Request) {
  const { isAdmin } = await getAdminContext();
  if (!isAdmin) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const supabase = await createClient();
  if (!supabase) {
    return NextResponse.json({ error: "Database not configured" }, { status: 503 });
  }

  const body = await req.json();
  const key = String(body.key ?? "")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9_]/g, "_");
  const label = String(body.label ?? "").trim();
  const field_type =
    body.field_type === "number"
      ? "number"
      : body.field_type === "select"
        ? "select"
        : "text";
  const applies_to = body.applies_to === "service" ? "service" : "client";
  const options = Array.isArray(body.options) ? body.options.map(String) : null;

  if (!key || !label) {
    return NextResponse.json({ error: "key and label are required" }, { status: 400 });
  }

  const { count } = await supabase
    .from("custom_field_definitions")
    .select("id", { count: "exact", head: true });

  const order_index =
    typeof body.order_index === "number" ? body.order_index : (count ?? 0);

  const { data, error } = await supabase
    .from("custom_field_definitions")
    .insert({ key, label, field_type, applies_to, options, order_index })
    .select("id")
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ id: data.id });
}

export async function PATCH(req: Request) {
  const { isAdmin } = await getAdminContext();
  if (!isAdmin) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const supabase = await createClient();
  if (!supabase) {
    return NextResponse.json({ error: "Database not configured" }, { status: 503 });
  }

  const body = await req.json();
  const id = String(body.id ?? "").trim();
  if (!id) {
    return NextResponse.json({ error: "id is required" }, { status: 400 });
  }

  // Build only the columns the caller wants to update
  const updates: Record<string, unknown> = {};
  if (typeof body.label === "string") updates.label = body.label.trim();
  if (Array.isArray(body.options)) updates.options = body.options.map(String);
  if (body.options === null) updates.options = null;
  if (typeof body.order_index === "number") updates.order_index = body.order_index;

  if (Object.keys(updates).length === 0) {
    return NextResponse.json({ error: "Nothing to update" }, { status: 400 });
  }

  const { error } = await supabase
    .from("custom_field_definitions")
    .update(updates)
    .eq("id", id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}

export async function DELETE(req: Request) {
  const { isAdmin } = await getAdminContext();
  if (!isAdmin) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const supabase = await createClient();
  if (!supabase) {
    return NextResponse.json({ error: "Database not configured" }, { status: 503 });
  }

  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  if (!id) {
    return NextResponse.json({ error: "id query param required" }, { status: 400 });
  }

  const { error } = await supabase
    .from("custom_field_definitions")
    .delete()
    .eq("id", id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
