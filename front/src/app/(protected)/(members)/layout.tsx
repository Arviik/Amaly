// app/(protected)/admin/layout.tsx
"use client"
import MemberLayout from "@/components/members/MemberLayout";
import {ProtectedRoute} from "@/components/public/ProtectedRoute";
import Chatbot from "@/components/public/chatbot/Chatbot";
import {Calendar, File, Home, Presentation, Settings, UserRoundCog, Users} from "lucide-react";
import HeaderConnected from "@/components/layout/header/HeaderConnected";
import AdaptiveLayout from "@/components/layout/AdaptiveLayout";

const navItems = [
    { icon: Home, label: "Dashboard", href: "/dashboard" },
    { icon: Users, label: "Members", href: "/ManageMembers" },
    { icon: File, label: "Documents", href: "/member/documents" },
    { icon: Settings, label: "Settings", href: "/settings" },
    { icon: Calendar, label: "Activities", href: "/member/activities" },
    { icon: Presentation, label: "Assemblé Générale", href: "/member/ag" },
    { icon: UserRoundCog, label: "Profile", href: "/member/user-profile" },
];

export default function MemberPageLayout({children,}: { children: React.ReactNode; }) {
    return (
        <ProtectedRoute>
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
