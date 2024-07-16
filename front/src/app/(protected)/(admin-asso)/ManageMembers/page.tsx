import { MemberTable } from "@/components/admin-asso/memberManage/MemberTable";

const MembersPage: React.FC = () => {
  return (
    <div className="m-4">
      <h1 className="text-2xl font-bold mb-4">Members Management</h1>
      <MemberTable />
    </div>
  );
};

export default MembersPage;
