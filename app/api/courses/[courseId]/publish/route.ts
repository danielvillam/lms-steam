import { auth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

import { db } from '@/lib/db';

/**
 * PATCH Request Handler for Publishing a Course.
 *
 * This function handles PATCH requests to publish a course.
 */
export async function PATCH(
    req: Request,
    props: {
        params: Promise<{ courseId: string }>;
    }
) {
    try {
        const params = await props.params;
        const { userId } = await auth();

        if (!userId) {
            return new NextResponse("Unauthorized", { status: 401 })
        }

        const course = await db.course.findUnique({
            where: {
                id: params.courseId,
                userId,
            },
            include: {
               chapters: {
                   include: {
                       muxData: true
                   }
               }
            }
        });

        if (!course) {
            return new NextResponse("Not found", { status: 404 });
        }

        const hasPublishedChapter = course.chapters.some((chapter) => chapter.isPublished);

        if (!course.title || !course.description || !course.level || !course.previousSkills || !course.developedSkills || !course.imageUrl || !course.categoryId || !hasPublishedChapter || !course.price == null) {
            return new NextResponse("Missing required fields", { status:401 });
        }

        const publishedCourse = await db.course.update({
            where: {
                id: params.courseId,
            },
            data: {
                isPublished: true,
            }
        })

        return NextResponse.json(publishedCourse);
    } catch (error) {
        console.log("[COURSE_ID_PUBLISH]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}