import { redirect } from "next/navigation";
import { getAdminContext } from "@/lib/auth/admin";
import { AppHeader } from "@/components/layout/app-header";
import { FieldsManager } from "@/components/admin/fields-manager";

export const metadata = { title: "Custom fields" };

export default async function FieldsPage() {
  const { isAdmin } = await getAdminContext();
  if (!isAdmin) {
    redirect("/dashboard");
  }

  return (
    <>
      <AppHeader
        title="Custom fields"
        description="Add extra questions to service logs and client profiles — no code needed."
      />
      <div className="flex-1 space-y-8 px-6 py-8">
        <FieldsManager />
      </div>
    </>
  );
}
