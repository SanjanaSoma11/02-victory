"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";

export function FieldsAdminForm() {
  const [pending, setPending] = useState(false);
  const [key, setKey] = useState("");
  const [label, setLabel] = useState("");
  const [fieldType, setFieldType] = useState<"text" | "number" | "select">("text");
  const [appliesTo, setAppliesTo] = useState<"client" | "service">("client");
  const [optionsText, setOptionsText] = useState("");

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setPending(true);
    const options =
      fieldType === "select"
        ? optionsText
            .split(/[,\n]/)
            .map((s) => s.trim())
            .filter(Boolean)
        : null;

    const res = await fetch("/api/custom-fields", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        key,
        label,
        field_type: fieldType,
        applies_to: appliesTo,
        options,
      }),
    });
    setPending(false);

    if (res.ok) {
      toast.success("Field definition saved.");
      setKey("");
      setLabel("");
      setOptionsText("");
    } else {
      const data = await res.json().catch(() => ({}));
      toast.error((data as { error?: string }).error ?? "Could not save field.");
    }
  }

  return (
    <form onSubmit={onSubmit} className="grid max-w-xl gap-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="fkey">Field key</Label>
          <Input
            id="fkey"
            value={key}
            onChange={(e) => setKey(e.target.value)}
            placeholder="household_size"
            required
          />
          <p className="text-xs text-muted-foreground">Lowercase letters, numbers, underscores.</p>
        </div>
        <div className="space-y-2">
          <Label htmlFor="flabel">Label</Label>
          <Input
            id="flabel"
            value={label}
            onChange={(e) => setLabel(e.target.value)}
            placeholder="Household size"
            required
          />
        </div>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label>Type</Label>
          <Select
            value={fieldType}
            onValueChange={(v) => setFieldType((v as typeof fieldType) ?? "text")}
          >
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="text">Text</SelectItem>
              <SelectItem value="number">Number</SelectItem>
              <SelectItem value="select">Select</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label>Applies to</Label>
          <Select
            value={appliesTo}
            onValueChange={(v) => setAppliesTo(v === "service" ? "service" : "client")}
          >
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="client">Client profile / registration</SelectItem>
              <SelectItem value="service">Service log entry</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      {fieldType === "select" ? (
        <div className="space-y-2">
          <Label htmlFor="fopts">Options</Label>
          <Textarea
            id="fopts"
            value={optionsText}
            onChange={(e) => setOptionsText(e.target.value)}
            placeholder="One per line or comma-separated"
            rows={3}
          />
        </div>
      ) : null}
      <Button type="submit" disabled={pending}>
        {pending ? "Saving…" : "Add field"}
      </Button>
    </form>
  );
}
