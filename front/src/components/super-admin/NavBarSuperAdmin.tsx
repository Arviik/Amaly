import clsx from "clsx";
import {
  ArrowLeftToLine,
  ArrowRightToLine,
  Home,
  Users,
  Building,
  Settings,
  Menu,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import LogoutButton from "../public/LogoutButton";
import NavItem from "../admin-asso/NavItem";
import { useSuperAdminNav } from "./SuperAdminNavContext";

export const navItems = [
  { icon: Home, label: "Overview", href: "/admin/overview" },
  { icon: Building, label: "Organizations", href: "/admin/organizations" },
  { icon: Users, label: "Users", href: "/admin/users" },
  { icon: Settings, label: "Settings", href: "/admin/settings" },
];

const NavBarSuperAdmin: React.FC = () => {
  const { isOpen, toggleNavbar } = useSuperAdminNav();

  return (
    <div
      className={clsx("fixed top-0 h-full bg-white transition-width", {
        "w-64": isOpen,
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
          <Link className="flex items-center space-x-2" href="/admin/overview">
            {isOpen && (
              <Image
                src="/leaflogo.svg"
                alt="Amaly Logo"
                width={40}
                height={40}
              />
            )}
            {isOpen && (
              <span className="text-xl font-semibold">Amaly Admin</span>
            )}
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
      <div className="flex justify-items-end ">
        <LogoutButton isCollapsed={!isOpen} />
      </div>
    </div>
  );
};

export default NavBarSuperAdmin;
