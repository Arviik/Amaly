"use client";
import React from "react";
import { AdminNavProvider, useAdminNav } from "../admin-asso/AdminNavContext";
import NavBarAdmin from "../admin-asso/NavBarAdmin";
import clsx from "clsx";

const AdminLayoutContent: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { isOpen } = useAdminNav();

  return (
    <div className="flex min-h-screen bg-gray-100">
      <NavBarAdmin />
      <main
        className={clsx("flex-1 transition-all duration-300 ease-in-out", {
          "lg:ml-64": isOpen,
          "lg:ml-16": !isOpen,
        })}
      >
        <div className="container mx-auto px-4 py-8">{children}</div>
      </main>
    </div>
  );
};

const AdminLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <AdminNavProvider>
      <AdminLayoutContent>{children}</AdminLayoutContent>
    </AdminNavProvider>
  );
};

export default AdminLayout;
