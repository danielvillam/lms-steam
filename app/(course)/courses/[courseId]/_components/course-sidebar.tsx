import { Module, Course, UserProgress, EvaluationType } from '@prisma/client';

import { db } from '@/lib/db';
import { auth } from '@clerk/nextjs/server';
import { CourseProgress } from '@/components/course-progress';
import { CourseSidebarItem } from './course-sidebar-item';
import { CourseEvaluationItem } from './course-evaluation-item';

interface CourseSidebarProps {
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

    let previousCompleted = true; // El primer módulo está habilitado por defecto

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
                {course.modules.map((item) => {
                    const isCompleted = !!item.userProgress?.[0]?.isCompleted;
                    const isUnlocked = previousCompleted && purchase;

                    const moduleComponent = (
                        <div key={item.id}>
                            <CourseSidebarItem
                                id={item.id}
                                label={item.title}
                                isCompleted={isCompleted}
                                courseId={course.id}
                                isLocked={!isUnlocked}
                            />
                            {item.evaluation?.isPublished && isUnlocked && (
                                <CourseEvaluationItem
                                    courseId={course.id}
                                    moduleId={item.id}
                                    evaluationId={item.evaluation.id}
                                    isLocked={!isUnlocked}
                                    type={item.evaluation.type}
                                />

                            )}
                        </div>
                    );

                    // Update the status for the next module
                    previousCompleted = isCompleted;

                    return moduleComponent;
                })}
            </div>
        </div>
    );
};

export { CourseSidebar };