"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/hooks/useAuth";
import { signOutUser } from "@/lib/services";
import type { Role } from "@/types";

interface DashboardPanelProps {
  role: Role;
  title: string;
}

export function DashboardPanel({ role, title }: DashboardPanelProps) {
  const { user, tenantId } = useAuth();

  async function handleSignOut() {
    await signOutUser();
    window.location.href = "/login";
  }

  return (
    <section className="mx-auto w-full max-w-5xl space-y-6">
      <div>
        <p className="text-sm font-medium uppercase text-muted-foreground">{role}</p>
        <h1 className="mt-2 text-3xl font-semibold tracking-normal">{title}</h1>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Workspace</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-3 text-sm sm:grid-cols-2">
            <div className="rounded-md border bg-muted/30 p-4">
              <p className="font-medium">Email</p>
              <p className="mt-1 break-words text-muted-foreground">{user?.email ?? "Unknown"}</p>
            </div>
            <div className="rounded-md border bg-muted/30 p-4">
              <p className="font-medium">Tenant ID</p>
              <p className="mt-1 break-words text-muted-foreground">{tenantId ?? "Unknown"}</p>
            </div>
          </div>
          <Button onClick={handleSignOut} variant="outline">
            Sign Out
          </Button>
        </CardContent>
      </Card>
    </section>
  );
}
