// app/(protected)/admin/layout.tsx

import AdminLayout from "@/components/public/AdminLayout";
import { ProtectedRoute } from "@/components/public/ProtectedRoute";

export default function AdminPageLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ProtectedRoute allowedRoles={["ADMIN"]}>
      <AdminLayout>{children}</AdminLayout>
    </ProtectedRoute>
  );
}
