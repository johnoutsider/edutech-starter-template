"use client";

import Link from "next/link";
import { BookOpen, GraduationCap, Settings, Users } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/useAuth";

const items = {
  admin: [
    { href: "/dashboard/admin", label: "Overview", icon: Settings },
    { href: "/dashboard/admin", label: "Users", icon: Users }
  ],
  teacher: [
    { href: "/dashboard/teacher", label: "Courses", icon: BookOpen },
    { href: "/dashboard/teacher", label: "Students", icon: Users }
  ],
  student: [{ href: "/dashboard/student", label: "Learning", icon: GraduationCap }]
} as const;

export function Sidebar() {
  const { role } = useAuth();
  const navItems = role ? items[role] : [];

  return (
    <aside className="hidden w-64 shrink-0 border-r bg-background md:block">
      <div className="flex h-16 items-center border-b px-6">
        <Link className="text-sm font-semibold tracking-normal" href="/">
          EduTenant
        </Link>
      </div>
      <nav className="space-y-1 p-4">
        {navItems.map((item) => {
          const Icon = item.icon;

          return (
            <Link
              className={cn(
                "flex h-10 items-center gap-3 rounded-md px-3 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
              )}
              href={item.href}
              key={item.label}
            >
              <Icon className="h-4 w-4" />
              {item.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
