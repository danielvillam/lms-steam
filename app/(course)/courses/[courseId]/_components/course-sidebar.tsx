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
    const { userId, redirectToSignIn } = await auth();

    if (!userId) return redirectToSignIn();

    const purchase = await db.registration.findFirst({
        where: {
            AND: [
                { userId: userId },
                { courseId: course.id },
            ],
        },
    });

    let previousCompleted = true;
    const isCourseCompleted = progressCount >= 100;

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

                    previousCompleted = isCompleted;

                    return (
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
                })}

                {/* Certificado al completar el curso */}
                {purchase && isCourseCompleted && (
                    <CourseSidebarItem
                        id="certificate"
                        label="Constancia"
                        isCompleted={true}
                        courseId={course.id}
                        isLocked={false}
                    />
                )}
            </div>
        </div>
    );
};

export { CourseSidebar };
