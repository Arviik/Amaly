"use client";
import { ProtectedRoute } from "@/components/ProtectedRoute";

export default function MembersLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <ProtectedRoute>{children}</ProtectedRoute>;
}
