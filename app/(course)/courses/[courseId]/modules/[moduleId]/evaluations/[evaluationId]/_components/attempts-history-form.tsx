"use client";

import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';
import { CalendarIcon } from 'lucide-react';

interface Attempt {
    attemptNumber: number;
    score: number;
    date: string;
}

interface AttemptsHistoryFormProps {
    attemptsHistory: Attempt[];
}

/**
 * Displays a visual history of previous evaluation attempts.
 *
 * Shows a list of attempts with:
 * - Attempt number
 * - Date of the attempt (localized in Spanish)
 * - A progress bar representing the score
 * - A colored score badge (green if passed, amber if not)
*/
const AttemptsHistoryForm = ({
                                 attemptsHistory,
                             }: AttemptsHistoryFormProps) => {
    return (
        <div className="space-y-4">
            <h2 className="text-2xl font-bold text-center pt-4 mb-4 text-slate-800">Historial de intentos</h2>

            <div className="space-y-3">
                {attemptsHistory.map((item) => (
                    <div
                        key={item.attemptNumber}
                        className="flex flex-col sm:flex-row items-start sm:items-center gap-2 p-3 bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow transition-shadow"
                    >
                        {/* Attempt information */}
                        <div className="w-full sm:w-2/5 flex items-center">
                            <div className="bg-slate-100 rounded-lg p-1.5 mr-2">
                                <span className="font-bold text-slate-700 text-sm">#{item.attemptNumber}</span>
                            </div>
                            <div>
                                <p className="font-medium text-slate-900">Intento {item.attemptNumber}</p>
                                <p className="text-xs text-slate-500 flex items-center">
                                    <CalendarIcon className="h-3 w-3 mr-1" />
                                    {new Date(item.date).toLocaleDateString('es-ES', {
                                        day: 'numeric',
                                        month: 'short',
                                        year: 'numeric'
                                    })}
                                </p>
                            </div>
                        </div>

                        {/* Progress bar */}
                        <div className="w-full sm:w-2/5 flex-grow">
                            <Progress
                                value={item.score}
                                className="h-2"
                            />
                        </div>

                        {/* Score */}
                        <div className="w-full sm:w-1/5 flex justify-end">
                            <div className={cn(
                                "py-0.5 px-2 rounded-full text-xs font-semibold",
                                item.score >= 80
                                    ? "bg-emerald-50 text-emerald-700"
                                    : "bg-amber-50 text-amber-700"
                            )}>
                                {item.score.toFixed(0)}%
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );

};

export { AttemptsHistoryForm };