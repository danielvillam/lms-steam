import { Category, Course } from "@prisma/client";
import { getProgressBatch } from "@/actions/get-progress-batch";
import { db } from "@/lib/db";

type CourseWithProgressWithCategory = Course & {
    category: Category | null;
    modules: { id: string }[];
    progress: number | null;
};

type GetCourses = {
    userId: string;
    title?: string;
    categoryId?: string;
};

export const getCourses = async ({
                                     userId,
                                     title,
                                     categoryId,
                                 }: GetCourses): Promise<CourseWithProgressWithCategory[]> => {
    try {
        const courses = await db.course.findMany({
            where: {
                isPublished: true,
                title: {
                    contains: title,
                    mode: "insensitive" // búsqueda sin distinguir mayúsculas
                },
                categoryId,
            },
            include: {
                category: true,
                modules: {
                    where: { isPublished: true },
                    select: { id: true }
                },
                registered: {
                    where: { userId }
                }
            },
            orderBy: {
                createdAt: "desc",
            }
        });

        const courseIds = courses.map(c => c.id);
        const progressMap = await getProgressBatch(userId, courseIds);

        const coursesWithProgress: CourseWithProgressWithCategory[] = courses.map(course => {
            const progress = course.registered.length > 0 ? progressMap[course.id] ?? 0 : null;
            return {
                ...course,
                progress,
            };
        });

        return coursesWithProgress;
    } catch (error) {
        console.log("[GET_COURSES]", error);
        return [];
    }
};
