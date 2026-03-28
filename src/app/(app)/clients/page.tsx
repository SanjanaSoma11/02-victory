import { AppHeader } from "@/components/layout/app-header";
import { ClientList } from "@/components/clients/client-list";
import { demoClients } from "@/lib/data/demo";

export default function ClientsPage() {
  return (
    <>
      <AppHeader
        title="Clients"
        description="Search and open client records. Data below is demo content until Supabase is configured."
      />
      <div className="flex-1 px-6 py-8">
        <ClientList clients={demoClients} />
      </div>
    </>
  );
}
