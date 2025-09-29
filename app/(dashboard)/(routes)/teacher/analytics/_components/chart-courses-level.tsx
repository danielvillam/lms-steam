import { Chart } from "@/components/ui/chart";

export const ChartCoursesLevel = ({ data }: { data: { name: string; courses: number }[] }) => (
    <Chart data={data} dataKey="courses" label="Cursos" />
);
