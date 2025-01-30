import { auth } from '@clerk/nextjs/server';
import { CheckCircle, Clock } from 'lucide-react';

import { CoursesList } from '@/components/courses-list';
import { getDashboardCourses } from '@/actions/get-dashboard-courses';
import { InfoCard } from './_components/info-card';

export default async function Dashboard() {
    const { userId, redirectToSignIn } = await auth()

    if (!userId) return redirectToSignIn()

    const { completedCourses, coursesInProgress } = await getDashboardCourses(
        userId
    );

    return (
        <div className="p-6 space-y-4">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <InfoCard
                    icon={Clock}
                    label="En Curso"
                    numberOfItems={coursesInProgress.length}
                />
                <InfoCard
                    icon={CheckCircle}
                    label="Finalizado"
                    numberOfItems={completedCourses.length}
                    variant="success"
                />
            </div>
            <CoursesList items={[...coursesInProgress, ...completedCourses]} />
        </div>
    );
}