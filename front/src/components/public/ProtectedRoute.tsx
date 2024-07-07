"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { authService } from "@/api/services/auth";
import { setCredentials, logout } from "@/app/store/slices/authSlice";
import { RootState } from "@/app/store";
import LoadingSpinner from "./LoadingSpinner";

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: string[];
}

export function ProtectedRoute({
  children,
  allowedRoles,
}: ProtectedRouteProps) {
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const dispatch = useDispatch();
  const { isAuthenticated, user } = useSelector(
    (state: RootState) => state.auth
  );

  useEffect(() => {
    const checkAuth = async () => {
      const sessionData = await authService.checkSession();
      if (sessionData) {
        dispatch(
          setCredentials({
            user: {
              id: sessionData.userId.toString(),
              role: sessionData.userRole,
            },
          })
        );
        if (allowedRoles && !allowedRoles.includes(sessionData.userRole)) {
          router.push("/unauthorized");
          return;
        }
      } else {
        dispatch(logout());
        router.push("/login");
        return;
      }
      setIsLoading(false);
    };

    checkAuth();
  }, [allowedRoles, router, dispatch]);
  if (isLoading) {
    return <LoadingSpinner />;
  }

  return <>{children}</>;
}
