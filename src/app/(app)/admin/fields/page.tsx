import { redirect } from "next/navigation";

// Custom fields management has moved to /fields (accessible to admin + staff).
export default function AdminFieldsRedirect() {
  redirect("/fields");
}
