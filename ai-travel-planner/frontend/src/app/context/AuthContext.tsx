"use client";

import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import type { User, LoginCredentials, RegisterCredentials, PasswordChangeData } from "@/lib/types";
import * as api from "@/lib/api";

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (credentials: RegisterCredentials) => Promise<void>;
  logout: () => Promise<void>;
  changePassword: (data: PasswordChangeData) => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  const refreshUser = useCallback(async () => {
  try {

    const token = localStorage.getItem("token");

    if (!token) {
      setUser(null);
      return;
    }

    const currentUser = await api.getCurrentUser();

    setUser(currentUser);

  } catch {

    localStorage.removeItem("token");

    setUser(null);

  }
}, []);

  useEffect(() => {
    refreshUser().finally(() => setIsLoading(false));
  }, [refreshUser]);

  const login = useCallback(
    async (credentials: LoginCredentials) => {
      const { user } = await api.login(credentials);
      setUser(user);
    },
    []
  );

  const register = useCallback(
    async (credentials: RegisterCredentials) => {
      const { user } = await api.register(credentials);
      setUser(user);
    },
    []
  );

  const logout = useCallback(async () => {

  localStorage.removeItem("token");

  setUser(null);

  router.push("/login");

}, [router]);

  const changePassword = useCallback(async (data: PasswordChangeData) => {
    await api.changePassword(data);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        login,
        register,
        logout,
        changePassword,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
