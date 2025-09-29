import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface DataCardProps {
    value: number;
    label: string;
}

/**
 * Displays a simple card with a label and a numerical value.
 */
export const DataCard = ({ value, label }: DataCardProps) => {
    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                <CardTitle className="text-sm font-medium">{label}</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">
                    {value}
                </div>
            </CardContent>
        </Card>
    );
};