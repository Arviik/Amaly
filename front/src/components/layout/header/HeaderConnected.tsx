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
  const isMinimized = useSelector(
    (state: RootState) => state.navbar.isMinimized
  );
  return (
    <header className="fixed left-0 right-0 top-0 z-20 border-b bg-background/95 backdrop-blur ">
      <nav className="flex h-14 items-center justify-between px-4 lg:px-8">
        <div className="flex items-center space-x-4 sm:right-40">
          {!userType && <ComboBox />}
          {userType && <p>Amaly Admin</p>}
        </div>
        <div className="flex items-center gap-4">
          <UserNav />
          <ThemeToggle />
        </div>
      </nav>
    </header>
  );
};

export default HeaderConnected;
