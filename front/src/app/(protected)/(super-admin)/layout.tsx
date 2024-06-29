"use client";
import { ProtectedRoute } from "@/components/ProtectedRoute";

export default function SuperAdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ProtectedRoute allowedRoles={["SUPER_ADMIN"]}>{children}</ProtectedRoute>
  );
}
