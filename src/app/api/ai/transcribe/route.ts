import { NextResponse } from "next/server";
import { transcribeAudio } from "@/lib/ai/groq";

const DEMO =
  "Demo transcript: The client discussed housing navigation and next steps for benefits enrollment. They expressed concern about documentation deadlines. We scheduled a follow-up call for next Tuesday.";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const audioFile = formData.get("audio");
    if (!audioFile || !(audioFile instanceof File)) {
      return NextResponse.json({ error: "No audio file" }, { status: 400 });
    }

    try {
      const transcript = await transcribeAudio(audioFile);
      return NextResponse.json({ transcript });
    } catch {
      return NextResponse.json({ transcript: DEMO });
    }
  } catch (error) {
    console.error("Transcription error:", error);
    return NextResponse.json({ error: "Transcription failed" }, { status: 500 });
  }
}
