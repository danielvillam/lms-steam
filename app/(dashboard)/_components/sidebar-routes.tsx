  "use client";

  import { Search, List, Contact, BarChart, Text } from "lucide-react";
  import { usePathname } from "next/navigation";
  import { SidebarItem } from "./sidebar-item";

  /**
   * SidebarRoutes Component.
   *
   * This component dynamically renders a list of sidebar items based on the current route (whether the user is a guest or a teacher).
   */
  const guestRoutes = [
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
      href: "/aboutus",
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
      icon: Text,
      label: "Prestamos",
      href: "/teacher/pres",
    },
  ];

  export const SidebarRoutes = () => {
    const pathname = usePathname();

    const isTeacherPage = pathname?.includes("/teacher");

    const routes = isTeacherPage ? teacherRoutes : guestRoutes;

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
