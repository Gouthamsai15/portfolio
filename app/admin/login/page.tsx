import { redirect } from "next/navigation";
import { KeyRound, Lock, Mail } from "lucide-react";
import { loginAction } from "@/app/admin/actions";
import { buttonStyles } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { getAdminUser } from "@/lib/admin";
import { hasSupabaseClientConfig } from "@/lib/supabase";

type LoginPageProps = {
  searchParams: Promise<{ error?: string }>;
};

export default async function AdminLoginPage({ searchParams }: LoginPageProps) {
  const isSupabaseConfigured = hasSupabaseClientConfig();
  const [user, params] = await Promise.all([getAdminUser(), searchParams]);

  if (user) {
    redirect("/admin");
  }

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-6xl items-center px-6 py-10 sm:px-8">
      <div className="grid w-full gap-8 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
        <section className="space-y-6">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[var(--primary-color)]">
            Super Admin Access
          </p>
          <h1 className="font-display text-5xl font-semibold tracking-tight text-slate-950 sm:text-6xl">
            Review, search, and manage every generated portfolio.
          </h1>
          <p className="max-w-xl text-lg leading-8 text-muted">
            The admin area is protected with Supabase Auth and designed for fast operational
            control across all published portfolio routes.
          </p>
          <div className="grid gap-4 sm:grid-cols-3">
            {[
              { label: "Total portfolios", icon: KeyRound },
              { label: "Search and review", icon: Mail },
              { label: "Delete instantly", icon: Lock },
            ].map(({ label, icon: Icon }) => (
              <div key={label} className="glass-panel rounded-[1.75rem] p-5">
                <Icon className="h-5 w-5 text-[var(--primary-color)]" />
                <p className="mt-3 text-sm font-medium text-slate-700">{label}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="glass-panel rounded-[2rem] p-6 sm:p-8">
          <p className="font-display text-3xl font-semibold text-slate-950">Admin Login</p>
          <p className="mt-3 text-sm leading-6 text-muted">
            Use a Supabase Auth user account. Restrict access further with the `ADMIN_EMAILS`
            allowlist in your environment variables.
          </p>

          {!isSupabaseConfigured ? (
            <p className="mt-5 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
              Supabase Auth is not configured yet. Add `NEXT_PUBLIC_SUPABASE_URL` and
              `NEXT_PUBLIC_SUPABASE_ANON_KEY` in your environment before using admin login.
            </p>
          ) : null}

          <form action={loginAction} className="mt-8 space-y-5">
            <label className="space-y-2 text-sm font-medium text-slate-800">
              Email
              <Input
                name="email"
                type="email"
                required
                placeholder="admin@company.com"
                disabled={!isSupabaseConfigured}
                autoComplete="email"
              />
            </label>

            <label className="space-y-2 text-sm font-medium text-slate-800">
              Password
              <Input
                name="password"
                type="password"
                required
                placeholder="••••••••"
                disabled={!isSupabaseConfigured}
                autoComplete="current-password"
              />
            </label>

            {params.error ? (
              <p className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
                {params.error}
              </p>
            ) : null}

            <button
              type="submit"
              disabled={!isSupabaseConfigured}
              className={buttonStyles({ size: "lg" }) + " w-full"}
            >
              Open Dashboard
            </button>
          </form>
        </section>
      </div>
    </main>
  );
}
