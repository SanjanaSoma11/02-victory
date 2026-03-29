import type { SupabaseClient } from "@supabase/supabase-js";

const PHI_KEY =
  /phone|email|address|notes|transcript|dob|birth|ssn|demographics|custom_fields|first_name|last_name/i;

function redactRecord(obj: Record<string, unknown> | null | undefined): Record<string, unknown> | null {
  if (!obj) return null;
  const out: Record<string, unknown> = {};
  for (const [k, v] of Object.entries(obj)) {
    if (PHI_KEY.test(k)) out[k] = "[redacted]";
    else if (v && typeof v === "object" && !Array.isArray(v)) {
      out[k] = redactRecord(v as Record<string, unknown>);
    } else {
      out[k] = v;
    }
  }
  return out;
}

export async function logAudit(
  supabase: SupabaseClient | null,
  params: {
    userId: string | null;
    action: "create" | "update" | "delete";
    tableName: string;
    recordId: string | null;
    payload?: Record<string, unknown> | null;
  }
) {
  if (!supabase) return;

  const changes =
    params.payload != null
      ? { snapshot: redactRecord(params.payload) }
      : null;

  const { error } = await supabase.from("audit_log").insert({
    user_id: params.userId,
    action: params.action,
    table_name: params.tableName,
    record_id: params.recordId,
    changes,
  });

  if (error) {
    console.error("audit_log insert failed:", error.message);
  }
}
