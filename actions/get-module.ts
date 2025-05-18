import { db } from '@/lib/db';
import { Attachment, Module } from '@prisma/client';

interface GetModuleProps {
    userId: string;
    moduleId: string;
    courseId: string;
}

export const getModule = async ({
                                     moduleId,
                                     courseId,
                                     userId,
                                 }: GetModuleProps) => {
    try {
        const registration = await db.registration.findFirst({
            where: {
                AND: [
                    { userId: userId },
                    { courseId: courseId },
                ],
            },
        });

        const course = await db.course.findUnique({
            where: {
                id: courseId,
                isPublished: true,
            },
        });

        const module = await db.module.findUnique({
            where: {
                id: moduleId,
                isPublished: true,
            },
        });

        if (!module || !course) {
            throw new Error('Module or course not found');
        }

        let attachments: Attachment[] = [];
        let nextModule: Module | null = null;

        if (registration) {
            attachments = await db.attachment.findMany({
                where: {
                    courseId,
                },
            });
        }

        if (module.isEnabled || registration) {
            nextModule = await db.module.findFirst({
                where: {
                    courseId,
                    isPublished: true,
                    position: {
                        gt: module.position,
                    },
                },
                orderBy: {
                    position: 'asc',
                },
            });
        }
        const userProgress = await db.userProgress.findFirst({
            where: {
                AND: [
                    { userId: userId },
                    { moduleId: moduleId },
                ],
            },
        });

        return {
            module,
            course,
            attachments,
            nextModule,
            userProgress,
            registration,
        };
    } catch (error) {
        console.log('[GET_MODULE_ERROR]', error);
        return {
            module: null,
            course: null,
            attachments: [],
            nextModule: null,
            userProgress: null,
            registration: null,
        };
    }
};