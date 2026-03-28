import { notFound } from "next/navigation";
import { AppHeader } from "@/components/layout/app-header";
import { ServiceForm } from "@/components/services/service-form";
import { getClientById } from "@/lib/data/demo";

interface PageProps {
  params: Promise<{ clientId: string }>;
}

export default async function NewServicePage({ params }: PageProps) {
  const { clientId } = await params;
  const client = getClientById(clientId);
  if (!client) notFound();

  return (
    <>
      <AppHeader
        title="Log service"
        description="Manual entry plus voice capture — Groq Whisper + Llama structure your notes."
      />
      <div className="flex-1 px-6 py-8">
        <ServiceForm
          clientId={client.id}
          clientLabel={`${client.first_name} ${client.last_name}`}
        />
      </div>
    </>
  );
}
