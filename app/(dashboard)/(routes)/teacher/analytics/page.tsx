import { auth } from "@clerk/nextjs/server";
import { getAnalytics } from "@/actions/get-analytics";
import { DataCard } from "./_components/data-card";
import { ChartRegistrations } from "./_components/chart-registrations";
import { ChartCoursesLevel } from "./_components/chart-courses-level";
import { ChartRegistrationsLevel } from "./_components/chart-registrations-level";
import { ChartRegistrationsByMonth } from "./_components/chart-registrations-bymonth";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";

/**
 * Displays the analytics page, allowing users to toggle between different analytics views.
 */
const AnalyticsPage = async () => {
    const { userId, redirectToSignIn } = await auth();

    if (!userId) return redirectToSignIn();

    const { data, totalRegistrations, coursesByLevel, registrationsByLevel, registrationsByMonth  } = await getAnalytics(userId);

    // Dynamic data generation for charts
    const levels = ["Principiante", "Intermedio", "Avanzado"];
    const chartData = levels.map(level => ({
        name: level,
        courses: coursesByLevel[level] ?? 0,
        students: registrationsByLevel[level] ?? 0
    }));

    // Function to generate DataCards dynamically
    const renderDataCards = (labelPrefix: string, dataKey: "courses" | "students") => (
        <div className="grid grid-cols-1 gap-4 mb-4 md:grid-cols-3">
            {levels.map(level => (
                <DataCard
                    key={level}
                    label={`${labelPrefix} para ${level.toLowerCase()}`}
                    value={dataKey === "courses" ? coursesByLevel[level] ?? 0 : registrationsByLevel[level] ?? 0}
                />
            ))}
        </div>
    );

    // Calculate the total number of registrations in the last 6 months
    const totalRegistrationsLast6Months = Object.values(registrationsByMonth).reduce((sum, count) => sum + count, 0);

    // Format the data for the enrollment by month chart
    const chartDataByMonth = Object.entries(registrationsByMonth).map(([month, count]) => ({
        month,
        count,
    }));

    return (
        <div className="p-6">
            <Accordion type="multiple" className="space-y-6">
                <AccordionItem value="inscripciones-curso">
                    <AccordionTrigger>Inscripciones en los cursos</AccordionTrigger>
                    <AccordionContent>
                        <div className="grid grid-cols-1 gap-4 mb-4 md:grid-cols-2">
                            <DataCard label="Total de inscripciones" value={totalRegistrations} />
                        </div>
                        <ChartRegistrations data={data} />
                    </AccordionContent>
                </AccordionItem>

                <AccordionItem value="cursos-nivel">
                    <AccordionTrigger>Cursos por nivel</AccordionTrigger>
                    <AccordionContent>
                        {renderDataCards("Cursos", "courses")}
                        <ChartCoursesLevel data={chartData} />
                    </AccordionContent>
                </AccordionItem>

                <AccordionItem value="inscripciones-nivel">
                    <AccordionTrigger>Inscripciones por nivel</AccordionTrigger>
                    <AccordionContent>
                        {renderDataCards("Inscripciones en cursos", "students")}
                        <ChartRegistrationsLevel data={chartData} />
                    </AccordionContent>
                </AccordionItem>

                <AccordionItem value="inscripciones-mes">
                    <AccordionTrigger>Inscripciones en los últimos 6 meses</AccordionTrigger>
                    <AccordionContent>
                        <div className="grid grid-cols-1 gap-4 mb-4 md:grid-cols-2">
                            <DataCard label="Inscripciones en los últimos 6 meses" value={totalRegistrationsLast6Months} />
                        </div>
                        <ChartRegistrationsByMonth data={chartDataByMonth} />
                    </AccordionContent>
                </AccordionItem>
            </Accordion>
        </div>
    );
};

export default AnalyticsPage;