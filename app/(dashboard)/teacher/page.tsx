"use client";

import { DashboardPanel } from "@/components/layout/DashboardPanel";
import { RoleGuard } from "@/components/layout/RoleGuard";

export default function TeacherDashboardPage() {
  return (
    <RoleGuard allowedRoles={["teacher"]}>
      <DashboardPanel role="teacher" title="Teacher Dashboard" />
    </RoleGuard>
  );
}
