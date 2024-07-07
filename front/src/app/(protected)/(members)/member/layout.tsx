"use client";

import { ProtectedRoute } from "@/components/public/ProtectedRoute";

export default function MembersLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <ProtectedRoute>{children}</ProtectedRoute>;
}
