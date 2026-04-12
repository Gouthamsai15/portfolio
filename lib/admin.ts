import { redirect } from "next/navigation";
import { createSupabaseServerComponentClient, hasSupabaseClientConfig } from "@/lib/supabase";

function getAdminAllowList() {
  return (process.env.ADMIN_EMAILS ?? "")
    .split(",")
    .map((value) => value.trim().toLowerCase())
    .filter(Boolean);
}

function isAllowedAdmin(email: string | null | undefined) {
  const allowList = getAdminAllowList();

  if (!allowList.length) {
    return true;
  }

  return Boolean(email && allowList.includes(email.toLowerCase()));
}

export { isAllowedAdmin };

export async function getAdminUser() {
  if (!hasSupabaseClientConfig()) {
    return null;
  }

  const supabase = await createSupabaseServerComponentClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user || !isAllowedAdmin(user.email)) {
    return null;
  }

  return user;
}

export async function requireAdminUser() {
  const user = await getAdminUser();

  if (!user) {
    redirect("/admin/login");
  }

  return user;
}
