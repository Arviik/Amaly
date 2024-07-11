// app/(protected)/admin/layout.tsx

import MemberLayout from "@/components/members/MemberLayout";
import { ProtectedRoute } from "@/components/public/ProtectedRoute";

export default function MemberPageLayout({
                                            children,
                                        }: {
    children: React.ReactNode;
}) {
    return (
        <ProtectedRoute allowedRoles={["USER"]}>
            <MemberLayout>{children}</MemberLayout>
        </ProtectedRoute>
    );
}
