"use client";
import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import Image from "next/image";
import NavItem, { NavItemProps } from "./NavItem";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { RootState } from "@/app/store";
import { toggleNavbar } from "@/app/store/slices/navbarSlice";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import {
  selectCurrentMember,
  setCurrentMember,
} from "@/app/store/slices/authSlice";
import { Badge } from "@/components/ui/badge";
import SubscriptionModal from "@/components/members/SubscriptionModal";

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
  const currentMember = useSelector(selectCurrentMember);
  const [isSubscriptionModalOpen, setIsSubscriptionModalOpen] = useState(false);

  if (!currentMember) return null;

  const showUpgradeCard =
    userType === "member" && currentMember.status === "VOLUNTEER";

  const specialBadge =
    currentMember.status !== "VOLUNTEER" &&
    (userType === "admin" || userType === "member");
  return (
    <>
      <nav
        className={`hidden md:block fixed top-0 left-0 h-screen bg-background transition-all duration-300 ${
          isMinimized ? "w-16" : "w-60"
        }`}
      >
        <div className="flex items-center justify-between p-4 border-b h-14">
          {!isMinimized && userType === "superAdmin" && (
            <>
              <Image src={logo} alt={title} width={32} height={8} />
              <span className="text-xl font-semibold">{title}</span>
            </>
          )}
          <button
            onClick={() => dispatch(toggleNavbar())}
            className={`${isMinimized ? "mx-auto" : "ml-auto"} mt-1`}
          >
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
        {showUpgradeCard && (
          <div className="p-4 mt-32 ">
            <Card>
              <CardHeader>
                <CardTitle>Become a Subscriber</CardTitle>
                <CardDescription>
                  Be a subscriber and build together.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button
                  size="sm"
                  className="w-full"
                  onClick={() => setIsSubscriptionModalOpen(true)}
                >
                  Join Now
                </Button>
              </CardContent>
            </Card>
          </div>
        )}
        {specialBadge && (
          <div className="flex items-center justify-center p-4 mt-28">
            <Badge variant="outline" className="w-fit ">
              <span className="text-primary">{currentMember.status}</span>
            </Badge>
          </div>
        )}
      </nav>
      <SubscriptionModal
        isOpen={isSubscriptionModalOpen}
        onClose={() => setIsSubscriptionModalOpen(false)}
        organizationId={currentMember.organizationId}
      />
    </>
  );
};

export default UniversalNavbar;
