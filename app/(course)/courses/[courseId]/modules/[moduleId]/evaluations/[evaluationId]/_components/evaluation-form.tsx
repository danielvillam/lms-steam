"use client";

import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import toast from 'react-hot-toast';
import { EvaluationType } from '@prisma/client';
import { QuestionForm } from "./question-form";
import { AttemptsHistoryForm } from "./attempts-history-form";
import { Loading } from '@/components/loading';

type Answer = { id: string; title: string; isCorrect: boolean };
type Question = { id: string; title: string; evaluationId: string; answers: Answer[] };
interface Attempt { attemptNumber: number; score: number; date: string; }

interface Props {
    courseId: string;
    moduleId: string;
    evaluationId: string;
    evaluationType: EvaluationType;
    questions: Question[];
    nextModuleId?: string;
    attempt: number;
    maxAttempts: number;
    score?: number;
    attemptsHistory?: Attempt[];
}

/**
 * EvaluationForm is a full-featured evaluation (quiz/test) handler component.
 *
 * It dynamically renders the user flow based on attempt history, score, and evaluation type.
 * It supports:
 * - Single choice, multiple choice, and open-ended evaluations.
 * - Tracking and storing of user answers.
 * - Calculation and submission of evaluation score.
 * - Display of previous attempts and conditional logic for retries.
 * - Navigation between questions and between course modules.
 */

//TODO: Verify decrease in cases
//TODO: Segment code
//TODO: Verify consistency with model
export function EvaluationForm({
                                   courseId,
                                   moduleId,
                                   evaluationId,
                                   evaluationType,
                                   questions,
                                   nextModuleId,
                                   attempt,
                                   maxAttempts,
                                   score: initialScore = 0,
                                   attemptsHistory = [],
                               }: Props) {
    const router = useRouter();
    const [index, setIndex] = useState(0);
    const [responses, setResponses] = useState<Record<string, any>>({});
    const [started, setStarted] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [score, setScore] = useState(initialScore);
    const [isLoading, setIsLoading] = useState(false);

    const total = questions.length;
    const passed = score >= 80;
    const maxPassed = score === 100;
    const canRetry = attempt < maxAttempts;

    // Handler for answers
    const onChange = (value: any) => {
        setResponses((prev) => ({ ...prev, [questions[index].id]: value }));
    };

    // Navigation between questions
    const next = () => setIndex((i) => Math.min(i + 1, total - 1));
    const prev = () => setIndex((i) => Math.max(i - 1, 0));

    // generic handler for browsing with load status
    const handleNavigation = async (path: string) => {
        setIsLoading(true);
        try {
            await router.push(path);
        } finally {
            setIsLoading(false);
        }
    };

    // Handler for Reintents with Cargo State
    const handleRetry = () => {
        setIsLoading(true);
        try {
            start();
        } finally {
            setTimeout(() => setIsLoading(false), 0);
        }
    };

    // Start evaluation
    const start = () => {
        setStarted(true);
        setIndex(0);
        setResponses({});
        setSubmitted(false);
        setScore(0);
    };

    // Send evaluation
    const submit = async () => {
        let correctCount = 0;
        const selectedAnswers: {
            title: string;
            questionId: string;
            isCorrect: boolean
        }[] = [];

        // Calculate score according to type of evaluation
        questions.forEach((ques) => {
            const resp = responses[ques.id];
            const correctAnswers = ques.answers.filter(a => a.isCorrect);

            switch (evaluationType) {
                case 'single':
                    const selectedId = resp;
                    const selectedAnswer = ques.answers.find(a => a.id === selectedId);
                    const isCorrectSingle = selectedAnswer?.isCorrect || false;

                    if (isCorrectSingle) correctCount++;
                    selectedAnswers.push({
                        title: selectedAnswer?.title || "Sin respuesta",
                        questionId: ques.id,
                        isCorrect: isCorrectSingle,
                    });
                    break;

                case 'multiple':
                    if (Array.isArray(resp)) {
                        const rightIds = correctAnswers.map(a => a.id);
                        const isCorrectMultiple = resp.length === rightIds.length &&
                            resp.every(id => rightIds.includes(id));

                        if (isCorrectMultiple) correctCount++;
                        resp.forEach((id: string) => {
                            const ans = ques.answers.find(a => a.id === id)!;
                            selectedAnswers.push({
                                title: ans.title,
                                questionId: ques.id,
                                isCorrect: ans.isCorrect
                            });
                        });
                    }
                    break;

                case 'open':
                    const userAnswer = String(resp || '').toLowerCase().trim();
                    const correctOptions = correctAnswers.map(a => a.title.toLowerCase().trim());
                    const isCorrectOpen = correctOptions.includes(userAnswer);

                    if (isCorrectOpen) correctCount++;
                    selectedAnswers.push({
                        title: userAnswer,
                        questionId: ques.id,
                        isCorrect: isCorrectOpen,
                    });
                    break;

                default:
                    console.warn(`Tipo de evaluación no soportado: ${evaluationType}`);
                    break;
            }
        });

        setIsLoading(true);
        try {
            const finalScore = Math.round((correctCount / total) * 100);
            setScore(finalScore);
            setSubmitted(true);
            await axios.post(
                `/api/courses/${courseId}/modules/${moduleId}/evaluations/${evaluationId}/results`,
                { selectedAnswers, score: finalScore }
            );

            // Update progress if you approved
            if (finalScore >= 80) {
                await axios.put(
                    `/api/courses/${courseId}/modules/${moduleId}/progress`,
                    { isCompleted: true }
                );
                toast.success('Progreso actualizado');
            }else{
                toast.success('Evaluación guardada');
            }
            router.refresh();
        } catch (error) {
            console.error('Error al guardar resultados:', error);
            toast.error('Error al procesar la evaluación');
        } finally {
            setIsLoading(false);
        }
    };

    // Function to rendilizable cases
    const renderHistoryCase = (
        buttons: React.ReactNode,
        message: string,
        messageClass: string
    ) => (
        <div className="space-y-4">
            <AttemptsHistoryForm attemptsHistory={attemptsHistory} />
            {buttons}
            <p className={cn("text-center mt-2", messageClass)}>
                {message}
            </p>
        </div>
    );

    // Reusable button component with load management
    const ActionButton = ({
                              onClick,
                              children,
                              variant = "default"
                          }: {
        onClick: () => void;
        children: React.ReactNode;
        variant?: "default" | "outline";
    }) => (
        <Button
            variant={variant}
            onClick={onClick}
            disabled={isLoading}
            className="min-w-[120px] justify-center"
        >
            {isLoading ? <Loading/> : children}
        </Button>
    );

    // Case 1: First evaluation
    if (!started && attemptsHistory.length === 0) {
        return (
            <div className="space-y-4 text-center">
                <ActionButton onClick={start}>
                    Comenzar evaluación
                </ActionButton>
            </div>
        );
    }

    // Case 2: Can improve qualification
    if (!started && attemptsHistory.length > 0 && canRetry && passed && !maxPassed) {
        return renderHistoryCase(
            <div className="flex justify-center gap-4 mt-4">
                <ActionButton
                    variant="outline"
                    onClick={() => handleNavigation(`/courses/${courseId}/modules/${moduleId}`)}
                >
                    Volver al curso
                </ActionButton>
                <ActionButton onClick={handleRetry}>
                    Reintentar evaluación
                </ActionButton>
            </div>,
            "Ya aprobaste, pero puedes mejorar tu calificación",
            "text-green-600"
        );
    }

    // Case 3: Can reinstate (not approved)
    if (!started && attemptsHistory.length > 0 && canRetry && !passed) {
        return renderHistoryCase(
            <div className="flex justify-center gap-2">
                <ActionButton
                    variant="outline"
                    onClick={() => handleNavigation(`/courses/${courseId}/modules/${moduleId}`)}
                >
                    Volver al curso
                </ActionButton>
                <ActionButton onClick={handleRetry}>
                    Reintentar evaluación
                </ActionButton>
            </div>,
            "Puedes repetir para intentar aprobar",
            "text-yellow-600"
        );
    }

    // Case 4: Without attempts (not approved)
    if (!started && attemptsHistory.length > 0 && !canRetry && !passed) {
        return renderHistoryCase(
            <div className="flex justify-center">
                <ActionButton
                    onClick={() => handleNavigation(`/courses/${courseId}/modules/${moduleId}`)}
                >
                    Volver al curso
                </ActionButton>
            </div>,
            "Has agotado tus intentos. No has aprobado el módulo.",
            "text-red-600"
        );
    }

    // Case 5: Without attempts (approved)
    if (!started && attemptsHistory.length > 0 && !canRetry && passed) {
        return renderHistoryCase(
            <div className="flex justify-center gap-2">
                <ActionButton
                    variant="outline"
                    onClick={() => handleNavigation(`/courses/${courseId}/modules/${moduleId}`)}
                >
                    Volver al curso
                </ActionButton>
                {nextModuleId && (
                    <ActionButton
                        onClick={() => handleNavigation(`/courses/${courseId}/modules/${nextModuleId}`)}
                    >
                        Siguiente módulo
                    </ActionButton>
                )}
            </div>,
            "¡Felicidades! Has aprobado el módulo",
            "text-green-600"
        );
    }

    // Case 6: Maximum qualification
    if (!started && attemptsHistory.length > 0 && maxPassed) {
        return renderHistoryCase(
            <div className="flex justify-center gap-2">
                <ActionButton
                    variant="outline"
                    onClick={() => handleNavigation(`/courses/${courseId}/modules/${moduleId}`)}
                >
                    Volver al curso
                </ActionButton>
                {nextModuleId && (
                    <ActionButton
                        onClick={() => handleNavigation(`/courses/${courseId}/modules/${nextModuleId}`)}
                    >
                        Siguiente módulo
                    </ActionButton>
                )}
            </div>,
            "Ya aprobaste, obtuviste la máxima calificación",
            "text-green-600"
        );
    }

    // Case 7: results after sending
    if (submitted) {
        return (
            <div className="space-y-6 text-center">
                <h2 className="text-2xl font-bold">Resultado</h2>
                <p>
                    Puntuación: <span className="font-semibold">{score.toFixed(0)}%</span>
                </p>
                <p className={cn("text-lg font-medium", passed ? "text-green-600" : "text-red-600")}>
                    {passed ? "¡Aprobado!" : "No aprobado"}
                </p>

                <div className="flex flex-col gap-2 items-center">
                    {passed && nextModuleId && (
                        <ActionButton
                            onClick={() => handleNavigation(`/courses/${courseId}/modules/${nextModuleId}`)}
                        >
                            Siguiente módulo
                        </ActionButton>
                    )}

                    <div className="flex gap-2">
                        <ActionButton
                            variant="outline"
                            onClick={() => handleNavigation(`/courses/${courseId}/modules/${moduleId}`)}
                        >
                            Volver al curso
                        </ActionButton>
                        {canRetry && !passed && (
                            <ActionButton onClick={handleRetry}>
                                Reintentar
                            </ActionButton>
                        )}
                    </div>
                </div>
            </div>
        );
    }

    // Case 8: Active Question Form
    return (
        <QuestionForm
            questions={questions}
            responses={responses}
            evaluationType={evaluationType}
            index={index}
            onChange={onChange}
            prev={prev}
            next={next}
            onSubmit={submit}
            total={total}
        />
    );
}