import { Category, Module, Course } from '@prisma/client';

import { db } from '@/lib/db';
import { getProgress } from '@/actions/get-progress';

type CourseWithProgressWithCategory = Course & {
    category: Category;
    modules: Module[];
    progress: number | null;
};

type DashboardCourses = {
    completedCourses: CourseWithProgressWithCategory[];
    coursesInProgress: CourseWithProgressWithCategory[];
};

export const getDashboardCourses = async (
    userId: string
): Promise<DashboardCourses> => {
    try {
        const registeredCourses = await db.registration.findMany({
            where: {
                userId: userId,
            },
            select: {
                course: {
                    include: {
                        category: true,
                        modules: {
                            where: {
                                isPublished: true,
                            },
                        },
                    },
                },
            },
        });

        const courses = registeredCourses.map(
            (registered) => registered.course
        ) as CourseWithProgressWithCategory[];

        for (let course of courses) {
            const progress = await getProgress(userId, course.id);
            course['progress'] = progress;
        }

        const completedCourses = courses.filter(
            (course) => course.progress === 100
        );
        const coursesInProgress = courses.filter(
            (course) => (course.progress ?? 0) < 100
        );

        return {
            completedCourses,
            coursesInProgress,
        };
    } catch (error) {
        console.log('[GET_DASHBOARD_COURSES]', error);
        return {
            completedCourses: [],
            coursesInProgress: [],
        };
    }
};