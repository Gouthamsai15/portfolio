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
    <main className="admin-login-page">
      <div className="admin-login-grid">
        <section className="admin-login-side">
          <p className="admin-login-side__eyebrow">Super Admin Access</p>
          <h1 className="admin-login-side__title">
            Review, search, and manage every generated portfolio.
          </h1>
          <p className="admin-login-side__text">
            The admin area uses a simple superadmin login and is designed for fast operational
            control across all published portfolio routes.
          </p>
          <div className="admin-login-side__cards">
            {[
              { label: "Total portfolios", icon: KeyRound },
              { label: "Search and review", icon: Mail },
              { label: "Delete instantly", icon: Lock },
            ].map(({ label, icon: Icon }) => (
              <div key={label} className="glass-panel admin-login-side__card">
                <Icon className="h-5 w-5 text-[var(--primary-color)]" />
                <p className="admin-login-side__card-text">{label}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="glass-panel admin-login-panel">
          <p className="admin-login-panel__title">Admin Login</p>
          <p className="admin-login-panel__text">
            {isPasswordRequired
              ? "Sign in with an email listed in `ADMIN_EMAILS` and the shared `ADMIN_PASSWORD` from your environment variables."
              : "Sign in with an allowed admin email. If no `ADMIN_PASSWORD` is configured, email-only admin access is used."}
          </p>

          <form action={loginAction} className="admin-login-form">
            <label className="form-label">
              Email
              <Input
                name="email"
                type="email"
                required
                placeholder="admin@company.com"
                autoComplete="email"
              />
            </label>

            <label className="form-label">
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
              <p className="feedback-message feedback-message--error">
                {params.error}
              </p>
            ) : null}

            <LoadingSubmitButton
              idleLabel="Open Dashboard"
              pendingLabel="Opening Dashboard..."
              className="button-block"
            />
          </form>
        </section>
      </div>
    </main>
  );
}
