import { redirect } from 'next/navigation';

import { db } from '@/lib/db';


/**
 * Course page redirect handler.
 */

export default async function CourseIdPage(
    props: {
        params: Promise<{ courseId: string }>;
    }
) {
    const params = await props.params;

    // Fetches the course and includes only published chapters, ordered by position
    const course = await db.course.findUnique({
        where: {
            id: params.courseId,
        },
        include: {
            chapters: {
                where: {
                    isPublished: true,
                },
                orderBy: {
                    position: 'asc',
                },
            },
        },
    });

    if (!course) {
        return redirect('/');
    }

    if (course.chapters.length === 0) {
        return redirect('/');
    }

    return redirect(`/courses/${course.id}/chapters/${course.chapters[0].id}`);
};
