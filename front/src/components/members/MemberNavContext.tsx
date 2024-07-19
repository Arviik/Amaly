"use client";
import React, { createContext, useState, useContext, useCallback } from "react";

export type MemberNavContextType = {
  isOpen: boolean;
  toggleNavbar: () => void;
};

export const MemberNavContext = createContext<MemberNavContextType | undefined>(
  undefined
);

export const MemberNavProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [isOpen, setIsOpen] = useState(true);

  const toggleNavbar = useCallback(() => setIsOpen((prev) => !prev), []);

  return (
    <MemberNavContext.Provider value={{ isOpen, toggleNavbar }}>
      {children}
    </MemberNavContext.Provider>
  );
};

export const useMemberNav = () => {
  const context = useContext(MemberNavContext);
  if (context === undefined) {
    throw new Error("useMemberNav must be used within a MemberNavProvider");
  }
  return context;
};
