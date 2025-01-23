import { NextResponse } from 'next/server';
import { currentUser } from '@clerk/nextjs/server';

import { db } from '@/lib/db';

export async function POST(
    req: Request,
    props: {
        params: Promise<{ courseId: string }>;
    }
) {
    try {
        const params = await props.params;

        const user = await currentUser();
        if (!user || !user.id || !user.emailAddresses[0].emailAddress) {
            return new NextResponse('Unauthorized', { status: 401 });
        }

        const course = await db.course.findUnique({
            where: {
                id: params.courseId,
                isPublished: true,
            },
        });
        const registration = await db.registration.findFirst({
            where: {
                AND: [
                    { userId: user.id },
                    { courseId: params.courseId },
                ],
            },
        });

        if (registration) {
            return new NextResponse('Already Purchased', { status: 400 });
        }

        if (!course) {
            return new NextResponse('Course Not Found', { status: 404 });
        }

        await db.registration.create({
            data: {
                courseId: course.id,
                userId: user.id,
            },
        });

        return NextResponse.json({ url: `${process.env.NEXT_PUBLIC_APP_URL}/courses/${course.id}?success=1` });
    } catch (error) {
        console.log('[COURSE_ID_CHECKOUT]', error);
        return new NextResponse('Internal Error', { status: 500 });
    }
}