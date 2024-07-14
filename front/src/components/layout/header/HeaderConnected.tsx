"use client";
import React from "react";
import { UserNav } from "./UserNav";
import { ComboBox } from "./ComboBox";
import ThemeToggle from "./theme-toggle";
import { RootState } from "@/app/store";
import { useSelector } from "react-redux";

const HeaderConnected: React.FC = () => {
  const userType = useSelector(
    (state: RootState) => state.auth.user?.isSuperAdmin
  );
  return (
    <header className="supports-backdrop-blur:bg-background/60 fixed left-0 right-0 top-0 z-20 border-b bg-background/95 backdrop-blur">
      <nav className="flex h-14 items-center justify-between px-4">
        <div className="flex items-center space-x-4">
          {!userType && <ComboBox />}
        </div>
        <div className="flex items-center gap-2">
          <UserNav />
          <ThemeToggle />
        </div>
      </nav>
    </header>
  );
};

export default HeaderConnected;
