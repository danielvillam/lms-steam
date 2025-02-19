import { LucideIcon } from 'lucide-react';

import { IconBadge } from '@/components/icon-badge';

interface InfoCardProps {
    numberOfItems: number;
    variant?: 'default' | 'success';
    label: string;
    icon: LucideIcon;
}

/**
 * Displays an information card with an icon, label, and item count.
 */
export const InfoCard = ({
                             variant,
                             icon: Icon,
                             numberOfItems,
                             label,
                         }: InfoCardProps) => {
    return (
        <div className="flex items-center p-3 border rounded-md gap-x-2">
            <IconBadge variant={variant} icon={Icon} />
            <div>
                <p className="font-medium">{label}</p>
                <p className="text-sm text-gray-500">
                    {numberOfItems} {numberOfItems === 1 ? 'Curso' : 'Cursos'}
                </p>
            </div>
        </div>
    );
};