import { createClient } from "@/lib/supabase/server";
import {
  demoClients,
  demoServiceEntries,
  getClientById as getDemoClient,
  getServicesForClient as getDemoServices,
  demoServiceTypes,
} from "./demo";
import type { Client, ServiceEntry } from "@/types";

export type ClientWithLastService = Client & {
  last_service_type: string | null;
  last_service_date: string | null;
};

export async function getAllClients(): Promise<ClientWithLastService[]> {
  const supabase = await createClient();
  if (!supabase) {
    return demoClients.map((c) => ({ ...c, last_service_type: null, last_service_date: null }));
  }

  const { data, error } = await supabase
    .from("clients")
    .select("*, service_entries(service_date, service_types(name))")
    .order("last_name");

  if (error || !data) {
    return demoClients.map((c) => ({ ...c, last_service_type: null, last_service_date: null }));
  }

  return data.map((c) => {
    const entries = (c.service_entries ?? []) as {
      service_date: string;
      service_types?: { name: string } | null;
    }[];
    const latest = entries.sort(
      (a, b) => new Date(b.service_date).getTime() - new Date(a.service_date).getTime()
    )[0];
    return {
      ...(c as Client),
      last_service_type: latest?.service_types?.name ?? null,
      last_service_date: latest?.service_date ?? null,
    };
  });
}

export async function getClientById(id: string): Promise<Client | null> {
  const supabase = await createClient();
  if (!supabase) return getDemoClient(id) ?? null;

  const { data, error } = await supabase
    .from("clients")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !data) return getDemoClient(id) ?? null;
  return data as Client;
}

export async function getServicesForClient(clientId: string): Promise<ServiceEntry[]> {
  const supabase = await createClient();
  if (!supabase) return getDemoServices(clientId);

  const { data, error } = await supabase
    .from("service_entries")
    .select("*, service_types(name)")
    .eq("client_id", clientId)
    .order("service_date", { ascending: false });

  if (error || !data) return getDemoServices(clientId);
  return data as ServiceEntry[];
}

export async function getServiceTypes(): Promise<string[]> {
  const supabase = await createClient();
  if (!supabase) return demoServiceTypes;

  const { data, error } = await supabase
    .from("service_types")
    .select("name")
    .eq("is_active", true)
    .order("name");

  if (error || !data) return demoServiceTypes;
  return data.map((r) => r.name);
}

type ChartEntry = {
  service_date: string;
  duration_minutes?: number | null;
  service_types?: { name?: string } | { name?: string }[] | null;
};

function buildWeeklyTrend(entries: ChartEntry[]) {
  const now = Date.now();
  return Array.from({ length: 6 }, (_, i) => {
    const weekStart = now - (5 - i) * 7 * 86400000;
    const weekEnd = weekStart + 7 * 86400000;
    const date = new Date(weekStart);
    const label = `${date.getMonth() + 1}/${date.getDate()}`;
    const visits = entries.filter((e) => {
      const t = new Date(e.service_date).getTime();
      return t >= weekStart && t < weekEnd;
    }).length;
    return { w: label, visits };
  });
}

function buildServicesByType(entries: ChartEntry[]) {
  const counts: Record<string, number> = {};
  entries.forEach((e) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const name: string = (e as any)?.service_types?.name ?? "Other";
    const short = name.length > 10 ? name.slice(0, 10) : name;
    counts[short] = (counts[short] ?? 0) + 1;
  });
  return Object.entries(counts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 6)
    .map(([name, n]) => ({ name, n }));
}

export async function getDashboardStats() {
  const supabase = await createClient();
  if (!supabase) {
    const trend = buildWeeklyTrend(demoServiceEntries);
    const servicesByType = buildServicesByType(demoServiceEntries);
    return {
      totalClients: demoClients.length,
      totalEntries: demoServiceEntries.length,
      totalHours: Math.round(
        demoServiceEntries.reduce((s, e) => s + (e.duration_minutes ?? 0), 0) / 60
      ),
      weeklyTrend: trend,
      servicesByType,
    };
  }

  const [clientsRes, entriesCountRes, entriesRes] = await Promise.all([
    supabase.from("clients").select("id", { count: "exact", head: true }),
    supabase.from("service_entries").select("id", { count: "exact", head: true }),
    supabase
      .from("service_entries")
      .select("service_date, duration_minutes, service_types(name)")
      .order("service_date", { ascending: false }),
  ]);

  const entries = (entriesRes.data ?? []) as ChartEntry[];
  return {
    totalClients: clientsRes.count ?? 0,
    totalEntries: entriesCountRes.count ?? 0,
    totalHours: Math.round(
      entries.reduce((s, e) => s + (e.duration_minutes ?? 0), 0) / 60
    ),
    weeklyTrend: buildWeeklyTrend(entries),
    servicesByType: buildServicesByType(entries),
  };
}
