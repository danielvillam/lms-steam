import { redirect } from 'next/navigation';

import { db } from '@/lib/db';

const CourseIdPage = async ({
    params: asyncParams,
}: {
    params: {
        courseId: string;
    };
}) => {
    const params = await asyncParams;

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

export default CourseIdPage;
