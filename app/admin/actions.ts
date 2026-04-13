"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { hasAdminPassword, isAllowedAdmin } from "@/lib/admin";

function getErrorRedirect(message: string) {
  return `/admin/login?error=${encodeURIComponent(message)}`;
}

export async function loginAction(formData: FormData) {
  if (!hasAdminPassword()) {
    redirect(getErrorRedirect("ADMIN_PASSWORD is missing in your environment."));
  }

  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const password = String(formData.get("password") ?? "");

  if (!email || !password) {
    redirect(getErrorRedirect("Enter both email and password."));
  }

  if (!isAllowedAdmin(email)) {
    redirect(getErrorRedirect("This account is not allowed to access the admin dashboard."));
  }

  if (password !== process.env.ADMIN_PASSWORD) {
    redirect(getErrorRedirect("Invalid admin password."));
  }

  const cookieStore = await cookies();
  cookieStore.set({
    name: "admin-session",
    value: email,
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });

  redirect("/admin");
}

export async function logoutAction() {
  const cookieStore = await cookies();
  cookieStore.delete("admin-session");
  redirect("/admin/login");
}
