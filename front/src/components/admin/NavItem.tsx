import React from "react";
import Link from "next/link";
import clsx from "clsx";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  TooltipProvider,
} from "../ui/tooltip";

interface NavItemProps {
  icon: React.ElementType; // Définissez le type de l'icône comme un composant React
  label: string;
  href: string;
  isCollapsed: boolean;
}

const NavItem: React.FC<NavItemProps> = ({
  icon: Icon,
  label,
  href,
  isCollapsed,
}) => (
  <li>
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Link
            href={href}
            className={clsx("flex items-center p-2 rounded hover:bg-gray-100", {
              "justify-center": isCollapsed,
              "justify-start": !isCollapsed,
            })}
          >
            <Icon className={clsx("h-6 w-6", { "mr-2": !isCollapsed })} />{" "}
            {/* Utilisez le composant Icon */}
            {!isCollapsed && <span>{label}</span>}
          </Link>
        </TooltipTrigger>
        {isCollapsed && <TooltipContent side="right">{label}</TooltipContent>}
      </Tooltip>
    </TooltipProvider>
  </li>
);

export default NavItem;
