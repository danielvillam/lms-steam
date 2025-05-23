import { db } from "@/lib/db";

export const getProgressBatch = async (userId: string, courseIds: string[]) => {
    const progressMap: Record<string, number> = {};

    const userModules = await db.userProgress.findMany({
        where: {
            userId,
            module: {
                courseId: { in: courseIds }
            },
        },
        select: {
            isCompleted: true,
            module: {
                select: {
                    courseId: true
                }
            }
        }
    });

    const modulesPerCourse = await db.module.groupBy({
        by: ['courseId'],
        where: {
            courseId: { in: courseIds },
            isPublished: true
        },
        _count: true
    });

    // Build map of completed modules per course
    const completedByCourse: Record<string, number> = {};
    for (const item of userModules) {
        const courseId = item.module.courseId;
        if (item.isCompleted) {
            completedByCourse[courseId] = (completedByCourse[courseId] || 0) + 1;
        }
    }

    for (const item of modulesPerCourse) {
        const courseId = item.courseId;
        const total = item._count;
        const completed = completedByCourse[courseId] || 0;
        const progress = total > 0 ? (completed / total) * 100 : 0;
        progressMap[courseId] = progress;
    }

    return progressMap;
};
