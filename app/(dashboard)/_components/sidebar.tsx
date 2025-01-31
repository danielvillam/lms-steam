import { Logo } from "./logo";
import { SidebarRoutes } from "./sidebar-routes";

/**
 * Sidebar Component.
 *
 * This component renders the sidebar navigation for the application.
 */
export const Sidebar = () => {
  return (
    <div className="h-full border-r flex flex-col overflow-y-auto bg-white shadow-sm">
      <div className="p-6">
        <Logo />
      </div>
      <div className="flex flex-col w-full">
        <SidebarRoutes />
      </div>
    </div>
  );
};
