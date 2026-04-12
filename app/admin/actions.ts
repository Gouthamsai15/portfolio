"use server";

import { redirect } from "next/navigation";
import { isAllowedAdmin } from "@/lib/admin";
import { createSupabaseServerComponentClient, hasSupabaseClientConfig } from "@/lib/supabase";

function getErrorRedirect(message: string) {
  return `/admin/login?error=${encodeURIComponent(message)}`;
}

export async function loginAction(formData: FormData) {
  if (!hasSupabaseClientConfig()) {
    redirect(getErrorRedirect("Supabase Auth is not configured yet."));
  }

  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const password = String(formData.get("password") ?? "");

  if (!email || !password) {
    redirect(getErrorRedirect("Enter both email and password."));
  }

  const supabase = await createSupabaseServerComponentClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    redirect(getErrorRedirect(error.message));
  }

  if (!isAllowedAdmin(email)) {
    await supabase.auth.signOut();
    redirect(getErrorRedirect("This account is not allowed to access the admin dashboard."));
  }

  redirect("/admin");
}

export async function logoutAction() {
  if (!hasSupabaseClientConfig()) {
    redirect("/admin/login");
  }

  const supabase = await createSupabaseServerComponentClient();
  await supabase.auth.signOut();
  redirect("/admin/login");
}
