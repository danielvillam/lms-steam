    import { NextResponse } from 'next/server';
    import { currentUser } from '@clerk/nextjs/server';

    import { db } from '@/lib/db';

    /**
     * POST Request Handler for Enrolling a User in a Course.
     *
     * This function handles POST requests to enroll a user in a published course.
     */

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

            if (!course) {
                return new NextResponse('Curso no encontrado', { status: 404 });
            }

            const registration = await db.registration.findFirst({
                where: {
                    AND: [
                        { userId: user.id },
                        { courseId: params.courseId },
                    ],
                },
            });

            if (registration) {
                return new NextResponse('Ya registrado', { status: 400 });
            }

            await db.registration.create({
                data: {
                    courseId: course.id,
                    userId: user.id,
                },
            });

            return NextResponse.json({ message: 'Inscrito exitosamente' });
        } catch (error) {
            console.log('[COURSE_ID_ENROLL]', error);
            return new NextResponse('Internal Error', { status: 500 });
        }
    }