import { redirect } from "next/navigation";
import { KeyRound, Lock, Mail } from "lucide-react";
import { loginAction } from "@/app/admin/actions";
import { Input } from "@/components/ui/input";
import { LoadingSubmitButton } from "@/components/ui/loading-submit-button";
import {
  getAdminUser,
  isAdminPasswordRequired,
} from "@/lib/admin";

type LoginPageProps = {
  searchParams: Promise<{ error?: string }>;
};

export default async function AdminLoginPage({ searchParams }: LoginPageProps) {
  const isPasswordRequired = isAdminPasswordRequired();
  const [user, params] = await Promise.all([getAdminUser(), searchParams]);

  if (user) {
    redirect("/admin");
  }

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-6xl items-center px-4 py-6 sm:px-8 sm:py-10">
      <div className="grid w-full gap-8 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
        <section className="hidden space-y-6 lg:block">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[var(--primary-color)]">
            Super Admin Access
          </p>
          <h1 className="font-display text-4xl font-semibold tracking-tight text-slate-950 sm:text-6xl">
            Review, search, and manage every generated portfolio.
          </h1>
          <p className="max-w-xl text-base leading-7 text-muted sm:text-lg sm:leading-8">
            The admin area uses a simple superadmin login and is designed for fast operational
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

        <section className="glass-panel rounded-[2rem] p-5 sm:p-8">
          <p className="font-display text-3xl font-semibold text-slate-950">Admin Login</p>
          <p className="mt-3 text-sm leading-6 text-muted">
            {isPasswordRequired
              ? "Sign in with an email listed in `ADMIN_EMAILS` and the shared `ADMIN_PASSWORD` from your environment variables."
              : "Sign in with an allowed admin email. If no `ADMIN_PASSWORD` is configured, email-only admin access is used."}
          </p>

          <form action={loginAction} className="mt-6 space-y-4 sm:mt-8 sm:space-y-5">
            <label className="space-y-2 text-sm font-medium text-slate-800">
              Email
              <Input
                name="email"
                type="email"
                required
                placeholder="admin@company.com"
                autoComplete="email"
              />
            </label>

            <label className="space-y-2 text-sm font-medium text-slate-800">
              Password
              <Input
                name="password"
                type="password"
                required={isPasswordRequired}
                placeholder="••••••••"
                autoComplete="current-password"
              />
            </label>

            {params.error ? (
              <p className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
                {params.error}
              </p>
            ) : null}

            <LoadingSubmitButton
              idleLabel="Open Dashboard"
              pendingLabel="Opening Dashboard..."
              className="mt-2 w-full sm:mt-3"
            />
          </form>
        </section>
      </div>
    </main>
  );
}
