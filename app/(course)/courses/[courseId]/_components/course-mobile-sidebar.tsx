import { Module, Course, UserProgress } from '@prisma/client';
import { Menu } from 'lucide-react';

import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { CourseSidebar } from './course-sidebar';
import { VisuallyHidden } from '@radix-ui/react-visually-hidden';

interface CourseMobileSidebarProps {
    course: Course & {
        modules: (Module & {
            userProgress: UserProgress[] | null;
            evaluation: {
                id: string;
                isPublished: boolean;
            } | null;
        })[];
    };
    progressCount: number;
}

/**
 * Mobile sidebar for course navigation.
 */

const CourseMobileSidebar = ({
                                 course,
                                 progressCount,
                             }: CourseMobileSidebarProps) => {
    return (
        <Sheet>
            <SheetTrigger className="pr-4 transition md:hidden hover:opacity-75">
                <Menu />
            </SheetTrigger>
            <SheetContent side="left" className="p-0 bg-white w-72">
                <SheetHeader>
                    <SheetTitle>
                        <VisuallyHidden>Menú del curso</VisuallyHidden>
                    </SheetTitle>
                </SheetHeader>
                <CourseSidebar course={course} progressCount={progressCount} />
            </SheetContent>
        </Sheet>
    );
};

export { CourseMobileSidebar };