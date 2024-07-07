"use client";
import React, { createContext, useState, useContext, useCallback } from "react";

export type AdminNavContextType = {
  isOpen: boolean;
  toggleNavbar: () => void;
};

export const AdminNavContext = createContext<AdminNavContextType | undefined>(
  undefined
);

export const AdminNavProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [isOpen, setIsOpen] = useState(true);

  const toggleNavbar = useCallback(() => setIsOpen((prev) => !prev), []);

  return (
    <AdminNavContext.Provider value={{ isOpen, toggleNavbar }}>
      {children}
    </AdminNavContext.Provider>
  );
};

export const useAdminNav = () => {
  const context = useContext(AdminNavContext);
  if (context === undefined) {
    throw new Error("useAdminNav must be used within a AdminNavProvider");
  }
  return context;
};
