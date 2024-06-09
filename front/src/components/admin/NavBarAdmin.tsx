import React, { useState } from "react";
import Link from "next/link";
import { Home, Users, File, Settings, Menu } from "lucide-react";
import Image from "next/image";
import clsx from "clsx";
import NavItem from "./NavItem";

const NavBarAdmin: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);

  const toggleNavbar = () => setIsOpen(!isOpen);
  const toggleCollapse = () => setIsCollapsed(!isCollapsed);

  return (
    <>
      <button
        onClick={toggleNavbar}
        className="sm:hidden fixed top-4 left-4 z-50"
      >
        <Menu className="h-6 w-6" />
      </button>
      <aside
        className={clsx(
          "fixed inset-y-0 left-0 z-30 flex flex-col bg-white shadow-lg transform transition-transform duration-300 ease-in-out",
          {
            "translate-x-0": isOpen || !isCollapsed,
            "-translate-x-full": !isOpen && isCollapsed,
            "w-64": !isCollapsed,
            "w-14": isCollapsed,
          },
          "sm:translate-x-0"
        )}
      >
        <div className="flex items-center justify-between p-4 border-b">
          <Link className="flex items-center space-x-2" href="/">
            <Image
              src="/leaflogo.svg"
              alt="Amaly Logo"
              width={50}
              height={50}
            />
            {!isCollapsed && (
              <span className="text-xl font-semibold">Amaly</span>
            )}
          </Link>
          <button onClick={toggleCollapse} className="hidden sm:block">
            <Menu className="h-6 w-6" />
          </button>
        </div>
        <nav className="flex-1 overflow-y-auto">
          <ul className="p-4">
            <NavItem
              icon={Home}
              label="Dashboard"
              href="/dashboard"
              isCollapsed={isCollapsed}
            />
            <NavItem
              icon={Users}
              label="Members"
              href="/members"
              isCollapsed={isCollapsed}
            />
            <NavItem
              icon={File}
              label="Documents"
              href="/documents"
              isCollapsed={isCollapsed}
            />
          </ul>
        </nav>
        <div className="p-4 border-t">
          <NavItem
            icon={Settings}
            label="Settings"
            href="/settings"
            isCollapsed={isCollapsed}
          />
        </div>
      </aside>
    </>
  );
};

export default NavBarAdmin;
