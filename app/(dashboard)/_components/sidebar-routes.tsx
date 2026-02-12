"use client";

import {
  Search,
  List,
  Contact,
  BarChart,
  Newspaper,
  Calendar,
  Award,
} from "lucide-react";
import { usePathname } from "next/navigation";
import { SidebarItem } from "./sidebar-item";
import { isTeacher } from "@/lib/teacher";
import { useAuth } from "@clerk/nextjs";
import { SiInstagram } from "react-icons/si";

/**
 * SidebarRoutes Component.
 *
 * This component dynamically renders a list of sidebar items
 * based on the current route (guest, authenticated user, or teacher).
 */

const guestRoutes = [
  {
    icon: Newspaper,
    label: "Inicio",
    href: "/",
  },
  {
    icon: Search,
    label: "Explorar cursos",
    href: "/search",
  },
  {
    icon: Contact,
    label: "Quienes somos",
    href: "/about",
  },
  {
    icon: Calendar,
    label: "Agendate",
    href: "/feed",
  },
];

const authenticatedRoutes = [
  {
    icon: Newspaper,
    label: "Inicio",
    href: "/",
  },
  {
    icon: List,
    label: "Mis cursos",
    href: "/mycourses",
  },
  {
    icon: Search,
    label: "Explorar cursos",
    href: "/search",
  },
  {
    icon: Contact,
    label: "Quienes somos",
    href: "/about",
  },
  {
    icon: Calendar,
    label: "Agendate",
    href: "/feed",
  },
];

const teacherRoutes = [
  {
    icon: List,
    label: "Cursos",
    href: "/teacher/courses",
  },
  {
    icon: BarChart,
    label: "Analítica",
    href: "/teacher/analytics",
  },
  {
    icon: Award,
    label: "Constancias",
    href: "/teacher/certificates",
  },
  {
    icon: Calendar,
    label: "Agendate",
    href: "/teacher/feed",
  },
];

export const SidebarRoutes = () => {
  const pathname = usePathname();
  const { userId, isLoaded } = useAuth();

  if (!isLoaded) {
    return null;
  }

  const isOnTeacherPage = pathname?.includes("/teacher");
  const isUserTeacher = isTeacher(userId);

  const routes =
    isOnTeacherPage && isUserTeacher
      ? teacherRoutes
      : userId
      ? authenticatedRoutes
      : guestRoutes;

  return (
    <div className="flex flex-col justify-between h-full w-full">
      

        <div className="flex flex-col gap-y-1">
        {routes.map((route) => (
          <SidebarItem
            key={route.href}
            icon={route.icon}
            label={route.label}
            href={route.href}
          />
        ))}
      </div>

      {!(isOnTeacherPage && isUserTeacher) && (
        <div className="pt-6 mt-6 border-t">
          <p className="px-4 text-xs text-slate-400 mb-2">
            Síguenos
          </p>

          <SidebarItem
            icon={SiInstagram}
            label="Instagram"
            href="https://www.instagram.com/nachosteam_med/"
            external
          />
        </div>
      )}


    </div>
  );

};