"use client";
import { ProtectedRoute } from "@/components/ProtectedRoute";

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ProtectedRoute allowedRoles={["SUPER_ADMIN", "ADMIN", "USER"]}>
      {children}
    </ProtectedRoute>
  );
}
