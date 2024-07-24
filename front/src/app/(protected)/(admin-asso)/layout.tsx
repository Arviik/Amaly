// app/(protected)/admin/layout.tsx
"use client";
import AdaptiveLayout from "@/components/layout/AdaptiveLayout";
import HeaderConnected from "@/components/layout/header/HeaderConnected";
import { ProtectedRoute } from "@/components/public/ProtectedRoute";
import {
  Home,
  Users,
  Settings,
  Calendar,
  File,
  Presentation,
  UserRoundCog,
  UserPlus,
} from "lucide-react";

const navItems = [
  { icon: Home, label: "Dashboard", href: "/dashboard" },
  { icon: Users, label: "Members", href: "/ManageMembers" },
  { icon: File, label: "Documents", href: "/documents" },
  { icon: Calendar, label: "Activities", href: "/activities" },
  { icon: Presentation, label: "Assemblé Générale", href: "/ag" },
  { icon: UserPlus, label: "Invite", href: "/invite" },
  { icon: Settings, label: "Settings", href: "/settings" },
];

export default function AdminPageLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ProtectedRoute requiredAdmin>
      <div className="flex flex-col min-h-screen">
        <HeaderConnected />
        <div>
          <AdaptiveLayout
            navItems={navItems}
            userType="admin"
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
