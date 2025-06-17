"use client";

import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Label } from "@/components/ui/label";
import { ChevronLeft, ChevronRight, Send } from "lucide-react";
import { EvaluationType } from '@prisma/client';
import { useMemo } from "react";

type Answer = {
    id: string;
    title: string;
    isCorrect: boolean;
};

type Question = {
    id: string;
    title: string;
    evaluationId: string;
    answers: Answer[];
};

interface QuestionFormProps {
    questions: Question[];
    responses: Record<string, any>;
    evaluationType: EvaluationType;
    index: number;
    onChange: (value: any) => void;
    prev: () => void;
    next: () => void;
    onSubmit: () => void;
    total: number;
}

/**
 * QuestionForm component renders a dynamic quiz
 *
 * It supports different evaluation types:
 * - 'single': single-choice questions using radio buttons.
 * - 'multiple': multiple-choice questions using checkboxes.
 * - others (e.g. 'open'): open-ended questions with a text input.
 *
 * Displays a progress bar based on the number of answered questions,
 * and provides navigation controls to move between questions or submit the form.
 */
const QuestionForm = ({
                          questions,
                          responses,
                          evaluationType,
                          index,
                          onChange,
                          prev,
                          next,
                          onSubmit,
                          total
                      }: QuestionFormProps) => {
    const q = questions[index];

    // Verify if all questions are complete
    const isFormComplete = useMemo(() => {
        return questions.every(question => {
            const response = responses[question.id];

            if (evaluationType === 'multiple') {
                return Array.isArray(response) && response.length > 0;
            } else {
                return response !== undefined && response !== '';
            }
        });
    }, [responses, questions, evaluationType]);

    // Calculate progress based on completed answers
    const progressPercent = useMemo(() => {
        const answeredQuestions = questions.filter(question => {
            const response = responses[question.id];

            if (evaluationType === 'multiple') {
                return Array.isArray(response) && response.length > 0;
            } else {
                return response !== undefined && response !== '';
            }
        });

        return (answeredQuestions.length / total) * 100;
    }, [responses, questions, total, evaluationType]);

    return (
        <div className="mt-6 space-y-8 max-w-3xl mx-auto p-6 border border-slate-200 rounded-xl shadow-md hover:shadow-lg transition-shadow">
            <div className="space-y-4">
                <div className="space-y-2">
                    <div className="flex justify-between items-center">
                        <span className="text-sm font-medium text-gray-700">
                            Progreso: {Math.round(progressPercent)}%
                        </span>
                        <span className="text-sm font-medium text-primary">
                            {index + 1} / {total}
                        </span>
                    </div>
                    <Progress value={progressPercent} className="h-3" />
                </div>

                <h3 className="text-xl font-semibold text-gray-900 pt-4 pb-2 border-b">
                    {q.title}
                </h3>
            </div>

            <div className="py-4">
                {evaluationType === 'single' ? (
                    <RadioGroup
                        value={responses[q.id] || ""}
                        onValueChange={onChange}
                        className="space-y-3"
                    >
                        {q.answers.map((a) => (
                            <div
                                key={a.id}
                                className="flex items-center space-x-3 p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
                            >
                                <RadioGroupItem value={a.id} id={`${q.id}-${a.id}`} />
                                <Label
                                    htmlFor={`${q.id}-${a.id}`}
                                    className="text-base font-normal cursor-pointer w-full"
                                >
                                    {a.title}
                                </Label>
                            </div>
                        ))}
                    </RadioGroup>
                ) : evaluationType === 'multiple' ? (
                    <div className="space-y-3">
                        {q.answers.map((a) => (
                            <div
                                key={a.id}
                                className="flex items-center space-x-3 p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
                            >
                                <Checkbox
                                    id={`${q.id}-${a.id}`}
                                    checked={Array.isArray(responses[q.id]) && responses[q.id].includes(a.id)}
                                    onCheckedChange={(chk) => {
                                        const prev = Array.isArray(responses[q.id]) ? [...responses[q.id]] : [];
                                        const next = chk ? [...prev, a.id] : prev.filter((id) => id !== a.id);
                                        onChange(next);
                                    }}
                                />
                                <Label
                                    htmlFor={`${q.id}-${a.id}`}
                                    className="text-base font-normal cursor-pointer w-full"
                                >
                                    {a.title}
                                </Label>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="space-y-2">
                        <Label htmlFor={`open-answer-${q.id}`} className="text-gray-700">
                            Tu respuesta:
                        </Label>
                        <Input
                            id={`open-answer-${q.id}`}
                            value={responses[q.id] || ""}
                            onChange={(e) => onChange(e.target.value)}
                            placeholder="Escribe tu respuesta aquí..."
                            className="py-5 px-4 text-base"
                        />
                    </div>
                )}
            </div>

            <div className="flex justify-between pt-6 border-t">
                <Button
                    variant="outline"
                    onClick={prev}
                    disabled={index === 0}
                    className="gap-1"
                >
                    <ChevronLeft className="h-4 w-4" />
                    Anterior
                </Button>

                {index < total - 1 ? (
                    <Button onClick={next} className="gap-1">
                        Siguiente
                        <ChevronRight className="h-4 w-4" />
                    </Button>
                ) : (
                    <Button
                        onClick={onSubmit}
                        className={`gap-1 ${isFormComplete ? 'bg-green-600 hover:bg-green-700' : 'bg-gray-400 cursor-not-allowed'}`}
                        disabled={!isFormComplete}
                    >
                        Enviar evaluación
                        <Send className="h-4 w-4" />
                    </Button>
                )}
            </div>
        </div>
    );
};

export { QuestionForm };