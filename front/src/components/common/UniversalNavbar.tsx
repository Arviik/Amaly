import React from "react";
import { ArrowLeftToLine, ArrowRightToLine, Menu } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import clsx from "clsx";
import { LucideIcon } from "lucide-react";
import LogoutButton from "../public/LogoutButton";
import NavItem from "./NavItem";

export interface NavItemType {
  icon: LucideIcon;
  label: string;
  href: string;
}

interface UniversalNavbarProps {
  isOpen: boolean;
  toggleNavbar: () => void;
  navItems: NavItemType[];
  userType: "superAdmin" | "admin" | "member";
  logo: string;
  title: string;
}

const UniversalNavbar: React.FC<UniversalNavbarProps> = ({
  isOpen,
  toggleNavbar,
  navItems,
  userType,
  logo,
  title,
}) => {
  return (
    <div
      className={clsx("fixed top-0 h-full bg-white ", {
        "w-60": isOpen,
        "w-16": !isOpen,
      })}
    >
      <button
        onClick={toggleNavbar}
        className="fixed top-4 left-4 z-50 lg:hidden"
      >
        <Menu className="h-6 w-6" />
      </button>
      <aside>
        <div className="flex items-center justify-between p-4 border-b">
          <Link
            className="flex items-center space-x-2"
            href={`/${
              userType === "superAdmin" ? "admin/overview" : "dashboard"
            }`}
          >
            {isOpen && (
              <Image src={logo} alt="Amaly Logo" width={40} height={40} />
            )}
            {isOpen && <span className="text-xl font-semibold">{title}</span>}
          </Link>
          <button onClick={toggleNavbar} className="hidden lg:block">
            {isOpen ? (
              <ArrowLeftToLine className="h-5 w-5" />
            ) : (
              <ArrowRightToLine className="h-5 w-5" />
            )}
          </button>
        </div>
        <nav className="flex-1 overflow-y-auto">
          <ul className="p-4">
            {navItems.map((item) => (
              <NavItem
                key={item.href}
                icon={item.icon}
                label={item.label}
                href={item.href}
                isCollapsed={!isOpen}
              />
            ))}
          </ul>
        </nav>
      </aside>
      <div className="flex justify-items-end">
        <LogoutButton isCollapsed={!isOpen} />
      </div>
    </div>
  );
};

export default UniversalNavbar;
