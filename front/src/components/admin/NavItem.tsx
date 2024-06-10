import React from "react";
import Link from "next/link";
import clsx from "clsx";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  TooltipProvider,
} from "../ui/tooltip";
import { usePathname } from "next/navigation";

interface NavItemProps {
  icon: React.ElementType;
  label: string;
  href: string;
  isCollapsed: boolean;
}

function NavItem({
  icon: Icon,
  label,
  href,
  isCollapsed,
}: NavItemProps): JSX.Element {
  const currentPath = usePathname();
  return (
    <li>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Link
              href={href}
              className={clsx(
                "flex items-center p-2 rounded hover:bg-primary/20",
                {
                  "justify-center": isCollapsed,
                  "justify-start": !isCollapsed,
                },
                {
                  "text-primary": currentPath === href,
                }
              )}
            >
              <Icon className={clsx("h-8 w-6", { "mr-2": !isCollapsed })} />{" "}
              {!isCollapsed && <span>{label}</span>}
            </Link>
          </TooltipTrigger>
          {isCollapsed && <TooltipContent side="right">{label}</TooltipContent>}
        </Tooltip>
      </TooltipProvider>
    </li>
  );
}

export default NavItem;
