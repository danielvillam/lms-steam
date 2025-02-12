import { Chart } from "@/components/ui/chart";

export const ChartRegistrationsByMonth = ({ data }: { data: { month: string; count: number }[] }) => {
    const formattedData = data.map(({ month, count }) => ({
        name: month,
        count,
    }));

    return <Chart data={formattedData} dataKey="count" label="Inscripciones" />;
};
