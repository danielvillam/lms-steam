"use client";

import { LucideIcon } from "lucide-react";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils";
import React from 'react';
import Link from 'next/link';

/**
 * SidebarItem Component.
 *
 * This component represents a single item in the sidebar navigation.
 */
interface SidebarItemProps {
  icon: LucideIcon;
  label: string;
  href: string;
}

export const SidebarItem = ({ icon: Icon, label, href }: SidebarItemProps) => {
  const pathname = usePathname();

  const isActive = React.useMemo(
      () =>
          pathname === href ||
          pathname?.startsWith(`${href}/`) ||
          (pathname === "/" && href === "/"),
      [pathname, href]
  );

    return (
        <Link
            href={href}
            className={cn(
                "flex items-center gap-x-3 px-4 py-2.5 rounded-xl transition-all group",
                "text-slate-600 hover:text-sky-600 hover:bg-sky-50/70",
                isActive && "bg-sky-50 text-sky-600 font-medium"
            )}
            aria-current={isActive ? "page" : undefined}
        >
            <div className={cn(
                "p-2 rounded-lg transition-all group-hover:bg-white",
                isActive ? "bg-white shadow-xs" : "bg-transparent"
            )}>
                <Icon size={20} className={cn(
                    "transition-transform group-hover:scale-[1.05]",
                    isActive ? "text-sky-600" : "text-slate-500"
                )} />
            </div>

            <span className="text-sm font-medium transition-all duration-300">
        {label}
      </span>
        </Link>
    );
};
