// app/(protected)/admin/layout.tsx

import MemberLayout from "@/components/members/MemberLayout";
import { ProtectedRoute } from "@/components/public/ProtectedRoute";
import Chatbot from "@/components/public/chatbot/Chatbot";
export default function MemberPageLayout({
                                            children,
                                        }: {
    children: React.ReactNode;
}) {
    return (
        <ProtectedRoute>
            <MemberLayout>{children}<Chatbot></Chatbot></MemberLayout>
        </ProtectedRoute>
    );
}
