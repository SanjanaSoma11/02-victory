import type { ReactNode } from "react";
import { AppSidebar } from "@/components/layout/app-sidebar";
import { AppMobileNav } from "@/components/layout/app-mobile-nav";
import { createClient } from "@/lib/supabase/server";
import { getStaffContext } from "@/lib/auth/admin";

export async function AppShell({ children }: { children: ReactNode }) {
  const supabase = await createClient();
  let profile: { full_name: string; email: string; role: string } | null = null;

  if (supabase) {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (user) {
      const { data } = await supabase
        .from("profiles")
        .select("full_name, email, role")
        .eq("id", user.id)
        .single();
      profile = data;
    }
  }

  const isAdmin = !supabase || profile?.role === "admin";
  const { isStaff: isStaffOrAdmin } = await getStaffContext();

  return (
    <div className="flex min-h-screen items-stretch bg-background">
      <AppSidebar profile={profile} isAdmin={isAdmin} isStaffOrAdmin={isStaffOrAdmin} />
      <div className="flex min-h-screen min-w-0 flex-1 flex-col bg-background">
        <AppMobileNav isAdmin={isAdmin} isStaffOrAdmin={isStaffOrAdmin} />
        <main
          id="main-content"
          className="flex min-h-0 flex-1 flex-col bg-background outline-none"
          tabIndex={-1}
        >
          {children}
        </main>
      </div>
    </div>
  );
}
