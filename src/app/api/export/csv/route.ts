import { NextResponse } from "next/server";

export async function GET() {
  const csv =
    "client_id,first_name,last_name,last_service_date\n" +
    "a0000000-0000-4000-8000-000000000001,Maria,Santos,2026-03-26\n";
  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": 'attachment; filename="clients-export-demo.csv"',
    },
  });
}
