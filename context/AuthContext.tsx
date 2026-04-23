"use client";

import React, { createContext, useContext, ReactNode, useMemo } from "react";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { UserRole } from "@/types";

// Define logical groupings for a clean API surface
interface AuthActions {
  // --- Standard Actions ---
  login: typeof authClient.signIn.email;
  signUp: typeof authClient.signUp.email;
  logout: () => Promise<void>;
  refresh: () => Promise<void>;

  // --- Admin/Management Actions ---
  // Requires 'admin' plugin on both server and client
  listUsers: typeof authClient.admin.listUsers;
  getUser: (userId: string) => Promise<any>; // Helper for getUserById
  updateUser: typeof authClient.admin.updateUser;
  deleteUser: typeof authClient.admin.removeUser;
  banUser: typeof authClient.admin.banUser;
  unbanUser: typeof authClient.admin.unbanUser;

  // --- Session & Security ---
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

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const router = useRouter();
  const { data: sessionData, isPending, refetch } = authClient.useSession();

  const actions = useMemo<AuthActions>(() => ({
    login: authClient.signIn.email,
    signUp: authClient.signUp.email,
    logout: async () => {
      await authClient.signOut({
        fetchOptions: { onSuccess: () => { router.push("/auth/login"); router.refresh(); } }
      });
    },
    refresh: async () => { await refetch(); },

    // Admin & Lifecycle (Requires Admin Plugin enabled in auth config)
    listUsers: authClient.admin.listUsers,
    getUser: async (id: string) => {
        const { data } = await authClient.admin.listUsers({ query: { limit: 1, offset: 0 } }); 
        // Note: listUsers is the standard way to retrieve; specific ID fetch often uses internal filters
        return data?.users.find(u => u.id === id);
    },
    updateUser: authClient.admin.updateUser,
    deleteUser: authClient.admin.removeUser,
    banUser: authClient.admin.banUser,
    unbanUser: authClient.admin.unbanUser,

    // Sessions
    listSessions: authClient.listSessions,
    revokeSession: authClient.revokeSession,
    sendVerificationEmail: authClient.sendVerificationEmail,
  }), [refetch, router]);

  const value = useMemo(() => ({
    user: sessionData?.user as (typeof authClient.$Infer.Session.user & { role: UserRole }) ?? null,
    session: sessionData?.session ?? null,
    isPending,
    // Safely check if the current user has an 'admin' role
  isAdmin: sessionData?.user?.role === "admin",
  isRecruiter: sessionData?.user?.role === "recruiter", 
    actions,
  }), [sessionData, isPending, actions]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
};
