"use client";
import React, { createContext, useState, useContext, useCallback } from "react";

export type SuperAdminNavContextType = {
  isOpen: boolean;
  toggleNavbar: () => void;
};

export const SuperAdminNavContext = createContext<
  SuperAdminNavContextType | undefined
>(undefined);

export const SuperAdminNavProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [isOpen, setIsOpen] = useState(true);

  const toggleNavbar = useCallback(() => setIsOpen((prev) => !prev), []);

  return (
    <SuperAdminNavContext.Provider value={{ isOpen, toggleNavbar }}>
      {children}
    </SuperAdminNavContext.Provider>
  );
};

export const useSuperAdminNav = () => {
  const context = useContext(SuperAdminNavContext);
  if (context === undefined) {
    throw new Error(
      "useSuperAdminNav must be used within a SuperAdminNavProvider"
    );
  }
  return context;
};
