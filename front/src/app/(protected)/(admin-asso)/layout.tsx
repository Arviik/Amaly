// app/(protected)/admin/layout.tsx

import AdaptiveLayout from "@/components/public/AdaptiveLayout";
import { ProtectedRoute } from "@/components/public/ProtectedRoute";
import { Home, Users, Settings, File } from "lucide-react";

export const navItems = [
  { icon: Home, label: "Dashboard", href: "/dashboard" },
  { icon: Users, label: "Members", href: "/ManageMembers" },
  { icon: File, label: "Documents", href: "/documents" },
  { icon: Settings, label: "Settings", href: "/settings" },
];

export default function AdminPageLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ProtectedRoute requiredAdmin>
      <AdaptiveLayout
        navItems={navItems}
        userType="admin"
        logo="/leaflogo.svg"
        title="Amaly Admin"
      >
        {children}
      </AdaptiveLayout>
    </ProtectedRoute>
  );
}
