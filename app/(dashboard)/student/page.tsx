"use client";

import { DashboardPanel } from "@/components/layout/DashboardPanel";
import { RoleGuard } from "@/components/layout/RoleGuard";

export default function StudentDashboardPage() {
  return (
    <RoleGuard allowedRoles={["student"]}>
      <DashboardPanel role="student" title="Student Dashboard" />
    </RoleGuard>
  );
}
