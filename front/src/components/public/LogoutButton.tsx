"use client";
import React, { use } from "react";
import { LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { authService } from "@/api/services/auth";
import clsx from "clsx";
import {
  TooltipProvider,
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "../ui/tooltip";

interface LogoutButtonProps {
  isCollapsed: boolean;
}

const LogoutButton: React.FC<LogoutButtonProps> = ({ isCollapsed }) => {
  const router = useRouter();

  const handleLogout = async () => {
    await authService.logout();
    router.push("/login");
  };

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            className={clsx("w-full flex items-center hover:bg-primary/20", {
              "justify-center": isCollapsed,
              "justify-start": !isCollapsed,
            })}
            onClick={handleLogout}
          >
            <LogOut className={clsx("h-5 w-6 ", { "mr-2": !isCollapsed })} />{" "}
            {!isCollapsed && "Déconnexion"}
          </Button>
        </TooltipTrigger>
        {isCollapsed && (
          <TooltipContent side="right">Déconnexion</TooltipContent>
        )}
      </Tooltip>
    </TooltipProvider>
  );
};

export default LogoutButton;
