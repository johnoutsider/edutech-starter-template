import { addDoc, collection, doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase/config";
import type { Tenant } from "@/types";

function mapTenant(id: string, data: Record<string, unknown>): Tenant {
  return {
    id,
    name: String(data.name ?? ""),
    ownerUid: String(data.ownerUid ?? ""),
    createdAt: String(data.createdAt ?? "")
  };
}

export async function getTenant(tenantId: string): Promise<Tenant | null> {
  try {
    const tenantRef = doc(db, `tenants/${tenantId}`);
    const snapshot = await getDoc(tenantRef);

    if (!snapshot.exists()) {
      return null;
    }

    return mapTenant(snapshot.id, snapshot.data());
  } catch (error) {
    console.error("Failed to get tenant.", error);
    throw new Error("Unable to load tenant.");
  }
}

export async function createTenant(data: Omit<Tenant, "id">): Promise<string> {
  try {
    const tenantRef = await addDoc(collection(db, "tenants"), data);
    await setDoc(tenantRef, { ...data, id: tenantRef.id }, { merge: true });
    return tenantRef.id;
  } catch (error) {
    console.error("Failed to create tenant.", error);
    throw new Error("Unable to create tenant.");
  }
}

export async function updateTenant(tenantId: string, data: Partial<Tenant>): Promise<void> {
  try {
    const tenantRef = doc(db, `tenants/${tenantId}`);
    await updateDoc(tenantRef, data);
  } catch (error) {
    console.error("Failed to update tenant.", error);
    throw new Error("Unable to update tenant.");
  }
}
