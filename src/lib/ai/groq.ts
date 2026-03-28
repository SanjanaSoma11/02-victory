import OpenAI from "openai";
import type { StructuredNote } from "@/types";

function getGroq() {
  const key = process.env.GROQ_API_KEY;
  if (!key) return null;
  return new OpenAI({
    apiKey: key,
    baseURL: "https://api.groq.com/openai/v1",
  });
}

export async function transcribeAudio(audioFile: File): Promise<string> {
  const groq = getGroq();
  if (!groq) {
    throw new Error("GROQ_NOT_CONFIGURED");
  }
  const transcription = await groq.audio.transcriptions.create({
    model: "whisper-large-v3-turbo",
    file: audioFile,
    language: "en",
  });
  return transcription.text;
}

export async function structureNotes(
  transcript: string,
  serviceTypes: string[]
): Promise<StructuredNote> {
  const groq = getGroq();
  if (!groq) {
    throw new Error("GROQ_NOT_CONFIGURED");
  }
  const completion = await groq.chat.completions.create({
    model: "llama-3.3-70b-versatile",
    messages: [
      {
        role: "system",
        content: `You are a case management assistant for a nonprofit organization.
Given a voice transcript from a case manager after a client session, extract structured case notes.

Available service types: ${serviceTypes.join(", ")}

Respond ONLY with valid JSON matching this exact schema:
{
  "summary": "2-3 sentence clinical summary of the session",
  "service_type": "best matching service type from the list above",
  "action_items": ["specific follow-up actions mentioned or implied"],
  "mood_risk": "brief mood/risk assessment (Low/Medium/High risk with one-line reasoning)",
  "follow_up_date": "YYYY-MM-DD if mentioned or implied, null otherwise",
  "key_observations": "notable client statements or behavioral observations"
}

Rules:
- Extract ONLY what was said. Never fabricate details.
- If no service type matches, use the closest one.
- If no follow-up date is mentioned, set to null.
- Keep summary under 3 sentences.`,
      },
      { role: "user", content: transcript },
    ],
    response_format: { type: "json_object" },
    temperature: 0.3,
    max_tokens: 1024,
  });

  return JSON.parse(completion.choices[0].message.content ?? "{}") as StructuredNote;
}

export interface ReportData {
  period: { start: string; end: string };
  total_unique_clients: number;
  total_service_entries: number;
  total_service_hours: number;
  services_by_type: Record<string, number>;
}

export interface FunderReportShape {
  title: string;
  sections: { title: string; content: string }[];
}

export async function generateFunderReport(
  aggregatedData: ReportData
): Promise<FunderReportShape> {
  const groq = getGroq();
  if (!groq) {
    throw new Error("GROQ_NOT_CONFIGURED");
  }
  const completion = await groq.chat.completions.create({
    model: "llama-3.3-70b-versatile",
    messages: [
      {
        role: "system",
        content: `You are a grant report writer for a nonprofit organization.
Given aggregated service data, generate a professional funder report.

Write in a warm but data-driven tone. Include specific numbers from the data.

Respond ONLY with valid JSON matching this schema:
{
  "title": "Quarterly Impact Report — [Quarter] [Year]",
  "sections": [
    { "title": "Executive Summary", "content": "2-3 paragraph overview..." },
    { "title": "Population Served", "content": "Demographics narrative with numbers..." },
    { "title": "Services Delivered", "content": "Breakdown by service type with hours..." },
    { "title": "Outcomes & Impact", "content": "Key outcomes and client stories..." },
    { "title": "Looking Ahead", "content": "Goals and needs for next quarter..." }
  ]
}

Rules:
- Use ONLY the numbers in the provided data. Never fabricate statistics.
- Write complete paragraphs, not bullet points.
- Make it compelling for a funder — show impact, not just activity.`,
      },
      {
        role: "user",
        content: `Generate a funder report for this data:\n${JSON.stringify(aggregatedData, null, 2)}`,
      },
    ],
    response_format: { type: "json_object" },
    temperature: 0.5,
    max_tokens: 4096,
  });

  return JSON.parse(completion.choices[0].message.content ?? "{}") as FunderReportShape;
}
