"use client";
import { ProtectedRoute } from "@/components/public/ProtectedRoute";

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
