import { db } from '@/lib/db';
import { Attachment, Chapter } from '@prisma/client';

interface GetChapterProps {
    userId: string;
    chapterId: string;
    courseId: string;
}

export const getChapter = async ({
                                     chapterId,
                                     courseId,
                                     userId,
                                 }: GetChapterProps) => {
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

        const chapter = await db.chapter.findUnique({
            where: {
                id: chapterId,
                isPublished: true,
            },
        });

        if (!chapter || !course) {
            throw new Error('Chapter or course not found');
        }

        let attachments: Attachment[] = [];
        let nextChapter: Chapter | null = null;

        if (registration) {
            attachments = await db.attachment.findMany({
                where: {
                    courseId,
                },
            });
        }

        if (chapter.isEnabled || registration) {
            nextChapter = await db.chapter.findFirst({
                where: {
                    courseId,
                    isPublished: true,
                    position: {
                        gt: chapter.position,
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
                    { chapterId: chapterId },
                ],
            },
        });

        return {
            chapter,
            course,
            attachments,
            nextChapter,
            userProgress,
            registration,
        };
    } catch (error) {
        console.log('[GET_CHAPTER_ERROR]', error);
        return {
            chapter: null,
            course: null,
            attachments: [],
            nextChapter: null,
            userProgress: null,
            registration: null,
        };
    }
};