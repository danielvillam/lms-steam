'use client';

import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Legend, Tooltip } from 'recharts';

import { Card } from '@/components/ui/card';

interface ChartData {
    name: string;
    [key: string]: number | string;
}

interface ChartProps {
    data: ChartData[];
    dataKey: keyof Omit<ChartData, "name">;
    label: string;
}

/**
 * Displays a reusable bar chart for different datasets.
 */
export const Chart = ({ data, dataKey, label }: ChartProps) => {
    return (
        <Card className="p-4 rounded-xl shadow-md bg-white dark:bg-gray-900">
            <ResponsiveContainer width="100%" height={350}>
                <BarChart data={data}>
                    <XAxis
                        dataKey="name"
                        stroke="#888"
                        fontSize={12}
                        tickLine={false}
                        axisLine={false}
                    />
                    <YAxis
                        stroke="#888"
                        fontSize={12}
                        tickLine={false}
                        axisLine={false}
                        allowDecimals={false}
                    />
                    <Tooltip />
                    <Legend />
                    <Bar
                        dataKey={dataKey}
                        fill="#0369a1"
                        radius={[6, 6, 0, 0]}
                        name={label}
                        animationBegin={200}
                        animationDuration={800}
                    />
                </BarChart>
            </ResponsiveContainer>
        </Card>
    );
};