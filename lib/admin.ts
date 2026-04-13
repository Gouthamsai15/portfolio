import { cookies } from "next/headers";
import { redirect } from "next/navigation";

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

function getAdminPassword() {
  return process.env.ADMIN_PASSWORD?.trim() ?? "";
}

export function hasAdminPassword() {
  return Boolean(getAdminPassword());
}

export function isAdminPasswordRequired() {
  return Boolean(getAdminPassword());
}

export async function getAdminUser() {
  const cookieStore = await cookies();
  const email = cookieStore.get("admin-session")?.value?.trim().toLowerCase();

  if (!email || !isAllowedAdmin(email)) {
    return null;
  }

  return { email };
}

export async function requireAdminUser() {
  const user = await getAdminUser();

  if (!user) {
    redirect("/admin/login");
  }

  return user;
}
