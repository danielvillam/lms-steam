import { isTeacher } from '@/lib/teacher';
import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';

/**
 * Teacher Layout Component.
 *
 * This layout is used to restrict access to teacher-specific pages.
 */
const TeacherLayout = async ({ children }: { children: React.ReactNode }) => {
    const { userId } = await auth();

    if (!isTeacher(userId)) {
        return redirect('/');
    }

    return <>{children}</>;
};

export default TeacherLayout;