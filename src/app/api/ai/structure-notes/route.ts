import { NextResponse } from "next/server";
import { structureNotes } from "@/lib/ai/groq";
import type { StructuredNote } from "@/types";

const DEMO: StructuredNote = {
  summary:
    "Client and case manager reviewed housing referral paperwork and clarified benefits enrollment steps. Client reported increased stress about timelines but agreed to a follow-up plan.",
  service_type: "Housing navigation",
  action_items: [
    "Email pay stubs to landlord contact by Friday.",
    "Confirm county benefits appointment date.",
  ],
  mood_risk: "Medium risk — situational stress related to housing uncertainty; no safety concerns voiced.",
  follow_up_date: null,
  key_observations:
    "Client asked clarifying questions about document requirements and responded positively to structured next steps.",
};

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const transcript = body.transcript as string | undefined;
    const serviceTypes = (body.serviceTypes as string[]) ?? [];

    if (!transcript) {
      return NextResponse.json({ error: "No transcript" }, { status: 400 });
    }

    try {
      const structured = await structureNotes(transcript, serviceTypes);
      return NextResponse.json(structured);
    } catch {
      return NextResponse.json(DEMO);
    }
  } catch (error) {
    console.error("Note structuring error:", error);
    return NextResponse.json({ error: "Note structuring failed" }, { status: 500 });
  }
}
