import Link from "next/link";
import { logoutAction } from "@/app/admin/actions";
import { buttonStyles } from "@/components/ui/button";
import { LoadingSubmitButton } from "@/components/ui/loading-submit-button";
import { requireAdminUser } from "@/lib/admin";

export const dynamic = "force-dynamic";

export default async function AdminDashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const user = await requireAdminUser();

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-7xl flex-col gap-8 px-6 py-8 sm:px-8">
      <header className="glass-panel flex flex-col gap-4 rounded-[2rem] p-6 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[var(--primary-color)]">
            GSR ERP Admin
          </p>
          <h1 className="mt-3 font-display text-3xl font-semibold tracking-tight text-slate-950">
            Portfolio Operations Dashboard
          </h1>
          <p className="mt-2 text-sm leading-6 text-muted">
            Signed in as {user.email ?? "admin"}.
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Link href="/" className={buttonStyles({ variant: "secondary" })}>
            Back to Generator
          </Link>
          <form action={logoutAction}>
            <LoadingSubmitButton
              idleLabel="Sign Out"
              pendingLabel="Signing Out..."
              size="md"
            />
          </form>
        </div>
      </header>
      {children}
    </main>
  );
}
