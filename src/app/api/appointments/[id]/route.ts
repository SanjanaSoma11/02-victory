import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function PATCH(req: Request, ctx: { params: Promise<{ id: string }> }) {
  const { id } = await ctx.params;
  const supabase = await createClient();
  const body = await req.json();

  if (!supabase) {
    return NextResponse.json({ ok: true });
  }

  const patch: Record<string, unknown> = {};
  if (body.title !== undefined) patch.title = body.title;
  if (body.starts_at !== undefined) patch.starts_at = body.starts_at;
  if (body.ends_at !== undefined) patch.ends_at = body.ends_at;
  if (body.notes !== undefined) patch.notes = body.notes;

  const { error } = await supabase.from("appointments").update(patch).eq("id", id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}

export async function DELETE(_req: Request, ctx: { params: Promise<{ id: string }> }) {
  const { id } = await ctx.params;
  const supabase = await createClient();

  if (!supabase) {
    return NextResponse.json({ ok: true });
  }

  const { error } = await supabase.from("appointments").delete().eq("id", id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
