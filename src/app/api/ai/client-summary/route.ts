import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getClientById, getServicesForClient } from "@/lib/data/queries";
import { generateClientSummary } from "@/lib/ai/groq";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const client_id = body.client_id as string | undefined;
    if (!client_id) {
      return NextResponse.json({ error: "client_id required" }, { status: 400 });
    }

    const supabase = await createClient();
    if (supabase) {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }
    }

    const client = await getClientById(client_id);
    if (!client) {
      return NextResponse.json({ error: "Client not found" }, { status: 404 });
    }

    const services = await getServicesForClient(client_id);
    const visits = services.map((s) => ({
      date: s.service_date,
      type: s.service_types?.name ?? null,
      notes: s.notes ? String(s.notes).slice(0, 4000) : null,
      summary: s.ai_summary ? String(s.ai_summary).slice(0, 2000) : null,
    }));

    const input = {
      client_label: `${client.first_name} ${client.last_name}`,
      demographics: (client.demographics ?? {}) as Record<string, unknown>,
      visits,
    };

    try {
      const result = await generateClientSummary(input);
      return NextResponse.json(result);
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e);
      if (msg === "GROQ_NOT_CONFIGURED") {
        return NextResponse.json({
          sections: [
            {
              title: "Demo mode",
              content:
                "Set GROQ_API_KEY in .env.local to generate a live summary. Below is a placeholder preview.",
            },
            {
              title: "Services to date",
              content: `${visits.length} visit record(s) on file. Add the API key for a full narrative handoff.`,
            },
            {
              title: "Recommended next steps",
              content: "Review the latest service notes and follow up on any open action items.",
            },
          ],
          demo: true,
        });
      }
      throw e;
    }
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Failed to generate summary";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
