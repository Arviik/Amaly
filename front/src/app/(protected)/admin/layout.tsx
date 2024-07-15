"use client";
import AdaptiveLayout from "@/components/layout/AdaptiveLayout";
import HeaderConnected from "@/components/layout/header/HeaderConnected";
import { ProtectedRoute } from "@/components/public/ProtectedRoute";
import { Home, Users, Building, Settings } from "lucide-react";

const superAdminNavItems = [
  { icon: Home, label: "Overview", href: "/admin/overview" },
  { icon: Building, label: "Organizations", href: "/admin/organizations" },
  { icon: Users, label: "Users", href: "/admin/users" },
  { icon: Settings, label: "Settings", href: "/admin/settings" },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ProtectedRoute requiredSuperAdmin>
      <div className="flex flex-col min-h-screen">
        <HeaderConnected />
        <div className="flex-1 mt-14">
          <AdaptiveLayout
            navItems={superAdminNavItems}
            userType="superAdmin"
            logo="/leaflogo.svg"
            title="Amaly Admin"
          >
            {children}
          </AdaptiveLayout>
        </div>
      </div>
    </ProtectedRoute>
  );
}
