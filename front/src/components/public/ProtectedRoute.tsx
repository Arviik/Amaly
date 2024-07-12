"use client";
import { isSuperAdmin, tokenUtils } from "@/api/config";
import { authService } from "@/api/services/auth";
import { DecodedToken } from "@/api/type";
import { RootState } from "@/app/store";
import { clearCredentials, setCredentials } from "@/app/store/slices/authSlice";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import LoadingSpinner from "./LoadingSpinner";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredAdmin?: boolean;
}

export function ProtectedRoute({
  children,
  requiredAdmin = false,
}: ProtectedRouteProps) {
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();
  const dispatch = useDispatch();
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const tokens = tokenUtils.getTokens();
        if (!tokens?.accessToken) {
          dispatch(clearCredentials());
          router.push("/login");
          return;
        }

        const decoded: DecodedToken = tokenUtils.decodeToken(
          tokens.accessToken
        );
        const currentTime = Math.floor(Date.now() / 1000);

        if (decoded.exp && decoded.exp < currentTime) {
          const refreshed = await authService.refreshToken();
          if (!refreshed) {
            dispatch(clearCredentials());
            router.push("/login");
            return;
          }
        }

        dispatch(
          setCredentials({
            user: {
              id: decoded.userId,
              isSuperAdmin: decoded.isSuperAdmin,
            },
            memberships: decoded.memberships,
          })
        );

        if (requiredAdmin && !isSuperAdmin()) {
          router.push("/unauthorized");
          return;
        }

        const redirectPath = authService.getRedirectPath(decoded);
        if (pathname !== redirectPath) {
          router.push(redirectPath);
          return;
        }

        setIsLoading(false);
      } catch (error) {
        console.error("Auth check error:", error);
        dispatch(clearCredentials());
        router.push("/login");
      }
    };

    checkAuth();
  }, [dispatch, router, requiredAdmin, pathname]);

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return <>{children}</>;
}
