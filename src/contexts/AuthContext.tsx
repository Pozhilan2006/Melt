"use client";

/**
 * AuthContext — single source of truth for authentication state.
 *
 * Provides:
 *   currentUser   — the authenticated ApiUser, or null
 *   isAuthenticated — boolean derived from currentUser
 *   isLoading     — true while checking session on mount
 *   login()       — POST /auth/login, store token, set user
 *   register()    — POST /auth/register, store token, set user
 *   logout()      — clear token + user state
 *   loadCurrentUser() — re-fetch /auth/me (e.g. after profile update)
 */

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  ReactNode,
} from "react";
import {
  authApi,
  setToken,
  removeToken,
  getToken,
  LoginPayload,
  RegisterPayload,
  ApiUser,
} from "@/lib/api";

// ── Types ─────────────────────────────────────────────────────────────────────

interface AuthContextValue {
  currentUser: ApiUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (payload: LoginPayload) => Promise<ApiUser>;
  register: (payload: RegisterPayload) => Promise<ApiUser>;
  logout: () => void;
  loadCurrentUser: () => Promise<void>;
}

// ── Context ───────────────────────────────────────────────────────────────────

const AuthContext = createContext<AuthContextValue | null>(null);

// ── Provider ──────────────────────────────────────────────────────────────────

export function AuthProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUser] = useState<ApiUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const logout = useCallback(() => {
    removeToken();
    setCurrentUser(null);
  }, []);

  const loadCurrentUser = useCallback(async () => {
    const token = getToken();
    if (!token) {
      setIsLoading(false);
      return;
    }
    try {
      const user = await authApi.me();
      setCurrentUser(user);
    } catch {
      // Token expired or invalid
      removeToken();
      setCurrentUser(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // On mount: restore session from cookie
  useEffect(() => {
    loadCurrentUser();
  }, [loadCurrentUser]);

  // Listen for 401 events dispatched by apiFetch
  useEffect(() => {
    const handler = () => {
      setCurrentUser(null);
    };
    window.addEventListener("melt:unauthenticated", handler);
    return () => window.removeEventListener("melt:unauthenticated", handler);
  }, []);

  const login = useCallback(async (payload: LoginPayload): Promise<ApiUser> => {
    const response = await authApi.login(payload);
    setToken(response.access_token);
    setCurrentUser(response.user);
    return response.user;
  }, []);

  const register = useCallback(
    async (payload: RegisterPayload): Promise<ApiUser> => {
      const response = await authApi.register(payload);
      setToken(response.access_token);
      setCurrentUser(response.user);
      return response.user;
    },
    []
  );

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        isAuthenticated: currentUser !== null,
        isLoading,
        login,
        register,
        logout,
        loadCurrentUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// ── Hook ──────────────────────────────────────────────────────────────────────

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used inside <AuthProvider>");
  }
  return ctx;
}
