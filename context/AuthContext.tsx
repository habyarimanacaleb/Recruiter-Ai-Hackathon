"use client";

import React, { createContext, useContext, ReactNode, useMemo, useState, useEffect } from "react";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { UserRole } from "@/types";

interface AuthActions {
  login: typeof authClient.signIn.email;
  signUp: typeof authClient.signUp.email;
  logout: () => Promise<void>;
  refresh: () => Promise<void>;
  listUsers: typeof authClient.admin.listUsers;
  getUser: (userId: string) => Promise<any>; 
  updateUser: typeof authClient.admin.updateUser;
  deleteUser: typeof authClient.admin.removeUser;
  banUser: typeof authClient.admin.banUser;
  unbanUser: typeof authClient.admin.unbanUser;
  listSessions: typeof authClient.listSessions;
  revokeSession: typeof authClient.revokeSession;
  sendVerificationEmail: typeof authClient.sendVerificationEmail;
}

interface AuthContextType {
  user: any | null;
  session: any | null;
  isPending: boolean;
  isAdmin: boolean;
  isRecruiter: boolean;
  actions: AuthActions;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

/**
 * Internal component to isolate client-only hooks.
 * This prevents Next.js 16 SSR from executing useSession() on the server.
 */
const AuthInternal = ({ children }: { children: ReactNode }) => {
  const router = useRouter();
  const { data: sessionData, isPending, refetch } = authClient.useSession();

  const actions = useMemo<AuthActions>(() => ({
    login: authClient.signIn.email,
    signUp: authClient.signUp.email,
    logout: async () => {
      await authClient.signOut({
        fetchOptions: { 
          onSuccess: () => { 
            router.push("/auth/login"); 
            router.refresh(); 
          } 
        }
      });
    },
    refresh: async () => { await refetch(); },
    listUsers: authClient.admin.listUsers,
    getUser: async (id: string) => {
        const { data } = await authClient.admin.listUsers({ query: { limit: 1, offset: 0 } }); 
        return data?.users.find(u => u.id === id);
    },
    updateUser: authClient.admin.updateUser,
    deleteUser: authClient.admin.removeUser,
    banUser: authClient.admin.banUser,
    unbanUser: authClient.admin.unbanUser,
    listSessions: authClient.listSessions,
    revokeSession: authClient.revokeSession,
    sendVerificationEmail: authClient.sendVerificationEmail,
  }), [refetch, router]);

  const value = useMemo(() => ({
    user: (sessionData?.user as (typeof authClient.$Infer.Session.user & { role: UserRole })) ?? null,
    session: sessionData?.session ?? null,
    isPending,
    isAdmin: sessionData?.user?.role === "admin",
    isRecruiter: sessionData?.user?.role === "recruiter", 
    actions,
  }), [sessionData, isPending, actions]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

/**
 * Main Provider with Mounting Guard
 */
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Return nothing during SSR to prevent hook execution crashes
  if (!mounted) return null;

  return <AuthInternal>{children}</AuthInternal>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
};
