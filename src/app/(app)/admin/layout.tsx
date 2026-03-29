import type { ReactNode } from "react";
import { redirect } from "next/navigation";
import { getAdminContext } from "@/lib/auth/admin";

export default async function AdminLayout({ children }: { children: ReactNode }) {
  const { isAdmin } = await getAdminContext();
  if (!isAdmin) {
    redirect("/dashboard");
  }
  return children;
}
