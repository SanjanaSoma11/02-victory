import { AppHeader } from "@/components/layout/app-header";
import { createClient } from "@/lib/supabase/server";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default async function AdminAuditPage() {
  const supabase = await createClient();
  let rows: {
    id: string;
    user_id: string | null;
    action: string;
    table_name: string;
    record_id: string | null;
    changes: unknown;
    created_at: string;
  }[] = [];

  if (supabase) {
    const { data } = await supabase
      .from("audit_log")
      .select("id, user_id, action, table_name, record_id, changes, created_at")
      .order("created_at", { ascending: false })
      .limit(300);
    rows = (data ?? []) as typeof rows;
  }

  return (
    <>
      <AppHeader
        title="Audit log"
        description="Create events with redacted payloads. Extend capture to updates and deletes as workflows grow."
      />
      <div className="flex-1 space-y-6 px-6 py-8">
        <Card size="sm">
          <CardHeader>
            <CardTitle className="font-heading text-base">Recent events</CardTitle>
            <CardDescription>
              Sensitive identifiers are masked in stored JSON. Direct PHI should not appear in audit entries.
            </CardDescription>
          </CardHeader>
          <CardContent className="overflow-x-auto">
            {rows.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                No audit rows yet, or the database migration has not been applied.
              </p>
            ) : (
              <table className="w-full min-w-[640px] border-collapse text-sm">
                <thead>
                  <tr className="border-b border-border text-left text-muted-foreground">
                    <th className="pb-2 pr-3 font-medium">When</th>
                    <th className="pb-2 pr-3 font-medium">Action</th>
                    <th className="pb-2 pr-3 font-medium">Table</th>
                    <th className="pb-2 pr-3 font-medium">Record</th>
                    <th className="pb-2 font-medium">Changes</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((r) => (
                    <tr key={r.id} className="border-b border-border/60 align-top">
                      <td className="py-2 pr-3 whitespace-nowrap text-muted-foreground">
                        {new Date(r.created_at).toLocaleString()}
                      </td>
                      <td className="py-2 pr-3">{r.action}</td>
                      <td className="py-2 pr-3">{r.table_name}</td>
                      <td className="py-2 pr-3 font-mono text-xs">{r.record_id ?? "—"}</td>
                      <td className="py-2 max-w-md font-mono text-xs break-all">
                        {r.changes != null ? JSON.stringify(r.changes) : "—"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </CardContent>
        </Card>
      </div>
    </>
  );
}
