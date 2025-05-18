import { auth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

import { db } from '@/lib/db';

/**
 * PATCH Request Handler for Unpublishing a Module in a Course.
 *
 * This function handles PATCH requests to unpublish a module in a course.
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

        const unpublishedModule = await db.module.update({
            data: {
                isPublished: false,
            },
            where: {
                courseId: params.courseId,
                id: params.moduleId,
            }

        });

        const publishedModulesInCourse = await db.module.findMany({
            where: {
                courseId: params.courseId,
                isPublished: true,
            }
        });

        if (!publishedModulesInCourse.length) {
            await db.course.update({
                data: {
                    isPublished: false,
                },
                where: {
                    id: params.courseId,
                }
            });
        }

        return NextResponse.json(unpublishedModule);
    } catch (error) {
        console.log('[MODULE_UNPUBLISH]', error);
        return new NextResponse('Internal Error', { status: 500 });
    }
}