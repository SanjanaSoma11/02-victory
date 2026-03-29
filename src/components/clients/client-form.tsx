"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type FieldDef = {
  id: string;
  key: string;
  label: string;
  field_type: "text" | "number" | "select";
  options: string[] | null;
};

export function ClientForm() {
  const router = useRouter();
  const [pending, setPending] = useState(false);
  const [customDefs, setCustomDefs] = useState<FieldDef[]>([]);
  const [customValues, setCustomValues] = useState<Record<string, string>>({});

  useEffect(() => {
    fetch("/api/custom-fields?applies_to=client")
      .then((r) => r.json())
      .then((d: { fields?: FieldDef[] }) => setCustomDefs(d.fields ?? []))
      .catch(() => setCustomDefs([]));
  }, []);

  async function onSubmit(e: React.SyntheticEvent<HTMLFormElement>) {
    e.preventDefault();
    setPending(true);

    const form = new FormData(e.currentTarget);

    const demographics: Record<string, unknown> = {};

    const gender = form.get("demographic_gender");
    if (gender && String(gender).trim()) demographics.gender = String(gender).trim();

    const lang = form.get("demographic_primary_language");
    if (lang && String(lang).trim()) demographics.primary_language = String(lang).trim();

    const hh = form.get("demographic_household_size");
    if (hh && String(hh).trim()) {
      const n = Number(hh);
      if (!Number.isNaN(n)) demographics.household_size = n;
    }

    const ref = form.get("demographic_referral_source");
    if (ref && String(ref).trim()) demographics.referral_source = String(ref).trim();

    const vet = form.get("demographic_veteran_status");
    if (vet && String(vet).trim()) demographics.veteran_status = String(vet).trim();

    for (const def of customDefs) {
      const raw = customValues[def.key] ?? "";
      if (raw === "") continue;
      if (def.field_type === "number") {
        const n = Number(raw);
        if (!Number.isNaN(n)) demographics[def.key] = n;
      } else {
        demographics[def.key] = raw;
      }
    }

    const res = await fetch("/api/clients", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        first_name: form.get("first_name"),
        last_name: form.get("last_name"),
        date_of_birth: form.get("dob") || null,
        phone: form.get("phone") || null,
        email: form.get("email") || null,
        address: form.get("address") || null,
        demographics,
      }),
    });

    setPending(false);

    if (res.ok) {
      const data = (await res.json()) as { id: string };
      toast.success("Client saved.");
      router.push(`/clients/${data.id}`);
    } else {
      const data = await res.json().catch(() => ({}));
      toast.error((data as { error?: string }).error ?? "Failed to save client.");
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-heading text-xl">New client</CardTitle>
        <CardDescription>
          Required name and contact fields plus five common demographic prompts. Admin-defined fields appear below when
          configured.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={onSubmit} className="grid max-w-2xl gap-6">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="first_name">First name</Label>
              <Input id="first_name" name="first_name" required placeholder="Maria" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="last_name">Last name</Label>
              <Input id="last_name" name="last_name" required placeholder="Santos" />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="dob">Date of birth</Label>
            <Input id="dob" name="dob" type="date" />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="phone">Phone</Label>
              <Input id="phone" name="phone" type="tel" placeholder="(555) 000-0000" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" name="email" type="email" placeholder="client@email.org" />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="address">Address</Label>
            <Textarea
              id="address"
              name="address"
              rows={2}
              placeholder="Street, city, unit notes…"
              className="min-h-[72px] resize-y"
            />
          </div>

          <div className="space-y-4 rounded-xl border border-border bg-muted/15 p-4">
            <p className="text-sm font-medium">Demographics</p>
            <p className="text-xs text-muted-foreground">
              Captured as structured JSON for grants and reporting. All optional.
            </p>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="demographic_gender">Gender</Label>
                <select
                  id="demographic_gender"
                  name="demographic_gender"
                  className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                  defaultValue=""
                >
                  <option value="">Prefer not to say</option>
                  <option value="Female">Female</option>
                  <option value="Male">Male</option>
                  <option value="Non-binary">Non-binary</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="demographic_primary_language">Primary language</Label>
                <Input
                  id="demographic_primary_language"
                  name="demographic_primary_language"
                  placeholder="English, Spanish, …"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="demographic_household_size">Household size</Label>
                <Input
                  id="demographic_household_size"
                  name="demographic_household_size"
                  type="number"
                  min={1}
                  step={1}
                  placeholder="e.g. 3"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="demographic_referral_source">Referral source</Label>
                <Input
                  id="demographic_referral_source"
                  name="demographic_referral_source"
                  placeholder="School, hospital, self-referral…"
                />
              </div>
              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="demographic_veteran_status">Veteran status</Label>
                <select
                  id="demographic_veteran_status"
                  name="demographic_veteran_status"
                  className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                  defaultValue=""
                >
                  <option value="">Prefer not to say</option>
                  <option value="Yes">Yes</option>
                  <option value="No">No</option>
                </select>
              </div>
            </div>
          </div>

          {customDefs.length > 0 ? (
            <div className="space-y-4 rounded-xl border border-border bg-muted/20 p-4">
              <p className="text-sm font-medium">Additional fields</p>
              <div className="grid gap-4 sm:grid-cols-2">
                {customDefs.map((def) => (
                  <div key={def.id} className="space-y-2 sm:col-span-2">
                    <Label htmlFor={`cf-${def.key}`}>{def.label}</Label>
                    {def.field_type === "select" && def.options && def.options.length > 0 ? (
                      <Select
                        value={customValues[def.key] ?? ""}
                        onValueChange={(v) =>
                          setCustomValues((prev) => ({ ...prev, [def.key]: v ?? "" }))
                        }
                      >
                        <SelectTrigger id={`cf-${def.key}`} className="w-full">
                          <SelectValue placeholder="Select" />
                        </SelectTrigger>
                        <SelectContent>
                          {def.options.map((opt) => (
                            <SelectItem key={opt} value={opt}>
                              {opt}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    ) : (
                      <Input
                        id={`cf-${def.key}`}
                        type={def.field_type === "number" ? "number" : "text"}
                        value={customValues[def.key] ?? ""}
                        onChange={(e) =>
                          setCustomValues((prev) => ({ ...prev, [def.key]: e.target.value }))
                        }
                      />
                    )}
                  </div>
                ))}
              </div>
            </div>
          ) : null}

          <div className="flex gap-3">
            <Button type="submit" disabled={pending}>
              {pending ? "Saving…" : "Save client"}
            </Button>
            <Button type="button" variant="outline" onClick={() => router.back()}>
              Cancel
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
