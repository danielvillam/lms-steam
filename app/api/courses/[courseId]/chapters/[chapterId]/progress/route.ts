import { auth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

import { db } from '@/lib/db';

export async function PUT(
    req: Request,
    props: {
        params: Promise<{ chapterId: string; courseId: string }>;
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
                chapterId: params.chapterId,
            },
        });

        if (existingUserProgress) {
            // Actualizar el registro existente
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
            // Crear un nuevo registro
            const newUserProgress = await db.userProgress.create({
                data: {
                    userId,
                    chapterId: params.chapterId,
                    isCompleted,
                },
            });
            return NextResponse.json(newUserProgress);
        }

    } catch (error) {
        console.log('[CHAPTER_ID_PROGRESS]', error);
        return new NextResponse('Internal Error', { status: 500 });
    }
}