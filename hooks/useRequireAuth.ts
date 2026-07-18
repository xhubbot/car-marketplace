import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";

interface AuthState {
  isLoggedIn: boolean;
  authToken: string | null;
  user: any;
  loading: boolean;
}

/**
 * Hook to check authentication status
 * @param redirect - If true, redirects to login if not authenticated (default: true)
 * @returns { isLoggedIn, authToken, user, loading }
 */
export function useAuth(redirect = true): AuthState {
  const router = useRouter();
  const pathname = usePathname();
  const [authState, setAuthState] = useState<AuthState>({
    isLoggedIn: false,
    authToken: null,
    user: null,
    loading: true,
  });

  useEffect(() => {
    if (typeof window === "undefined") return;

    const authToken = localStorage.getItem("authToken");
    const user = localStorage.getItem("user");

    const isLoggedIn = !!authToken && !!user;

    setAuthState({
      isLoggedIn,
      authToken,
      user: user ? JSON.parse(user) : null,
      loading: false,
    });

    // Redirect to login if not authenticated and redirect is enabled
    if (!isLoggedIn && redirect && pathname) {
      const segments = pathname.split("/");
      const locale = segments[1] || "en";
      router.replace(`/${locale}/login`);
    }
  }, [redirect, pathname, router]);

  return authState;
}

/**
 * Legacy hook - kept for backward compatibility
 * Redirects to login if user is not authenticated
 */
export function useRequireAuth() {
  useAuth(true);
}
