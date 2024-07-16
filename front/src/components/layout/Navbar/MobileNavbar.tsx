"use client";
import React, { useState } from "react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu } from "lucide-react";
import NavItem, { NavItemProps } from "./NavItem";
import { useRouter } from "next/navigation";

interface MobileNavbarProps {
  navItems: NavItemProps[];
  title: string;
}

const MobileNavbar: React.FC<MobileNavbarProps> = ({ navItems, title }) => {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  const handleNavigation = (href: string) => {
    setIsOpen(false);
    router.push(href);
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <button className="fixed top-3 z-50 md:hidden p-2">
          <Menu />
        </button>
      </SheetTrigger>
      <SheetContent side="left" className="w-[300px] sm:w-[400px]">
        <h2 className="text-lg font-semibold mb-4">{title}</h2>
        <nav>
          <ul>
            {navItems.map((item) => (
              <NavItem
                key={item.href}
                icon={item.icon}
                label={item.label}
                href={item.href}
                isCollapsed={false}
                setOpen={setIsOpen}
              />
            ))}
          </ul>
        </nav>
      </SheetContent>
    </Sheet>
  );
};

export default MobileNavbar;
