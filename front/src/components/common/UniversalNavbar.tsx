"use client";
import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import Image from "next/image";
import NavItem, { NavItemProps } from "./NavItem";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { RootState } from "@/app/store";
import { toggleNavbar } from "@/app/store/slices/navbarSlice";

interface UniversalNavbarProps {
  navItems: NavItemProps[];
  userType: "superAdmin" | "admin" | "member";
  logo: string;
  title: string;
}

const UniversalNavbar: React.FC<UniversalNavbarProps> = ({
  navItems,
  userType,
  logo,
  title,
}) => {
  const dispatch = useDispatch();
  const isMinimized = useSelector(
    (state: RootState) => state.navbar.isMinimized
  );

  return (
    <nav
      className={`hidden md:block fixed top-0 left-0 h-screen bg-white transition-all duration-300 ${
        isMinimized ? "w-16" : "w-50"
      }`}
    >
      <div className="flex items-center justify-between p-4 border-b">
        {!isMinimized && (
          <>
            <Image src={logo} alt={title} width={32} height={8} />
            <span className="text-xl font-semibold">{title}</span>
          </>
        )}
        <button onClick={() => dispatch(toggleNavbar())}>
          {isMinimized ? <ChevronRight /> : <ChevronLeft />}
        </button>
      </div>
      <ul className="mt-4">
        {navItems.map((item) => (
          <NavItem
            key={item.href}
            icon={item.icon}
            label={item.label}
            href={item.href}
            isCollapsed={isMinimized}
          />
        ))}
      </ul>
    </nav>
  );
};

export default UniversalNavbar;
