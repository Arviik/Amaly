"use client";
import React from "react";
import { OrganizationTable } from "@/components/super-admin/Org/OrgTab";

const OrganizationsPage: React.FC = () => {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Organizations Management</h1>
      <OrganizationTable />
    </div>
  );
};

export default OrganizationsPage;
