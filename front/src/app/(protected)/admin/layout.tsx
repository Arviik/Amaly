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
      <HeaderConnected />
      <div>
        <AdaptiveLayout
          navItems={superAdminNavItems}
          userType="superAdmin"
          logo="/leaflogo.svg"
          title="Amaly Super-Admin"
        >
          {children}
        </AdaptiveLayout>
      </div>
    </ProtectedRoute>
  );
}
