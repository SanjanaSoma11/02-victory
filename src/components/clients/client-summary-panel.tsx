"use client";

import { useState } from "react";
import { Sparkles, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";

export function ClientSummaryPanel({ clientId }: { clientId: string }) {
  const [pending, setPending] = useState(false);
  const [sections, setSections] = useState<{ title: string; content: string }[] | null>(null);

  async function generate() {
    setPending(true);
    const res = await fetch("/api/ai/client-summary", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ client_id: clientId }),
    });
    setPending(false);

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      toast.error((data as { error?: string }).error ?? "Could not generate summary.");
      return;
    }

    const data = (await res.json()) as { sections: { title: string; content: string }[]; demo?: boolean };
    setSections(data.sections ?? []);
    if (data.demo) {
      toast.message("Demo preview — add GROQ_API_KEY for full generated output.");
    } else {
      toast.success("Client summary generated — review and edit in your records.");
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-heading flex items-center gap-2 text-lg">
          <Sparkles className="size-4 text-primary" aria-hidden />
          Client summary
        </CardTitle>
        <CardDescription>
          Generated handoff brief from demographics and visit history. Staff should review before sharing or filing.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Button type="button" onClick={generate} disabled={pending} className="gap-2">
          {pending ? <Loader2 className="size-4 animate-spin" /> : <Sparkles className="size-4" />}
          {pending ? "Generating…" : "Generate client summary"}
        </Button>

        {sections && sections.length > 0 ? (
          <div className="space-y-4 rounded-xl border border-border bg-muted/20 p-4">
            {sections.map((s) => (
              <div key={s.title}>
                <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">{s.title}</p>
                <p className="mt-1 whitespace-pre-wrap text-sm leading-relaxed text-foreground">{s.content}</p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">
            No summary yet. Generate one to see background, services to date, status, needs, risks, and next steps.
          </p>
        )}
      </CardContent>
    </Card>
  );
}
