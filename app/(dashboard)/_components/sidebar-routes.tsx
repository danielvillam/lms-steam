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
      label: "Explorar cursos",
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
    const { userId, isLoaded } = useAuth();

    if (!isLoaded) {
      return null;
    }

    const isOnTeacherPage = pathname?.includes("/teacher");
    const isUserTeacher = isTeacher(userId);

  let routes = isOnTeacherPage && isUserTeacher ? teacherRoutes
      : userId ? authenticatedRoutes
          : guestRoutes;

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
