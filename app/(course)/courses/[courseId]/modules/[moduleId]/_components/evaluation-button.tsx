"use client";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { BadgeCheck, Repeat2, FileCheck2, FileWarning } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

interface EvaluationButtonProps {
    courseId: string;
    moduleId: string;
    evaluationId: string;
    attempt: number;
    maxAttempts: number;
    isCompleted: boolean;
    score?: number;
}

/**
 * Displays a contextual button for the evaluation section of a module.
 *
 * The button dynamically changes based on:
 * - Whether the user has passed the evaluation
 * - How many attempts are left
 * - The evaluation score
 *
 * Additionally, shows evaluation information and a progress bar if a score exists.
 */
export function EvaluationButton({
                                     courseId,
                                     moduleId,
                                     evaluationId,
                                     attempt,
                                     maxAttempts,
                                     score,
                                 }: EvaluationButtonProps) {
    const router = useRouter();
    const isPassed = (score ?? 0) >= 80;
    const hasAttemptsLeft = attempt < maxAttempts;
    const attemptsLeft = maxAttempts - attempt;

    const handleClick = () => {
        router.push(
            `/courses/${courseId}/modules/${moduleId}/evaluations/${evaluationId}`
        );
    };

    const getButtonState = () => {
        // Case: Without remaining attempts → Always see history
        if (!hasAttemptsLeft) {
            return {
                text: "Ver historial de evaluación",
                icon: (
                    isPassed ? (
                        <BadgeCheck className={cn("w-4 h-4 mr-2", "text-emerald-600")} />
                    ) : (
                        <FileWarning className="w-4 h-4 mr-2 text-amber-600" />
                    )
                ),
                variant: "outline" as const,
                disabled: false,
                info: isPassed
                    ? `Puntaje final: ${score}% • Intentos utilizados: ${maxAttempts}/${maxAttempts}`
                    : `Puntaje final: ${score}% • Sin intentos restantes`,
                showButton: true,
            };
        }

        // With available attempts
        if (!isPassed) {
            return {
                text: attempt === 0 ? "Ir a la evaluación" : "Repetir evaluación",
                icon: attempt === 0 ? (
                    <FileCheck2 className="w-4 h-4 mr-2" />
                ) : (
                    <Repeat2 className="w-4 h-4 mr-2" />
                ),
                variant: "default" as const,
                disabled: false,
                info: `Intentos disponibles: ${attemptsLeft}`,
                showButton: true,
            };
        }

        // approved and even with attempts: offer to repeat
        return {
            text: "Repetir evaluación",
            icon: <Repeat2 className="w-4 h-4 mr-2" />,
            variant: "outline" as const,
            disabled: false,
            info: `Puntaje actual: ${score}% • Intentos restantes: ${attemptsLeft}`,
            showButton: true,
        };
    };

    const buttonState = getButtonState();

    return (
        <div className="mt-6 space-y-3">
            <div className="flex items-center justify-between">
                <div className="flex items-center">
                    <div className="bg-slate-100 dark:bg-slate-800 rounded-lg p-2 mr-3">
                        {buttonState.icon}
                    </div>
                    <div>
                        <h3 className="font-medium">Evaluación del módulo</h3>
                        <p className="text-sm text-slate-500">{buttonState.info}</p>
                    </div>
                </div>

                {buttonState.showButton && (
                    <Button
                        onClick={handleClick}
                        disabled={buttonState.disabled}
                        variant={buttonState.variant}
                        className={cn(
                            "min-w-[160px]",
                            buttonState.disabled
                                ? "text-slate-500 border border-slate-300 cursor-default"
                                : ""
                        )}
                    >
                        {buttonState.text}
                    </Button>
                )}
            </div>

            {score !== undefined && (
                <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                        <span
                            className={cn(
                                "font-medium",
                                isPassed ? "text-emerald-600" : "text-amber-600"
                            )}
                        >
                            {isPassed ? "Aprobado" : "No aprobado"}
                        </span>
                        <span>{score}%</span>
                    </div>
                    <Progress value={score} className="h-2" />
                    <div className="flex justify-between text-xs text-slate-500">
                        <span>0%</span>
                        <span>80% requerido</span>
                        <span>100%</span>
                    </div>
                </div>
            )}
        </div>
    );
}
