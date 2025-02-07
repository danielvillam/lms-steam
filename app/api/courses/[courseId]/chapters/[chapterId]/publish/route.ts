import { auth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

import { db } from '@/lib/db';

/**
 * PATCH Request Handler for Publishing a Chapter in a Course.
 *
 * This function handles PATCH requests to publish a chapter in a course.
 */
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

        const chapter = await db.chapter.findUnique({
            where: {
                courseId: params.courseId,
                id: params.chapterId,
            }
        });

        /**S
        const muxData = await db.muxData.findUnique({
            where: {
                chapterId: params.chapterId,
            }
        });
        */

        if(!chapter || !chapter.title || !chapter.description || !chapter.videoUrl) {
            return new NextResponse('Faltan campos obligatorios', { status: 400 });
        }

        const publishedChapter = await db.chapter.update({
            data: {
                isPublished: true,
            },
            where: {
                courseId: params.courseId,
                id: params.chapterId,
            }
        });

        return NextResponse.json(publishedChapter);
    } catch (error) {
        console.log('[CHAPTER_PUBLISH]', error);
        return new NextResponse('Internal Error', { status: 500 });
    }
}