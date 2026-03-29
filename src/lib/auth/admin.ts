import { createClient } from "@/lib/supabase/server";

export async function getAdminContext(): Promise<{
  isAdmin: boolean;
  userId: string | null;
}> {
  const supabase = await createClient();
  if (!supabase) {
    return { isAdmin: true, userId: null };
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return { isAdmin: false, userId: null };
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .maybeSingle();

  return {
    isAdmin: profile?.role === "admin",
    userId: user.id,
  };
}

/** Returns true for both `admin` and `staff` roles. Use to guard pages / API routes
 *  that should be visible to all authenticated team members. */
export async function getStaffContext(): Promise<{
  isStaff: boolean;
  isAdmin: boolean;
  userId: string | null;
}> {
  const supabase = await createClient();
  if (!supabase) {
    return { isStaff: true, isAdmin: true, userId: null };
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return { isStaff: false, isAdmin: false, userId: null };
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .maybeSingle();

  const isAdmin = profile?.role === "admin";
  const isStaff = isAdmin || profile?.role === "staff";

  return { isStaff, isAdmin, userId: user.id };
}

