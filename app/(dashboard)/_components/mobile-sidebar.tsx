import { Menu } from "lucide-react";

import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Sidebar } from "./sidebar";
import { VisuallyHidden } from '@radix-ui/react-visually-hidden';

/**
 * Mobile Sidebar Component.
 *
 * This component renders a sidebar navigation menu for mobile devices.
 */
export const MobileSidebar = () => {
    return (
        <Sheet>
            <SheetTrigger className="md:hidden pr-4 hover:opacity-75 transition">
                <Menu />
            </SheetTrigger>
            <SheetContent
                side="left"
                className="p-0 bg-white w-[260px]"
            >
                <SheetHeader>
                    <SheetTitle>
                        <VisuallyHidden>Menú del aplicativo</VisuallyHidden>
                    </SheetTitle>
                </SheetHeader>
                <Sidebar />
            </SheetContent>
        </Sheet>
    );
};