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
