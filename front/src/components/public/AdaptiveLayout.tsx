"use client";
import React from "react";
import { useSelector } from "react-redux";
import UniversalNavbar from "../common/UniversalNavbar";
import MobileNavbar from "../common/MobileNavbar";
import { NavItemProps } from "../common/NavItem";
import { RootState } from "@/app/store";

interface AdaptiveLayoutProps {
  children: React.ReactNode;
  navItems: NavItemProps[];
  userType: "superAdmin" | "admin" | "member";
  logo: string;
  title: string;
}

const AdaptiveLayout: React.FC<AdaptiveLayoutProps> = ({
  children,
  navItems,
  userType,
  logo,
  title,
}) => {
  const isMinimized = useSelector(
    (state: RootState) => state.navbar.isMinimized
  );

  return (
    <div className="flex min-h-screen bg-gray-100">
      <UniversalNavbar
        navItems={navItems}
        userType={userType}
        logo={logo}
        title={title}
      />
      <MobileNavbar navItems={navItems} title={title} />
      <main
        className={`flex-1 transition-all duration-300 ease-in-out ${
          isMinimized ? "md:ml-16" : "md:ml-64"
        }`}
      >
        <div className="container mx-auto px-4 py-8">{children}</div>
      </main>
    </div>
  );
};

export default AdaptiveLayout;
