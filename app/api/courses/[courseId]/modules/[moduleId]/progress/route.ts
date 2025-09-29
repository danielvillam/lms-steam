import { auth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

import { db } from '@/lib/db';

/**
 * PUT Request Handler for Updating or Creating User Progress for a Module.
 *
 * This function handles PUT requests to update or create progress data for a user
 * on a specific module of a course.
 */
export async function PUT(
    req: Request,
    props: {
        params: Promise<{ moduleId: string; courseId: string }>;
    }
) {
    try {
        const params = await props.params;
        const { userId } = await auth();
        const { isCompleted } = await req.json();

        if (!userId) {
            return new NextResponse('Unauthorized', { status: 401 });
        }

        const existingUserProgress = await db.userProgress.findFirst({
            where: {
                userId,
                moduleId: params.moduleId,
            },
        });

        // If progress is found, update the existing record
        if (existingUserProgress) {
            const updatedUserProgress = await db.userProgress.update({
                where: {
                    id: existingUserProgress.id,
                },
                data: {
                    isCompleted,
                },
            });
            return NextResponse.json(updatedUserProgress);
        } else {
            // If no progress record exists, create a new one
            const newUserProgress = await db.userProgress.create({
                data: {
                    userId,
                    moduleId: params.moduleId,
                    isCompleted,
                },
            });
            return NextResponse.json(newUserProgress);
        }

    } catch (error) {
        console.log('[MODULE_ID_PROGRESS]', error);
        return new NextResponse('Internal Error', { status: 500 });
    }
}