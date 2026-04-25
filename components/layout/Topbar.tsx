"use client";

import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { signOutUser } from "@/lib/services";

export function Topbar() {
  const { user, tenantId } = useAuth();

  async function handleSignOut() {
    await signOutUser();
    window.location.href = "/login";
  }

  return (
    <header className="flex min-h-16 items-center justify-between border-b bg-background px-4 sm:px-6 lg:px-8">
      <div className="min-w-0">
        <p className="truncate text-sm font-medium">{user?.email ?? "No user loaded"}</p>
        <p className="truncate text-xs text-muted-foreground">Tenant: {tenantId ?? "Unknown"}</p>
      </div>
      <Button onClick={handleSignOut} variant="outline">
        Sign Out
      </Button>
    </header>
  );
}
