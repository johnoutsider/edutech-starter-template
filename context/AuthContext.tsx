"use client";

import { createContext, useCallback, useEffect, useMemo, useState } from "react";
import { getUser, subscribeToAuthState } from "@/lib/services";
import type { AppUser, Role } from "@/types";

interface AuthContextValue {
  user: AppUser | null;
  role: Role | null;
  tenantId: string | null;
  loading: boolean;
  refreshUser: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [user, setUser] = useState<AppUser | null>(null);
  const [loading, setLoading] = useState(true);

  const loadUser = useCallback(async (uid: string) => {
    const appUser = await getUser(uid);
    setUser(appUser);
  }, []);

  const refreshUser = useCallback(async () => {
    setLoading(true);
    try {
      const uid = user?.uid;

      if (uid) {
        await loadUser(uid);
      }
    } finally {
      setLoading(false);
    }
  }, [loadUser, user?.uid]);

  useEffect(() => {
    const unsubscribe = subscribeToAuthState(async (authUser) => {
      setLoading(true);

      try {
        if (!authUser) {
          setUser(null);
          return;
        }

        await loadUser(authUser.uid);
      } finally {
        setLoading(false);
      }
    });

    return unsubscribe;
  }, [loadUser]);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      role: user?.role ?? null,
      tenantId: user?.tenantId ?? null,
      loading,
      refreshUser
    }),
    [loading, refreshUser, user]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
