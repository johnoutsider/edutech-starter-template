export type Role = "admin" | "teacher" | "student";

export interface AppUser {
  uid: string;
  email: string;
  displayName: string;
  role: Role;
  tenantId: string;
  createdAt: string;
}

export interface Tenant {
  id: string;
  name: string;
  ownerUid: string;
  createdAt: string;
}
