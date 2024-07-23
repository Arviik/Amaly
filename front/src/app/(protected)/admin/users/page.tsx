import React from "react";
import { UserTable } from "@/components/super-admin/UserTable";

const UsersPage: React.FC = () => {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Users management</h1>
      <UserTable />
    </div>
  );
};

export default UsersPage;
