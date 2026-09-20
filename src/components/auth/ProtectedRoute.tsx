"use client";

/**
 * ProtectedRoute — wraps any page/component that requires authentication.
 *
 * Behavior:
 *   - While auth state loads: shows a loading spinner.
 *   - If unauthenticated: redirects to /login (preserves intended destination).
 *   - If authenticated but not onboarded: redirects to /onboarding.
 *   - Otherwise: renders children normally.
 */

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { LoadingState } from "@/components/ui/LoadingState";

interface ProtectedRouteProps {
  children: React.ReactNode;
  /** If true, skip onboarding redirect (used on the onboarding page itself). */
  skipOnboardingCheck?: boolean;
}

export function ProtectedRoute({ children, skipOnboardingCheck = false }: ProtectedRouteProps) {
  const { isAuthenticated, isLoading, currentUser } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isLoading) return;

    if (!isAuthenticated) {
      router.replace("/login");
      return;
    }

    if (!skipOnboardingCheck && currentUser && !currentUser.is_onboarded) {
      router.replace("/onboarding");
    }
  }, [isAuthenticated, isLoading, currentUser, skipOnboardingCheck, router]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <LoadingState message="CHECKING YOUR MEELT! PASS..." />
      </div>
    );
  }

  if (!isAuthenticated) {
    return null; // Router will redirect
  }

  if (!skipOnboardingCheck && currentUser && !currentUser.is_onboarded) {
    return null; // Router will redirect to onboarding
  }

  return <>{children}</>;
}
