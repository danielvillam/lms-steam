import { Module, Course, UserProgress, EvaluationType } from '@prisma/client';

import { NavbarRoutes } from '@/components/navbar-routes';
import { CourseMobileSidebar } from './course-mobile-sidebar';

interface CourseNavbarProps {
    course: Course & {
        modules: (Module & {
            userProgress: UserProgress[] | null;
            evaluation: {
                id: string;
                isPublished: boolean;
                type: EvaluationType;
            } | null;
        })[];
    };
    progressCount: number;
}

/**
 * Navbar component for the course page.
 */
const CourseNavbar = ({ course, progressCount }: CourseNavbarProps) => {
    return (
        <div className="flex items-center h-full p-4 bg-white border-b shadow-sm">
            <CourseMobileSidebar course={course} progressCount={progressCount} />
            <NavbarRoutes />
        </div>
    );
};

export { CourseNavbar };