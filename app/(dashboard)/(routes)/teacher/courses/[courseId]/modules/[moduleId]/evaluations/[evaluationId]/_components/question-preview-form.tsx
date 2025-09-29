"use client";

import { Answer, Question } from '@prisma/client';
import { Button } from '@/components/ui/button';

type QuestionWithAnswers = Question & {
    answers: Answer[];
};

interface QuestionsPreviewFormProps {
    questions: QuestionWithAnswers[];
}

/**
 * A form component for displaying questionnaires
 */
export const QuestionsPreviewForm = ({
                                               questions,
                                           }: QuestionsPreviewFormProps) => {
    return (
        <div className="mt-6 border bg-slate-100 rounded-md p-4">
            <div className="font-medium flex items-center justify-between">
                Vista previa de la evaluación
                <Button className="invisible" variant="ghost">
                    Agregar
                </Button>
            </div>
            {questions.length === 0 ? (
                <p className="text-sm text-gray-500">Aún no se han agregado preguntas.</p>
            ) : (
                <ul className="space-y-2 mt-2">
                    {questions.map((q, idx) => (
                        <li key={q.id} className="border p-2 rounded bg-white text-sm">
                            <span className="font-medium text-gray-800">
                                Pregunta {idx + 1}:
                            </span>{" "}
                            {q.title}
                            <ul className="mt-1 space-y-1 800">
                                {q.answers.map((a, answerIdx) => (
                                    <li key={a.id} className={`flex items-start gap-2 ${a.isCorrect ? "text-sky-700 font-medium" : ""}`}>
                                        <span className="font-semibold">{String.fromCharCode(97 + answerIdx)}.</span>
                                        <span>{a.title}{a.isCorrect && " (Correcta)"}</span>
                                    </li>

                                ))}
                            </ul>

                        </li>
                    ))}
                </ul>

            )}
        </div>
    );
};
