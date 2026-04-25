import type { Role } from "@/types";

export function getDashboardPath(role: Role) {
  return `/dashboard/${role}`;
}
