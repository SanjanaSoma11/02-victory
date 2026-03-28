"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Copy } from "lucide-react";
import { toast } from "sonner";

interface ReportPreviewProps {
  title: string;
  periodStart: string;
  periodEnd: string;
  sections: { title: string; content: string }[];
}

export function ReportPreview({
  title,
  periodStart,
  periodEnd,
  sections,
}: ReportPreviewProps) {
  const copy = () => {
    const text = sections
      .map((s) => `## ${s.title}\n\n${s.content}`)
      .join("\n\n---\n\n");
    void navigator.clipboard.writeText(
      `# ${title}\n_${periodStart} – ${periodEnd}_\n\n${text}`
    );
    toast.success("Copied.");
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="font-heading text-3xl tracking-tight">{title}</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {periodStart} — {periodEnd}
          </p>
        </div>
        <Button type="button" variant="outline" onClick={copy}>
          <Copy className="mr-2 h-4 w-4" />
          Copy full report
        </Button>
      </div>

      <div className="space-y-4">
        {sections.map((s) => (
          <Card key={s.title}>
            <CardHeader>
              <CardTitle className="font-heading text-xl">{s.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-sm leading-relaxed text-foreground/90">
                {s.content.split("\n\n").map((para, i) => (
                  <p key={i} className="mb-3 last:mb-0">
                    {para}
                  </p>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
