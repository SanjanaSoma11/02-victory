"use client";

import { useCallback, useEffect, useState } from "react";
import { Plus, Pencil, Trash2, ChevronUp, ChevronDown, Check, X, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { toast } from "sonner";

type FieldType = "text" | "number" | "select";
type AppliesTo = "service" | "client";

interface FieldDef {
  id: string;
  key: string;
  label: string;
  field_type: FieldType;
  applies_to: AppliesTo;
  options: string[] | null;
  order_index: number;
}

const FIELD_TYPE_LABELS: Record<FieldType, string> = {
  text: "Text",
  number: "Number",
  select: "Select",
};

// ─── Create Form ─────────────────────────────────────────────────────────────

function CreateFieldForm({
  appliesTo,
  onCreated,
}: {
  appliesTo: AppliesTo;
  onCreated: () => void;
}) {
  const [open, setOpen] = useState(false);
  const [pending, setPending] = useState(false);
  const [key, setKey] = useState("");
  const [label, setLabel] = useState("");
  const [fieldType, setFieldType] = useState<FieldType>("text");
  const [optionsText, setOptionsText] = useState("");

  async function handleSubmit(e: React.FormEvent) {
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
      body: JSON.stringify({ key, label, field_type: fieldType, applies_to: appliesTo, options }),
    });
    setPending(false);

    if (res.ok) {
      toast.success("Field created.");
      setKey("");
      setLabel("");
      setOptionsText("");
      setFieldType("text");
      setOpen(false);
      onCreated();
    } else {
      const data = await res.json().catch(() => ({}));
      toast.error((data as { error?: string }).error ?? "Could not create field.");
    }
  }

  if (!open) {
    return (
      <Button type="button" onClick={() => setOpen(true)} className="gap-2">
        <Plus className="size-4" />
        New field
      </Button>
    );
  }

  return (
    <Card className="border-primary/20 bg-primary/5">
      <CardHeader className="pb-3">
        <CardTitle className="text-base">New field</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="grid gap-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="new-fkey">Field key</Label>
              <Input
                id="new-fkey"
                value={key}
                onChange={(e) => setKey(e.target.value)}
                placeholder="e.g. household_size"
                required
              />
              <p className="text-xs text-muted-foreground">Lowercase, underscores only.</p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="new-flabel">Display label</Label>
              <Input
                id="new-flabel"
                value={label}
                onChange={(e) => setLabel(e.target.value)}
                placeholder="e.g. Household size"
                required
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label>Field type</Label>
            <Select
              value={fieldType}
              onValueChange={(v) => setFieldType((v as FieldType) ?? "text")}
            >
              <SelectTrigger className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="text">Text</SelectItem>
                <SelectItem value="number">Number</SelectItem>
                <SelectItem value="select">Select (dropdown)</SelectItem>
              </SelectContent>
            </Select>
          </div>
          {fieldType === "select" && (
            <div className="space-y-2">
              <Label htmlFor="new-fopts">Options</Label>
              <Textarea
                id="new-fopts"
                value={optionsText}
                onChange={(e) => setOptionsText(e.target.value)}
                placeholder="One per line or comma-separated"
                rows={3}
              />
            </div>
          )}
          <div className="flex gap-2">
            <Button type="submit" disabled={pending} className="gap-2">
              {pending ? <Loader2 className="size-4 animate-spin" /> : <Plus className="size-4" />}
              {pending ? "Saving…" : "Add field"}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setOpen(false);
                setKey("");
                setLabel("");
                setOptionsText("");
                setFieldType("text");
              }}
            >
              Cancel
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

// ─── Field Row ────────────────────────────────────────────────────────────────

function FieldRow({
  field,
  isFirst,
  isLast,
  onChanged,
}: {
  field: FieldDef;
  isFirst: boolean;
  isLast: boolean;
  onChanged: () => void;
}) {
  const [editing, setEditing] = useState(false);
  const [editLabel, setEditLabel] = useState(field.label);
  const [editOptions, setEditOptions] = useState(field.options?.join("\n") ?? "");
  const [saving, setSaving] = useState(false);

  async function saveEdit() {
    setSaving(true);
    const body: Record<string, unknown> = { id: field.id, label: editLabel };
    if (field.field_type === "select") {
      body.options = editOptions
        .split(/[,\n]/)
        .map((s) => s.trim())
        .filter(Boolean);
    }
    const res = await fetch("/api/custom-fields", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    setSaving(false);
    if (res.ok) {
      toast.success("Field updated.");
      setEditing(false);
      onChanged();
    } else {
      const data = await res.json().catch(() => ({}));
      toast.error((data as { error?: string }).error ?? "Could not update field.");
    }
  }

  async function handleDelete() {
    const res = await fetch(`/api/custom-fields?id=${field.id}`, { method: "DELETE" });
    if (res.ok) {
      toast.success("Field deleted.");
      onChanged();
    } else {
      const data = await res.json().catch(() => ({}));
      toast.error((data as { error?: string }).error ?? "Could not delete field.");
    }
  }

  async function moveOrder(direction: "up" | "down") {
    const newIndex = direction === "up" ? field.order_index - 1 : field.order_index + 1;
    const res = await fetch("/api/custom-fields", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: field.id, order_index: newIndex }),
    });
    if (res.ok) {
      onChanged();
    } else {
      toast.error("Could not reorder field.");
    }
  }

  return (
    <div className="rounded-xl border border-border bg-card p-4 transition-shadow hover:shadow-sm">
      {editing ? (
        <div className="grid gap-3">
          <div className="space-y-1.5">
            <Label htmlFor={`edit-label-${field.id}`}>Label</Label>
            <Input
              id={`edit-label-${field.id}`}
              value={editLabel}
              onChange={(e) => setEditLabel(e.target.value)}
            />
          </div>
          {field.field_type === "select" && (
            <div className="space-y-1.5">
              <Label htmlFor={`edit-opts-${field.id}`}>Options</Label>
              <Textarea
                id={`edit-opts-${field.id}`}
                value={editOptions}
                onChange={(e) => setEditOptions(e.target.value)}
                placeholder="One per line or comma-separated"
                rows={3}
              />
            </div>
          )}
          <div className="flex gap-2">
            <Button size="sm" onClick={saveEdit} disabled={saving} className="gap-1.5">
              {saving ? <Loader2 className="size-3.5 animate-spin" /> : <Check className="size-3.5" />}
              Save
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => {
                setEditing(false);
                setEditLabel(field.label);
                setEditOptions(field.options?.join("\n") ?? "");
              }}
              className="gap-1.5"
            >
              <X className="size-3.5" />
              Cancel
            </Button>
          </div>
        </div>
      ) : (
        <div className="flex items-start gap-3">
          {/* Re-order buttons */}
          <div className="flex flex-col gap-0.5 pt-0.5">
            <button
              type="button"
              onClick={() => void moveOrder("up")}
              disabled={isFirst}
              aria-label="Move field up"
              className="rounded p-0.5 text-muted-foreground hover:text-foreground disabled:opacity-25"
            >
              <ChevronUp className="size-3.5" />
            </button>
            <button
              type="button"
              onClick={() => void moveOrder("down")}
              disabled={isLast}
              aria-label="Move field down"
              className="rounded p-0.5 text-muted-foreground hover:text-foreground disabled:opacity-25"
            >
              <ChevronDown className="size-3.5" />
            </button>
          </div>

          {/* Field info */}
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-medium">{field.label}</span>
              <Badge variant="secondary" className="text-xs">
                {FIELD_TYPE_LABELS[field.field_type]}
              </Badge>
              <code className="rounded bg-muted px-1.5 py-0.5 text-xs text-muted-foreground">
                {field.key}
              </code>
            </div>
            {field.options && field.options.length > 0 && (
              <p className="mt-1 text-xs text-muted-foreground">
                Options: {field.options.join(", ")}
              </p>
            )}
          </div>

          {/* Actions */}
          <div className="flex shrink-0 gap-1">
            <Button
              size="sm"
              variant="ghost"
              onClick={() => setEditing(true)}
              aria-label={`Edit ${field.label}`}
              className="h-8 w-8 p-0"
            >
              <Pencil className="size-3.5" />
            </Button>

            <AlertDialog>
              <AlertDialogTrigger
                aria-label={`Delete ${field.label}`}
                className="inline-flex h-8 w-8 items-center justify-center rounded-md p-0 text-destructive transition-colors hover:bg-accent hover:text-destructive"
              >
                <Trash2 className="size-3.5" />
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Delete field "{field.label}"?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This removes the field definition. Existing service entries that already have a
                    value for <code>{field.key}</code> are unaffected — the data stays in the
                    database, just won't show in new forms.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={() => void handleDelete()}
                    variant="destructive"
                  >
                    Delete
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export function FieldsManager() {
  const [tab, setTab] = useState<AppliesTo>("service");
  const [fields, setFields] = useState<FieldDef[]>([]);
  const [loading, setLoading] = useState(true);

  const loadFields = useCallback(async () => {
    setLoading(true);
    const res = await fetch(`/api/custom-fields?applies_to=${tab}`);
    const data = await res.json();
    setFields((data.fields as FieldDef[]) ?? []);
    setLoading(false);
  }, [tab]);

  useEffect(() => {
    void loadFields();
  }, [loadFields]);

  return (
    <div className="space-y-6">
      {/* Tab switcher */}
      <div className="inline-flex rounded-lg border border-border bg-muted/30 p-1 gap-1">
        {(["service", "client"] as const).map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => setTab(t)}
            className={`rounded-md px-4 py-1.5 text-sm font-medium transition-colors ${
              tab === t
                ? "bg-background text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {t === "service" ? "Service log fields" : "Client profile fields"}
          </button>
        ))}
      </div>

      {/* Create form */}
      <CreateFieldForm appliesTo={tab} onCreated={() => void loadFields()} />

      {/* Field list */}
      {loading ? (
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Loader2 className="size-4 animate-spin" />
          Loading fields…
        </div>
      ) : fields.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center gap-2 py-12 text-center">
            <p className="text-sm font-medium text-muted-foreground">No fields yet</p>
            <p className="text-xs text-muted-foreground">
              Click "New field" above to add your first custom field for{" "}
              {tab === "service" ? "service log entries" : "client profiles"}.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-2">
          {fields.map((f, i) => (
            <FieldRow
              key={f.id}
              field={f}
              isFirst={i === 0}
              isLast={i === fields.length - 1}
              onChanged={() => void loadFields()}
            />
          ))}
        </div>
      )}
    </div>
  );
}
