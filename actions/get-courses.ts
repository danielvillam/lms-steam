import { Category, Course } from "@prisma/client";

import { getProgress } from "@/actions/get-progress";
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
}

export const getCourses = async ({
    userId,
    title,
    categoryId
}: GetCourses): Promise<CourseWithProgressWithCategory[]> => {
    try {
        const courses = await db.course.findMany({
            where: {
                isPublished: true,
                title: {
                    contains: title,
                },
                categoryId,
            },
            include: {
                category: true,
                modules: {
                    where: {
                        isPublished: true,
                    },
                    select: {
                        id: true,
                    }
                },
                registered: {
                    where: {
                        userId,
                    }
                }
            },
            orderBy: {
                createdAt: "desc",
            }
        });

        const coursesWithProgress: CourseWithProgressWithCategory[] = await
            Promise.all(
                courses.map(async course => {
                    if(course.registered.length === 0) {
                        return {
                            ...course,
                            progress: null,
                        }
                    }

                const progressPercentage = await getProgress(userId, course.id);

                return {
                    ...course,
                    progress: progressPercentage,
                };
            })
        );
        return coursesWithProgress;
    } catch (error) {
        console.log("[GET_PROGRESS]", error);
        return [];
    }
}