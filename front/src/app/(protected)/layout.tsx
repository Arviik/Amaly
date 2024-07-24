"use client";
import { ProtectedRoute } from "@/components/public/ProtectedRoute";

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ProtectedRoute>
      <div>{children}</div>
    </ProtectedRoute>
  );
}
