"use client";
import React from "react";
import { MemberNavProvider, useMemberNav } from "./MemberNavContext";
import NavBarMember from "./NavBarMembers";
import clsx from "clsx";

const MemberLayoutContent: React.FC<{ children: React.ReactNode }> = ({
                                                                         children,
                                                                     }) => {
    const { isOpen } = useMemberNav();

    return (
        <div className="flex min-h-screen bg-gray-100">
            <NavBarMember />
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

const MemberLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    return (
        <MemberNavProvider>
            <MemberLayoutContent>{children}</MemberLayoutContent>
        </MemberNavProvider>
    );
};

export default MemberLayout;
