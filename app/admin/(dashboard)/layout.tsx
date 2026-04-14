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
    <main className="admin-layout">
      <header className="glass-panel admin-layout__header">
        <div>
          <p className="admin-layout__eyebrow">GSR ERP Admin</p>
          <h1 className="admin-layout__title">
            Portfolio Operations Dashboard
          </h1>
          <p className="admin-layout__text">
            Signed in as {user.email ?? "admin"}.
          </p>
        </div>
        <div className="admin-layout__actions">
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
