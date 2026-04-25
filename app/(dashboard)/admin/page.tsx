"use client";

import { DashboardPanel } from "@/components/layout/DashboardPanel";
import { RoleGuard } from "@/components/layout/RoleGuard";

export default function AdminDashboardPage() {
  return (
    <RoleGuard allowedRoles={["admin"]}>
      <DashboardPanel role="admin" title="Admin Dashboard" />
    </RoleGuard>
  );
}
