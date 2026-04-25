"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { getDashboardPath } from "@/lib/routes";
import { useAuth } from "@/hooks/useAuth";

export default function HomePage() {
  const router = useRouter();
  const { role, loading } = useAuth();

  useEffect(() => {
    if (loading) {
      return;
    }

    router.replace(role ? getDashboardPath(role) : "/login");
  }, [loading, role, router]);

  return (
    <main className="flex min-h-screen items-center justify-center px-6">
      <p className="text-sm text-muted-foreground">Loading workspace...</p>
    </main>
  );
}
