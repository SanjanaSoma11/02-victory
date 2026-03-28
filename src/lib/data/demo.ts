import type { Client, ServiceEntry } from "@/types";

export const DEMO_CLIENT_IDS = {
  maria: "a0000000-0000-4000-8000-000000000001",
  james: "a0000000-0000-4000-8000-000000000002",
  aisha: "a0000000-0000-4000-8000-000000000003",
} as const;

export const demoClients: Client[] = [
  {
    id: DEMO_CLIENT_IDS.maria,
    first_name: "Maria",
    last_name: "Santos",
    date_of_birth: "1988-04-12",
    phone: "(555) 201-4490",
    email: "maria.santos@email.example",
    address: "142 Oak St, Springfield",
    demographics: { language: "ES/EN", household: 3 },
  },
  {
    id: DEMO_CLIENT_IDS.james,
    first_name: "James",
    last_name: "Okonkwo",
    date_of_birth: "1992-11-03",
    phone: "(555) 310-7721",
    email: "j.okonkwo@email.example",
    address: "9 River Rd, Springfield",
    demographics: { veteran: false, employment: "seeking" },
  },
  {
    id: DEMO_CLIENT_IDS.aisha,
    first_name: "Aisha",
    last_name: "Rahman",
    date_of_birth: "1995-07-21",
    phone: "(555) 884-1022",
    email: "a.rahman@email.example",
    address: "Unit 4B, Maple Commons",
    demographics: { language: "EN/BN", referral: "school" },
  },
];

export const demoServiceTypes = [
  "Housing navigation",
  "Benefits enrollment",
  "Mental health referral",
  "Food assistance",
  "Employment coaching",
];

export const demoServiceEntries: ServiceEntry[] = [
  {
    id: "e1000000-0000-4000-8000-000000000001",
    client_id: DEMO_CLIENT_IDS.maria,
    service_type_id: null,
    staff_id: null,
    service_date: new Date(Date.now() - 86400000 * 2).toISOString(),
    duration_minutes: 45,
    notes: "Follow-up on rental application; landlord requested pay stubs.",
    ai_summary: null,
    ai_action_items: [],
    ai_mood_risk: null,
    source: "manual",
    audio_transcript: null,
    service_types: { name: "Housing navigation" },
  },
  {
    id: "e1000000-0000-4000-8000-000000000002",
    client_id: DEMO_CLIENT_IDS.maria,
    service_type_id: null,
    staff_id: null,
    service_date: new Date(Date.now() - 86400000 * 9).toISOString(),
    duration_minutes: 30,
    notes: "Initial intake completed; goals set for stable housing.",
    ai_summary: null,
    ai_action_items: [],
    ai_mood_risk: null,
    source: "voice",
    audio_transcript: "Client described current living situation...",
    service_types: { name: "Housing navigation" },
  },
  {
    id: "e1000000-0000-4000-8000-000000000003",
    client_id: DEMO_CLIENT_IDS.james,
    service_type_id: null,
    staff_id: null,
    service_date: new Date(Date.now() - 86400000 * 2).toISOString(),
    duration_minutes: 60,
    notes: "Resume workshop; scheduled interview prep next week.",
    ai_summary: null,
    ai_action_items: [],
    ai_mood_risk: null,
    source: "manual",
    audio_transcript: null,
    service_types: { name: "Employment coaching" },
  },
];

export function getClientById(id: string): Client | undefined {
  return demoClients.find((c) => c.id === id);
}

export function getServicesForClient(clientId: string): ServiceEntry[] {
  return demoServiceEntries
    .filter((e) => e.client_id === clientId)
    .sort(
      (a, b) =>
        new Date(b.service_date).getTime() - new Date(a.service_date).getTime()
    );
}

export const demoReportId = "r0000000-0000-4000-8000-000000000001";

export const demoSavedReport = {
  id: demoReportId,
  title: "Quarterly Impact Report — Q1 2026",
  period_start: "2026-01-01",
  period_end: "2026-03-31",
  sections: [
    {
      title: "Executive Summary",
      content:
        "This quarter our team served 3 active clients with a focus on housing stability and employment readiness. Service hours increased week-over-week as referrals from partner schools rose.",
    },
    {
      title: "Population Served",
      content:
        "Clients ranged in age from early twenties to late thirties; primary languages included English and Spanish. Two households included children under age 12.",
    },
    {
      title: "Services Delivered",
      content:
        "Housing navigation and employment coaching were the most frequent service types. Median session length was 45 minutes.",
    },
    {
      title: "Outcomes & Impact",
      content:
        "Two clients secured housing interviews; one completed a benefits enrollment packet with county support.",
    },
    {
      title: "Looking Ahead",
      content:
        "We plan to expand evening drop-in hours and deepen partnerships with local food banks.",
    },
  ],
};
