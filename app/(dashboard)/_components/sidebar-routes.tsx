  "use client";

  import { Search, List, Contact, BarChart, Newspaper } from "lucide-react";
  import { usePathname } from "next/navigation";
  import { SidebarItem } from "./sidebar-item";
  import { isTeacher } from '@/lib/teacher';
  import { useAuth } from '@clerk/nextjs';

  /**
   * SidebarRoutes Component.
   *
   * This component dynamically renders a list of sidebar items based on the current route (whether the user is a guest or a teacher).
   */
  const guestRoutes = [
    {
      icon: Newspaper,
      label: "Inicio",
      href: "/",
    },
    {
      icon: Search,
      label: "Buscar",
      href: "/search",
    },
    {
      icon: Contact,
      label: "Quienes Somos",
      href: "/about",
    },
  ];

  const authenticatedRoutes = [
    {
      icon: List,
      label: "Cursos",
      href: "/",
    },
    {
      icon: Search,
      label: "Buscar",
      href: "/search",
    },
    {
      icon: Contact,
      label: "Quienes Somos",
      href: "/about",
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
  ];

  export const SidebarRoutes = () => {
    const pathname = usePathname();
    const { userId } = useAuth();

    const isOnTeacherPage = pathname?.includes("/teacher");
    const isUserTeacher = isTeacher(userId);

    let routes;

    if (isOnTeacherPage && isUserTeacher) {
      routes = teacherRoutes;
    } else if (userId) {
      routes = authenticatedRoutes;
    } else {
      routes = guestRoutes;
    }

    return (
      <div className="flex flex-col w-full">
        {routes.map((route) => (
          <SidebarItem
            key={route.href}
            icon={route.icon}
            label={route.label}
            href={route.href}
          />
        ))}
      </div>
    );
  };
