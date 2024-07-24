// app/(protected)/admin/layout.tsx
"use client";
import AdaptiveLayout from "@/components/layout/AdaptiveLayout";
import HeaderConnected from "@/components/layout/header/HeaderConnected";
import {ProtectedRoute} from "@/components/public/ProtectedRoute";
import {Calendar, File, Home, Users, UserRoundCog, Presentation, Settings} from "lucide-react";
import {useEffect, useState} from "react";
import {useSelector} from "react-redux";
import {selectCurrentMember} from "@/app/store/slices/authSlice";
import {MemberStatus} from "@/api/type";

const navItems = [
    { icon: Home, label: "Dashboard", href: "/dashboard" },
    { icon: Users, label: "Members", href: "/ManageMembers" },
    { icon: File, label: "Documents", href: "/member/documents" },
    { icon: Settings, label: "Settings", href: "/settings" },
    { icon: Calendar, label: "Activities", href: "/member/activities" },
    { icon: UserRoundCog, label: "Profile", href: "/member/user-profile" },
];

export default function MemberPageLayout({
                                             children,
                                         }: {
    children: React.ReactNode;
}) {
    const [currentNavItems, setCurrentNavItems] = useState(navItems);
    const member = useSelector(selectCurrentMember)
    useEffect(() => {
        if (member && member.status == MemberStatus.SUBSCRIBER && !currentNavItems.find((navItems: any) => navItems.label == "Assemblé Générale")) {
            const newNavItems = [...currentNavItems];
            newNavItems.splice(4, 0,{ icon: Presentation, label: "Assemblé Générale", href: "/member/ag" })
            setCurrentNavItems(newNavItems)
        }
    }, [member])

    return (
        <ProtectedRoute>
            <div className="flex flex-col min-h-screen">
                <HeaderConnected/>
                <div>
                    <AdaptiveLayout
                        navItems={currentNavItems}
                        userType="member"
                        logo="/leaflogo.svg"
                        title="Amaly"
                    >
                        {children}
                    </AdaptiveLayout>
                </div>
            </div>
        </ProtectedRoute>
    );
}
