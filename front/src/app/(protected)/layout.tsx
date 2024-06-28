"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { RootState } from "@/app/store";
import { authService } from "@/api/services/auth";
import LoadingSpinner from "@/components/LoadingSpinner"; // Créez ce composant si vous ne l'avez pas déjà

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isLoading, setIsLoading] = useState(true);
  const isAuthenticated = useSelector(
    (state: RootState) => state.auth.isAuthenticated
  );
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      if (!isAuthenticated) {
        const isValid = await authService.checkAndRefreshSession();
        if (!isValid) {
          router.push("/login");
        }
      }
      setIsLoading(false);
    };

    checkAuth();
  }, [isAuthenticated, router]);

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return <>{children}</>;
}
