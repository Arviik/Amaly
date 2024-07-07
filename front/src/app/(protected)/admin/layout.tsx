"use client";

import { ProtectedRoute } from "@/components/public/ProtectedRoute";
import NavBarSuperAdmin from "@/components/super-admin/NavBarSuperAdmin";
import { SuperAdminNavProvider } from "@/components/super-admin/SuperAdminNavContext";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ProtectedRoute allowedRoles={["SUPER_ADMIN"]}>
      <SuperAdminNavProvider>
        <div className="flex min-h-screen bg-gray-100">
          <NavBarSuperAdmin />
          <main className="flex-1 transition-all duration-300 ease-in-out lg:ml-64">
            <div className="container mx-auto px-4 py-8">{children}</div>
          </main>
        </div>
      </SuperAdminNavProvider>
    </ProtectedRoute>
  );
}
