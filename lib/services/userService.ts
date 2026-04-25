import {
  browserSessionPersistence,
  onAuthStateChanged,
  setPersistence,
  signInWithEmailAndPassword,
  signOut,
  type User
} from "firebase/auth";
import {
  collection,
  collectionGroup,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  query,
  setDoc,
  updateDoc,
  where
} from "firebase/firestore";
import { auth, db } from "@/lib/firebase/config";
import type { AppUser } from "@/types";

const USERS_COLLECTION = "users";

function mapUser(uid: string, data: Record<string, unknown>): AppUser {
  return {
    uid,
    email: String(data.email ?? ""),
    displayName: String(data.displayName ?? ""),
    role: data.role as AppUser["role"],
    tenantId: String(data.tenantId ?? ""),
    createdAt: String(data.createdAt ?? "")
  };
}

export async function loginWithEmailPassword(email: string, password: string): Promise<User> {
  try {
    await setPersistence(auth, browserSessionPersistence);
    const credential = await signInWithEmailAndPassword(auth, email, password);
    const token = await credential.user.getIdToken();
    document.cookie = `firebase-session=${token}; path=/; max-age=86400; SameSite=Lax`;
    return credential.user;
  } catch (error) {
    console.error("Failed to sign in.", error);
    throw new Error("Unable to sign in with the provided credentials.");
  }
}

export async function signOutUser(): Promise<void> {
  try {
    await signOut(auth);
    document.cookie = "firebase-session=; path=/; max-age=0; SameSite=Lax";
  } catch (error) {
    console.error("Failed to sign out.", error);
    throw new Error("Unable to sign out.");
  }
}

export function subscribeToAuthState(callback: (user: User | null) => void): () => void {
  return onAuthStateChanged(auth, callback);
}

export async function getUser(uid: string): Promise<AppUser | null> {
  try {
    const usersQuery = query(collectionGroup(db, USERS_COLLECTION), where("uid", "==", uid));
    const snapshot = await getDocs(usersQuery);

    if (snapshot.empty) {
      return null;
    }

    const userDoc = snapshot.docs[0];
    return mapUser(String(userDoc.data().uid ?? userDoc.id), userDoc.data());
  } catch (error) {
    console.error("Failed to get user.", error);
    throw new Error("Unable to load user.");
  }
}

export async function createUser(data: Omit<AppUser, "uid">): Promise<void> {
  try {
    const uid = auth.currentUser?.uid ?? doc(collection(db, `tenants/${data.tenantId}/${USERS_COLLECTION}`)).id;
    const userRef = doc(db, `tenants/${data.tenantId}/${USERS_COLLECTION}/${uid}`);
    await setDoc(userRef, { ...data, uid });
  } catch (error) {
    console.error("Failed to create user.", error);
    throw new Error("Unable to create user.");
  }
}

export async function updateUser(uid: string, data: Partial<AppUser>): Promise<void> {
  try {
    const existingUser = await getUser(uid);

    if (!existingUser) {
      throw new Error("User not found.");
    }

    const tenantId = data.tenantId ?? existingUser.tenantId;
    const userRef = doc(db, `tenants/${tenantId}/${USERS_COLLECTION}/${uid}`);
    await updateDoc(userRef, data);
  } catch (error) {
    console.error("Failed to update user.", error);
    throw new Error("Unable to update user.");
  }
}

export async function deleteUser(uid: string): Promise<void> {
  try {
    const existingUser = await getUser(uid);

    if (!existingUser) {
      return;
    }

    const userRef = doc(db, `tenants/${existingUser.tenantId}/${USERS_COLLECTION}/${uid}`);
    await deleteDoc(userRef);
  } catch (error) {
    console.error("Failed to delete user.", error);
    throw new Error("Unable to delete user.");
  }
}

export async function getUsersByTenant(tenantId: string): Promise<AppUser[]> {
  try {
    const usersRef = collection(db, `tenants/${tenantId}/${USERS_COLLECTION}`);
    const snapshot = await getDocs(usersRef);
    return snapshot.docs.map((userDoc) => mapUser(userDoc.id, userDoc.data()));
  } catch (error) {
    console.error("Failed to get users by tenant.", error);
    throw new Error("Unable to load users.");
  }
}

export async function userExists(uid: string, tenantId: string): Promise<boolean> {
  try {
    const userRef = doc(db, `tenants/${tenantId}/${USERS_COLLECTION}/${uid}`);
    const snapshot = await getDoc(userRef);
    return snapshot.exists();
  } catch (error) {
    console.error("Failed to check user existence.", error);
    throw new Error("Unable to check user.");
  }
}
