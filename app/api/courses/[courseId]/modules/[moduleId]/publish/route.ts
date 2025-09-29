import { auth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

import { db } from '@/lib/db';

/**
 * PATCH Request Handler for Publishing a Module in a Course.
 *
 * This function handles PATCH requests to publish a module in a course.
 */
export async function PATCH(
    req: Request,
    props: {
        params: Promise<{ moduleId: string; courseId: string }>;
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

        const module = await db.module.findUnique({
            where: {
                courseId: params.courseId,
                id: params.moduleId,
            }
        });

        if(!module || !module.title || !module.description || !module.videoUrl) {
            return new NextResponse('Faltan campos obligatorios', { status: 400 });
        }

        const publishedModule = await db.module.update({
            data: {
                isPublished: true,
            },
            where: {
                courseId: params.courseId,
                id: params.moduleId,
            }
        });

        return NextResponse.json(publishedModule);
    } catch (error) {
        console.log('[MODULE_PUBLISH]', error);
        return new NextResponse('Internal Error', { status: 500 });
    }
}