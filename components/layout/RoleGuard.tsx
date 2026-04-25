"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { getDashboardPath } from "@/lib/routes";
import type { Role } from "@/types";

interface RoleGuardProps {
  allowedRoles: Role[];
  children: React.ReactNode;
}

export function RoleGuard({ allowedRoles, children }: RoleGuardProps) {
  const router = useRouter();
  const { loading, role } = useAuth();

  useEffect(() => {
    if (loading) {
      return;
    }

    if (!role) {
      router.replace("/login");
      return;
    }

    if (!allowedRoles.includes(role)) {
      router.replace(getDashboardPath(role));
    }
  }, [allowedRoles, loading, role, router]);

  if (loading || !role || !allowedRoles.includes(role)) {
    return (
      <div className="flex min-h-[calc(100vh-8rem)] items-center justify-center">
        <p className="text-sm text-muted-foreground">Checking workspace access...</p>
      </div>
    );
  }

  return children;
}
