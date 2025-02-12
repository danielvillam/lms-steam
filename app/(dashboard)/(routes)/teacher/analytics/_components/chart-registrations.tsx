import { Chart } from "@/components/ui/chart";

export const ChartRegistrations = ({ data }: { data: { name: string; total: number }[] }) => (
    <Chart data={data} dataKey="total" label="Inscripciones" />
);
