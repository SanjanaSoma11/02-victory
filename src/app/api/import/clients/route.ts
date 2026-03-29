import { NextResponse } from "next/server";
import Papa from "papaparse";
import { createClient } from "@/lib/supabase/server";
import { getAdminContext } from "@/lib/auth/admin";
import { logAudit } from "@/lib/audit/log";

type Row = Record<string, string>;

function cell(row: Row, ...keys: string[]): string {
  const lower = Object.fromEntries(Object.entries(row).map(([k, v]) => [k.trim().toLowerCase(), v]));
  for (const k of keys) {
    const v = lower[k.toLowerCase()];
    if (v != null && String(v).trim() !== "") return String(v).trim();
  }
  return "";
}

export async function POST(req: Request) {
  const { isAdmin, userId } = await getAdminContext();
  if (!isAdmin) {
    return NextResponse.json({ error: "Only administrators can import clients." }, { status: 403 });
  }

  const supabase = await createClient();
  const ct = req.headers.get("content-type") ?? "";
  let text: string;
  if (ct.includes("multipart/form-data")) {
    const formData = await req.formData();
    const file = formData.get("file");
    if (!(file instanceof Blob)) {
      return NextResponse.json({ error: "Expected file field" }, { status: 400 });
    }
    text = await file.text();
  } else {
    text = await req.text();
  }

  if (!supabase) {
    return NextResponse.json({
      created: 0,
      skipped: 0,
      message: "Supabase is not configured; CSV import runs only when the database is connected.",
    });
  }

  const parsed = Papa.parse<Row>(text, {
    header: true,
    skipEmptyLines: true,
    transformHeader: (h) => h.trim(),
  });

  if (parsed.errors.length > 0) {
    return NextResponse.json(
      { error: parsed.errors[0]?.message ?? "Invalid CSV" },
      { status: 400 }
    );
  }

  const rows = parsed.data.filter((r) => Object.values(r).some((v) => String(v).trim() !== ""));
  let created = 0;
  let skipped = 0;

  for (const row of rows) {
    const first_name = cell(row, "first_name", "firstname", "first");
    const last_name = cell(row, "last_name", "lastname", "last");
    if (!first_name || !last_name) {
      skipped += 1;
      continue;
    }

    const date_of_birth = cell(row, "date_of_birth", "dob", "birthdate") || null;
    const phone = cell(row, "phone", "phone_number", "mobile") || null;
    const email = cell(row, "email", "e-mail") || null;
    const address = cell(row, "address", "street") || null;

    let demographics: Record<string, unknown> = {};
    const demoRaw = cell(row, "demographics", "demographics_json");
    if (demoRaw) {
      try {
        demographics = JSON.parse(demoRaw) as Record<string, unknown>;
      } catch {
        demographics = {};
      }
    }

    const { data, error } = await supabase
      .from("clients")
      .insert({
        first_name,
        last_name,
        date_of_birth,
        phone,
        email,
        address,
        demographics,
        created_by: userId,
      })
      .select("id")
      .single();

    if (error) {
      skipped += 1;
      continue;
    }

    created += 1;
    await logAudit(supabase, {
      userId,
      action: "create",
      tableName: "clients",
      recordId: data.id,
      payload: { first_name, last_name, source: "csv_import" },
    });
  }

  return NextResponse.json({ created, skipped, total: rows.length });
}
