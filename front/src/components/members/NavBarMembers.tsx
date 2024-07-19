import clsx from "clsx";
import {
  ArrowLeftToLine,
  ArrowRightToLine,
  File,
  Home,
  Menu, Presentation,
  Settings, UserRoundCog,
  Users,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import LogoutButton from "../public/LogoutButton";
import { useMemberNav } from "./MemberNavContext";
import NavItem from "../admin-asso/NavItem";

export const navItems = [
  { icon: Home, label: "Dashboard", href: "/dashboard" },
  { icon: Users, label: "Members", href: "/ManageMembers" },
  { icon: File, label: "Documents", href: "/member/documents" },
  { icon: Settings, label: "Settings", href: "/settings" },
  { icon: Presentation, label: "Assemblé Générale", href: "/member/ag" },
  { icon: UserRoundCog, label: "Profile", href: "/user-profile" },
];

const NavBarAdmin: React.FC = () => {
  const { isOpen, toggleNavbar } = useMemberNav();

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
          <Link className="flex items-center space-x-2" href="/">
            {isOpen && (
              <Image
                src="/leaflogo.svg"
                alt="Amaly Logo"
                width={40}
                height={40}
              />
            )}
            {isOpen && <span className="text-xl font-semibold">Amaly</span>}
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

export default NavBarAdmin;
