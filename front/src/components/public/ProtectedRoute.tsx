"use client";
import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { tokenUtils } from "@/api/config";
import { authService } from "@/api/services/auth";
import { setCredentials, clearCredentials } from "@/app/store/slices/authSlice";
import { DecodedToken } from "@/api/type";
import { RootState } from "@/app/store";
import LoadingSpinner from "./LoadingSpinner";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredAdmin?: boolean;
  requiredSuperAdmin?: boolean;
}

export function ProtectedRoute({
  children,
  requiredAdmin = false,
  requiredSuperAdmin = false,
}: ProtectedRouteProps) {
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();
  const dispatch = useDispatch();
  const { user, memberships, selectedOrganizationId } = useSelector(
    (state: RootState) => state.auth
  );

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const tokens = tokenUtils.getTokens();
        if (!tokens?.accessToken) {
          dispatch(clearCredentials());
          router.push("/login");
          return;
        }

        let decoded: DecodedToken = tokenUtils.decodeToken(tokens.accessToken);
        const currentTime = Math.floor(Date.now() / 1000);

        if (decoded.exp && decoded.exp < currentTime) {
          const refreshed = await authService.refreshToken();
          if (!refreshed) {
            dispatch(clearCredentials());
            router.push("/login");
            return;
          }
          decoded = tokenUtils.decodeToken(tokenUtils.getTokens()!.accessToken);
        }

        dispatch(
          setCredentials({
            user: {
              id: decoded.userId,
              firstName: decoded.firstName || "",
              lastName: decoded.lastName || "",
              email: decoded.email,
              isSuperAdmin: decoded.isSuperAdmin,
            },
            memberships: decoded.memberships,
          })
        );

        if (requiredSuperAdmin && !decoded.isSuperAdmin) {
          router.push("/unauthorized");
          return;
        }

        if (requiredAdmin && !decoded.memberships.some((m) => m.isAdmin)) {
          router.push("/unauthorized");
          return;
        }

        // Vérifier si l'utilisateur doit être redirigé vers la page de sélection d'organisation
        if (
          !selectedOrganizationId &&
          decoded.memberships.length > 1 &&
          pathname !== "/profiles"
        ) {
          router.push("/profiles");
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
  }, [
    dispatch,
    router,
    requiredAdmin,
    requiredSuperAdmin,
    pathname,
    selectedOrganizationId,
  ]);

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return <>{children}</>;
}
