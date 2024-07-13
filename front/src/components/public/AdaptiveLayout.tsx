import React from "react";
import clsx from "clsx";
import UniversalNavbar, { NavItemType } from "../common/UniversalNavbar";
import { useNavbar } from "@/hooks/useNavbar";

interface AdaptiveLayoutProps {
  children: React.ReactNode;
  navItems: NavItemType[];
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
  const { isOpen, toggleNavbar } = useNavbar();

  return (
    <div className="flex min-h-screen bg-gray-100">
      <UniversalNavbar
        isOpen={isOpen}
        toggleNavbar={toggleNavbar}
        navItems={navItems}
        userType={userType}
        logo={logo}
        title={title}
      />
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

export default AdaptiveLayout;
