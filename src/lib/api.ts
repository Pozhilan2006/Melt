/**
 * Centralized API client for MEELT!
 *
 * Reads the JWT from the "melt_token" cookie and attaches it as a Bearer token.
 * On 401 responses, clears the cookie and dispatches a custom event so AuthContext
 * can react without a circular dependency.
 */

import Cookies from "js-cookie";

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";
const TOKEN_COOKIE = "melt_token";

export function getToken(): string | undefined {
  return Cookies.get(TOKEN_COOKIE);
}

export function setToken(token: string): void {
  // 30-day expiry matches backend ACCESS_TOKEN_EXPIRE_MINUTES = 43200
  Cookies.set(TOKEN_COOKIE, token, { expires: 30, sameSite: "lax" });
}

export function removeToken(): void {
  Cookies.remove(TOKEN_COOKIE);
}

export class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
    public detail?: string
  ) {
    super(message);
    this.name = "ApiError";
  }
}

interface FetchOptions extends RequestInit {
  /** If false, skip attaching the Authorization header even if a token exists. */
  authenticated?: boolean;
}

export async function apiFetch<T = unknown>(
  path: string,
  options: FetchOptions = {}
): Promise<T> {
  const { authenticated = true, headers: extraHeaders, ...rest } = options;

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(extraHeaders as Record<string, string>),
  };

  if (authenticated) {
    const token = getToken();
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }
  }

  const response = await fetch(`${API_BASE}${path}`, {
    headers,
    ...rest,
  });

  if (response.status === 401) {
    // Token is expired or invalid — clear it and notify AuthContext
    removeToken();
    if (typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent("melt:unauthenticated"));
    }
  }

  if (!response.ok) {
    let detail: string | undefined;
    try {
      const body = await response.json();
      detail = body?.detail ?? body?.message;
    } catch {
      // response body not JSON
    }
    throw new ApiError(
      response.status,
      detail ?? `Request failed with status ${response.status}`,
      detail
    );
  }

  // 204 No Content
  if (response.status === 204) {
    return undefined as T;
  }

  return response.json() as Promise<T>;
}

// ── Typed API helpers ─────────────────────────────────────────────────────────

export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface UpdateProfilePayload {
  name?: string;
  bio?: string;
  profile_image?: string;
  location_name?: string;
  lat?: number;
  lng?: number;
}

export interface UpdateInterestsPayload {
  interest_ids: string[];
}

export interface ApiUser {
  id: string;
  name: string;
  username: string;
  email: string;
  bio: string | null;
  profile_image: string | null;
  location_name: string | null;
  lat: number | null;
  lng: number | null;
  badge: string;
  hype_level: number;
  karma: number;
  is_onboarded: boolean;
  is_active: boolean;
  created_at: string;
  interests: ApiInterest[];
}

export interface ApiInterest {
  id: string;
  name: string;
  category: string;
  emoji: string | null;
  badge_bg: string | null;
}

export interface ApiCommunityMember {
  id: string;
  name: string;
  username: string;
  profile_image: string | null;
  role: "MEMBER" | "ORGANIZER" | "ADMIN";
  joined_at: string;
}

export interface ApiMembership {
  is_member: boolean;
  role: "MEMBER" | "ORGANIZER" | "ADMIN" | null;
}

export interface ApiCommunity {
  id: string;
  name: string;
  tagline: string | null;
  description: string | null;
  category: string;
  location: string;
  visibility: "PUBLIC" | "PRIVATE";
  activity_status: string;
  banner_bg: string | null;
  anime_mascot: string | null;
  is_verified: boolean;
  created_by: string | null;
  created_at: string;
  lead_user: ApiUser | null;
  member_count: number;
  members: ApiCommunityMember[];
  membership: ApiMembership | null;
}

export interface TokenResponse {
  access_token: string;
  token_type: string;
  user: ApiUser;
}

export const authApi = {
  register: (payload: RegisterPayload) =>
    apiFetch<TokenResponse>("/api/v1/auth/register", {
      method: "POST",
      body: JSON.stringify(payload),
      authenticated: false,
    }),

  login: (payload: LoginPayload) =>
    apiFetch<TokenResponse>("/api/v1/auth/login", {
      method: "POST",
      body: JSON.stringify(payload),
      authenticated: false,
    }),

  me: () => apiFetch<ApiUser>("/api/v1/auth/me"),
};

export const userApi = {
  getMe: () => apiFetch<ApiUser>("/api/v1/users/me"),

  updateProfile: (payload: UpdateProfilePayload) =>
    apiFetch<ApiUser>("/api/v1/users/me", {
      method: "PATCH",
      body: JSON.stringify(payload),
    }),

  updateInterests: (payload: UpdateInterestsPayload) =>
    apiFetch<ApiUser>("/api/v1/users/me/interests", {
      method: "PUT",
      body: JSON.stringify(payload),
    }),

  completeOnboarding: () =>
    apiFetch<ApiUser>("/api/v1/users/me/onboarding", { method: "POST" }),
};

export const interestsApi = {
  list: () =>
    apiFetch<ApiInterest[]>("/api/v1/interests", { authenticated: false }),
};

export interface CreateCommunityPayload {
  name: string;
  description: string;
  category: string;
  location: string;
  visibility: "PUBLIC" | "PRIVATE";
}

export const communitiesApi = {
  list: (params: { search?: string; category?: string } = {}) => {
    const query = new URLSearchParams();
    if (params.search) query.set("search", params.search);
    if (params.category && params.category !== "ALL") query.set("category", params.category);
    const suffix = query.toString() ? `?${query.toString()}` : "";
    return apiFetch<ApiCommunity[]>(`/api/v1/communities${suffix}`);
  },

  get: (id: string) => apiFetch<ApiCommunity>(`/api/v1/communities/${id}`),

  create: (payload: CreateCommunityPayload) =>
    apiFetch<ApiCommunity>("/api/v1/communities", {
      method: "POST",
      body: JSON.stringify(payload),
    }),

  join: (id: string) =>
    apiFetch<ApiCommunity>(`/api/v1/communities/${id}/join`, { method: "POST" }),

  leave: (id: string) =>
    apiFetch<ApiCommunity>(`/api/v1/communities/${id}/leave`, { method: "DELETE" }),

  members: (id: string) =>
    apiFetch<ApiCommunityMember[]>(`/api/v1/communities/${id}/members`),
};
