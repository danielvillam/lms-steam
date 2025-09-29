import { Chart } from "@/components/ui/chart";

export const ChartRegistrationsLevel = ({ data }: { data: { name: string; students: number }[] }) => (
    <Chart data={data} dataKey="students" label="Inscripciones" />
);
