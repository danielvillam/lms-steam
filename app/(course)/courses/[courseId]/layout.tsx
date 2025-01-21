import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';

import { getProgress } from '@/actions/get-progress';
import { db } from '@/lib/db';

import { CourseSidebar } from './_components/course-sidebar';
import { CourseNavbar } from './_components/course-navbar';

interface CourseLayoutProps {
    children: React.ReactNode;
    params: { courseId: string };
}

const CourseLayout = async ({ children, params }: CourseLayoutProps) => {
    const { userId } = await auth();
    const { courseId } = await params;

    if (!userId) {
        return redirect('/');
    }

    const course = await db.course.findUnique({
        where: {
            id: courseId,
        },
        include: {
            chapters: {
                where: {
                    isPublished: true,
                },
                include: {
                    userProgress: {
                        where: {
                            userId,
                        },
                    },
                },
                orderBy: {
                    position: 'asc',
                },
            },
        },
    });

    if (!course) {
        return redirect('/');
    }

    const progressCount = await getProgress(userId, course.id);

    return (
        <div className="h-full">
            <div className="h-[80px] md:pl-80 fixed inset-y-0 w-full z-50">
                <CourseNavbar course={course} progressCount={progressCount} />
            </div>
            <div className="fixed inset-y-0 z-50 flex-col hidden h-full md:flex w-80">
                <CourseSidebar course={course} progressCount={progressCount} />
            </div>
            <main className="md:pl-80 pt-[80px] h-full">{children}</main>
        </div>
    );
};

export default CourseLayout;