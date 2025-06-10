import { Module, Course, UserProgress } from '@prisma/client';

import { db } from '@/lib/db';
import { auth } from '@clerk/nextjs/server';
import { CourseProgress } from '@/components/course-progress';
import { CourseSidebarItem } from './course-sidebar-item';
import { ModuleEvaluationItem } from './module-evaluation-item';

interface CourseSidebarProps {
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
 * Sidebar component for displaying course details and modules.
 */
const CourseSidebar = async ({
    course,
    progressCount
}: CourseSidebarProps) => {
    const { userId, redirectToSignIn } = await auth()

    if (!userId) return redirectToSignIn()

    // Check if the user has purchased the course
    const purchase = await db.registration.findFirst({
        where: {
            AND: [
                { userId: userId },
                { courseId: course.id },
            ],
        },
    });

    return (
        <div className="flex flex-col h-full overflow-y-auto border-r shadow-sm">
            <div className="flex flex-col p-8 border-b">
                <h1 className="font-semibold">{course.title}</h1>
                {purchase && (
                    <div className="mt-10">
                        <CourseProgress variant="success" value={progressCount} />
                    </div>
                )}
            </div>
            <div className="flex flex-col w-full">
                {course.modules.map((item) => (
                    <div key={item.id}>
                        <CourseSidebarItem
                            id={item.id}
                            label={item.title}
                            isCompleted={!!item.userProgress?.[0]?.isCompleted}
                            courseId={course.id}
                            isLocked={!item.isEnabled && !purchase}
                        />
                        {item.evaluation?.isPublished && (
                            <ModuleEvaluationItem
                                courseId={course.id}
                                moduleId={item.id}
                                evaluationId={item.evaluation.id}
                                isModuleCompleted={!!item.userProgress?.[0]?.isCompleted}
                            />
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export { CourseSidebar };