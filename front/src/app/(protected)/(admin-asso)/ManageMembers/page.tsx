"use client";
import MembersList from "@/components/admin-asso/memberManage/MemberList";

const MembersPage: React.FC = () => {
  return (
    <div className="m-4">
      <h1>Gestion des membres</h1>
      <MembersList />
    </div>
  );
};

export default MembersPage;
