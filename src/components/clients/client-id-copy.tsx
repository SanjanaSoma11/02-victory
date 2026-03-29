"use client";

import { useState } from "react";
import { Check, Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export function ClientIdCopy({ id }: { id: string }) {
  const [done, setDone] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(id);
      setDone(true);
      toast.success("Client ID copied");
      setTimeout(() => setDone(false), 2000);
    } catch {
      toast.error("Could not copy");
    }
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      <code className="rounded-md bg-muted px-2 py-1 font-mono text-xs break-all">{id}</code>
      <Button type="button" variant="outline" size="sm" className="gap-1.5 shrink-0" onClick={copy}>
        {done ? <Check className="size-3.5" /> : <Copy className="size-3.5" />}
        {done ? "Copied" : "Copy ID"}
      </Button>
    </div>
  );
}
