import { auth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

import { db } from '@/lib/db';

export async function PATCH(
    req: Request,
    props: {
        params: Promise<{ chapterId: string; courseId: string }>;
    }
) {
    try {
        const params = await props.params;
        const { userId } = await auth();

        if (!userId) {
            return new NextResponse('Unauthorized', { status: 401 });
        }

        const ownCourse = await db.course.findUnique({
            where: {
                id: params.courseId,
                userId,
            }
        });

        if (!ownCourse) {
            return new NextResponse('Unauthorized', { status: 401 });
        }

        const unpublishedChapter = await db.chapter.update({
            data: {
                isPublished: false,
            },
            where: {
                courseId: params.courseId,
                id: params.chapterId,
            }

        });

        const publishedChaptersInCourse = await db.chapter.findMany({
            where: {
                courseId: params.courseId,
                isPublished: true,
            }
        });

        if (!publishedChaptersInCourse.length) {
            await db.course.update({
                data: {
                    isPublished: false,
                },
                where: {
                    id: params.courseId,
                }
            });
        }

        return NextResponse.json(unpublishedChapter);
    } catch (error) {
        console.log('[CHAPTER_UNPUBLISH]', error);
        return new NextResponse('Internal Error', { status: 500 });
    }
}