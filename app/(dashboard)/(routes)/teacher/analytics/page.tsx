import { auth } from '@clerk/nextjs/server';

import { getAnalytics } from '@/actions/get-analytics';

import { DataCard } from './_components/data-card';
import { Chart } from './_components/chart';

/**
 * Displays the analytics page, showing total registrations and a chart with analytics data.
 */
const AnalyticsPage = async () => {
    const { userId, redirectToSignIn } = await auth();

    if (!userId) return redirectToSignIn()

    const { data, totalRegistrations } = await getAnalytics(userId);

    return (
        <div className="p-6">
            <div className="grid grid-cols-1 gap-4 mb-4 md:grid-cols-2">
                <DataCard label="Total de inscripciones" value={totalRegistrations} />
            </div>
            <Chart data={data} />
        </div>
    );
};

export default AnalyticsPage;