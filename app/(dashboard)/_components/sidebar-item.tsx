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
              "flex items-center gap-x-3 px-4 py-3 rounded-lg transition-all",
              "text-slate-600 hover:text-sky-700 hover:bg-sky-100",
              isActive && "bg-sky-100 text-sky-800 font-semibold"
          )}
          aria-current={isActive ? "page" : undefined}
      >
        <div
            className={cn(
                "w-1 h-6 rounded-full transition-all",
                isActive ? "bg-sky-700" : "bg-transparent"
            )}
        />
        <Icon size={22} className={cn("text-slate-500", isActive && "text-sky-700")} />
        <span className="text-sm">{label}</span>
      </Link>
  );
};
