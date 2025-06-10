'use client';

import { ClipboardList, Lock } from 'lucide-react';
import { useRouter, usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

interface ModuleEvaluationItemProps {
    courseId: string;
    moduleId: string;
    evaluationId: string;
    isModuleCompleted: boolean;
}

/**
 * Navigation bar component in modules that include the assessment for the course page.
 */
export const ModuleEvaluationItem = ({
                                         courseId,
                                         moduleId,
                                         evaluationId,
                                         isModuleCompleted,
                                     }: ModuleEvaluationItemProps) => {
    const router = useRouter();
    const pathname = usePathname();

    const isActive = pathname?.includes(`${moduleId}/evaluations`);
    const isLocked = !isModuleCompleted;

    const onClick = () => {
        if (isLocked) return;
        router.push(`/courses/${courseId}/modules/${moduleId}/evaluations/${evaluationId}`);
    };

    return (
        <button
            onClick={onClick}
            disabled={isLocked}
            className={cn(
                'flex items-center gap-x-2 text-sm pl-12 py-3 transition-colors duration-200 ease-in-out',
                'rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-400',
                isLocked
                    ? 'text-slate-400 cursor-not-allowed'
                    : 'text-slate-600 hover:text-slate-800 hover:bg-slate-100',
                isActive &&
                'bg-slate-100 text-slate-800 hover:bg-slate-100 font-semibold',
            )}
        >
            {isLocked ? (
                <Lock className="h-4 w-4 text-slate-400" />
            ) : (
                <ClipboardList className="h-4 w-4 text-slate-600" />
            )}
            Evaluación
        </button>
    );

};
