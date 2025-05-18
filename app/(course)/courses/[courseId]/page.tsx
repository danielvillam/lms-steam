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

    // Fetches the course and includes only published modules, ordered by position
    const course = await db.course.findUnique({
        where: {
            id: params.courseId,
        },
        include: {
            modules: {
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

    if (course.modules.length === 0) {
        return redirect('/');
    }

    return redirect(`/courses/${course.id}/modules/${course.modules[0].id}`);
};
