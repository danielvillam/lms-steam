import { auth } from '@clerk/nextjs/server';

import { db } from '@/lib/db';

import { DataTable } from './_components/data-table';
import { columns } from './_components/columns';

/**
 * Courses Page.
 * Displays a list of courses created by the authenticated user.
 */
const CoursesPage = async () => {
    const { userId, redirectToSignIn } = await auth();

    if (!userId) return redirectToSignIn()

    const courses = await db.course.findMany({
        where: {
            userId,
        },
        orderBy: {
           createdAt: "desc"
        },
    });

  return (
    <div className="p-6">
        <DataTable columns={columns} data={courses} />
    </div>
  );
};

export default CoursesPage;
