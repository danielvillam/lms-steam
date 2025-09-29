import { Category, Course } from '@prisma/client';

import { db } from '@/lib/db';

type CourseWithCategory = Course & {
    category: Category | null;
    modules: { id: string }[];
};

type GetCourses = {
    title?: string;
    categoryId?: string;
}

export const getAllCourses = async ({
                                        title,
                                        categoryId
                                    }: GetCourses): Promise<CourseWithCategory[]> => {
    try {
        return await db.course.findMany({
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
            },
            orderBy: {
                createdAt: "desc",
            }
        });
    } catch (error) {
        console.log("[GET_COURSES]", error);
        return [];
    }
}