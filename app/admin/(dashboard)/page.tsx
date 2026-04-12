import { AdminDashboard } from "@/components/admin/admin-dashboard";
import { getAdminDashboardData } from "@/lib/queries";
import { requireAdminUser } from "@/lib/admin";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  await requireAdminUser();
  const { total, rows } = await getAdminDashboardData();

  return <AdminDashboard initialRows={rows} total={total} />;
}
