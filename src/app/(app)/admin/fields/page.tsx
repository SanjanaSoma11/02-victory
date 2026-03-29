import { AppHeader } from "@/components/layout/app-header";
import { FieldsAdminForm } from "@/components/admin/fields-admin-form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function AdminFieldsPage() {
  return (
    <>
      <AppHeader
        title="Custom fields"
        description="Define extra questions for client records and service logs without deploying code."
      />
      <div className="flex-1 space-y-8 px-6 py-8">
        <Card>
          <CardHeader>
            <CardTitle className="font-heading text-lg">New field</CardTitle>
            <CardDescription>
              Values save into client <code className="text-xs">demographics</code> JSON or service{" "}
              <code className="text-xs">custom_fields</code>. Run the Supabase migration if these columns or tables are
              missing.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <FieldsAdminForm />
          </CardContent>
        </Card>
      </div>
    </>
  );
}
