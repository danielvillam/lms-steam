import { Logo } from "./logo";
import { SidebarRoutes } from "./sidebar-routes";

/**
 * Sidebar Component.
 *
 * This component renders the sidebar navigation for the application.
 */
export const Sidebar = () => {
    return (
        <div className="h-full flex flex-col bg-white shadow-sm border-r">
            <div className="p-4">
                <Logo />
            </div>
            <div className="flex flex-col w-full py-1">
                <SidebarRoutes />
            </div>
        </div>
    );
};
