import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { ArrowLeft, LayoutDashboard, View } from "lucide-react";
import Link from "next/link";

import { db } from "@/lib/db";
import { Answer, EvaluationType, Question } from "@prisma/client";

import { IconBadge } from "@/components/icon-badge";
import { Banner } from "@/components/banner";
import { Actions } from "./_components/actions";
import { SingleChoiceForm } from "./_components/single-choice-form";
import { MultipleChoiceForm } from "./_components/multiple-choice-form";
import { QuestionsPreviewForm } from "./_components/question-preview-form";
import { TypeForm } from "./_components/type-form";
import { OpenQuestionForm } from './_components/open-question-form';

/**
 * Evaluation Configuration Page.
 * Displays and allows the editing of an evaluation type, questions and answers.
 */
export default async function EvaluationIdPage({
                                                   params,
                                               }: {
    params: Promise<{ evaluationId: string; courseId: string; moduleId: string }>;
}) {
    const { evaluationId, courseId, moduleId } = await params;
    const { userId, redirectToSignIn } = await auth();

    if (!userId) return redirectToSignIn();
    if (!evaluationId) return redirect("/");

    const [course, module, evaluation] = await Promise.all([
        db.course.findUnique({ where: { id: courseId } }),
        db.module.findUnique({ where: { id: moduleId } }),
        db.evaluation.findUnique({ where: { id: evaluationId } }),
    ]);

    if (!course || !module || !evaluation) return redirect("/");

    const questions: (Question & { answers: Answer[] })[] = await db.question.findMany({
        where: { evaluationId },
        include: { answers: true },
    });

    const evaluationTypes = Object.values(EvaluationType).map((type) => ({
        label: type.charAt(0).toUpperCase() + type.slice(1),
        value: type,
    }));

    const requiredFields = [evaluation.type, questions.length > 0];
    const totalFields = requiredFields.length;
    const completedFields = requiredFields.filter(Boolean).length;
    const completionText = `(${completedFields}/${totalFields})`;
    const isComplete = requiredFields.every(Boolean);

    return (
        <>
            {!evaluation.isPublished && (
                <Banner label="Esta evaluación no está publicada. No será visible para los estudiantes." />
            )}

            <div className="p-6">
                <div className="flex items-center justify-between">
                    <div className="w-full">
                        <Link
                            href={`/teacher/courses/${courseId}/modules/${moduleId}`}
                            className="flex items-center text-sm hover:opacity-75 transition mb-6"
                        >
                            <ArrowLeft className="h-4 w-4 mr-2" />
                            Volver a la configuración del módulo
                        </Link>

                        <div className="flex items-center justify-between w-full">
                            <div className="flex flex-col gap-y-2">
                                <h1 className="text-2xl font-medium">Creación de la evaluación</h1>
                                <span className="text-sm text-slate-700">
                  Completa todos los campos {completionText}
                </span>
                            </div>
                            <Actions
                                disabled={!isComplete}
                                courseId={courseId}
                                moduleId={moduleId}
                                evaluationId={evaluationId}
                                isPublished={evaluation.isPublished}
                            />
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-16">
                    <div className="space-y-4">
                        <div>
                            <div className="flex items-center gap-x-2">
                                <IconBadge icon={LayoutDashboard} />
                                <h2 className="text-xl">Personaliza el módulo</h2>
                            </div>
                            <TypeForm
                                initialData={evaluation}
                                courseId={course.id}
                                moduleId={module.id}
                                evaluationTypes={evaluationTypes}
                            />
                            {evaluation.type === "single" && (
                                <SingleChoiceForm
                                    courseId={courseId}
                                    moduleId={moduleId}
                                    evaluationId={evaluationId}
                                />
                            )}
                            {evaluation.type === "multiple" && (
                                <MultipleChoiceForm
                                    courseId={courseId}
                                    moduleId={moduleId}
                                    evaluationId={evaluationId}
                                />
                            )}
                            {evaluation.type === "open" && (
                                <OpenQuestionForm
                                    courseId={courseId}
                                    moduleId={moduleId}
                                    evaluationId={evaluationId}
                                />
                            )}
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div>
                            <div className="flex items-center gap-x-2">
                                <IconBadge icon={View} />
                                <h2 className="text-xl">Vista previa de preguntas</h2>
                            </div>
                            <QuestionsPreviewForm questions={questions} />
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
