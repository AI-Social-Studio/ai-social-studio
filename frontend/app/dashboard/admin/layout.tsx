import type { ReactNode } from "react";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { requireAdminContext } from "@/lib/auth/get-auth-context";

export default async function AdminLayout({ children }: { children: ReactNode }) {
  const auth = await requireAdminContext();

  return <DashboardShell role={auth.role}>{children}</DashboardShell>;
}
