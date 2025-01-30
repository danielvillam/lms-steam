import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';

import { getProgress } from '@/actions/get-progress';
import { db } from '@/lib/db';

import { CourseSidebar } from './_components/course-sidebar';
import { CourseNavbar } from './_components/course-navbar';

export default async function CourseLayout(
    props: {
        params: Promise<{ courseId: string }>;
        children: React.ReactNode;
    }
) {
    const params = await props.params;
    const { userId, redirectToSignIn } = await auth()

    if (!userId) return redirectToSignIn()

    const course = await db.course.findUnique({
        where: {
            id: params.courseId,
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
            <main className="md:pl-80 pt-[80px] h-full">{props.children}</main>
        </div>
    );
};