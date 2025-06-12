import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

import { db } from "@/lib/db";

/**
 * PATCH Request Handler for Updating an Evaluation and Associated Questions.
 *
 * This function handles PATCH requests to update the details of a specific evaluation in a module.
 */
export async function POST(
    req: Request,
    props: {
        params: Promise<{ moduleId: string; evaluationId: string; courseId: string }>;
    }
) {
    try {
        const params = await props.params;
        const { userId } = await auth();
        const values = await req.json();

        if (!userId) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const currentEvaluation = await db.evaluation.findUnique({
            where: { id: params.evaluationId },
            select: { type: true },
        });

        const typeChanged =
            typeof values.type !== "undefined" &&
            currentEvaluation?.type !== values.type;

        const result = await db.$transaction(async (tx) => {
            if (typeChanged) {
                await tx.answer.deleteMany({
                    where: {
                        question: {
                            evaluationId: params.evaluationId,
                        },
                    },
                });

                await tx.question.deleteMany({
                    where: {
                        evaluationId: params.evaluationId,
                    },
                });
            }

            // Get the current evaluation from the database
            const existingEvaluation = await tx.evaluation.findUnique({
                where: {
                    id: params.evaluationId,
                    moduleId: params.moduleId,
                },
            });

            // Construct the update object
            const updateData: any = {
                ...values,
            };

            // Only change isPublished if the type changed
            if (values.type && values.type !== existingEvaluation?.type) {
                updateData.isPublished = false;
            }

            // Make the update
            const updatedEvaluation = await tx.evaluation.update({
                where: {
                    id: params.evaluationId,
                    moduleId: params.moduleId,
                },
                data: updateData,
            });

            await tx.module.update({
                where: {
                    id: params.moduleId,
                },
                data: {
                    evaluationMethod: values.type,
                    ...(typeChanged && { isPublished: false }),
                },
            });

            if (typeChanged) {
                const publishedModules = await tx.module.findMany({
                    where: {
                        courseId: params.courseId,
                        isPublished: true,
                    },
                });

                if (publishedModules.length === 0) {
                    await tx.course.update({
                        where: { id: params.courseId },
                        data: { isPublished: false },
                    });
                }
            }

            return { updatedEvaluation, resetQuestions: typeChanged };
        });

        return NextResponse.json(result);
    } catch (error) {
        console.log("[EVALUATIONS_ID]", error);
        return new NextResponse("Internal error", { status: 500 });
    }
}

/**
 * DELETE Request Handler for Deleting an Evaluation and Associated Questions and Answers.
 *
 * This function handles DELETE requests to remove a specific evaluation from a module.
 * Additionally, the module will be unpublished.
 */
export async function DELETE(
    req: Request,
    props: {
        params: Promise<{ moduleId: string; evaluationId: string; courseId: string }>;
    }
) {
    try {
        const params = await props.params;
        const { userId } = await auth();

        if (!userId) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const evaluation = await db.evaluation.findUnique({
            where: { id: params.evaluationId },
        });

        if (!evaluation) {
            return new NextResponse("Evaluación no encontrada", { status: 404 });
        }

        await db.$transaction(async (tx) => {
            const questions = await tx.question.findMany({
                where: {
                    evaluationId: params.evaluationId,
                },
                select: { id: true },
            });

            const questionIds = questions.map((q) => q.id);

            if (questionIds.length > 0) {
                await tx.answer.deleteMany({
                    where: {
                        questionId: { in: questionIds },
                    },
                });

                await tx.question.deleteMany({
                    where: {
                        id: { in: questionIds },
                    },
                });
            }

            await tx.evaluationResult.deleteMany({
                where: {
                    evaluationId: params.evaluationId,
                },
            });

            await tx.evaluation.delete({
                where: {
                    id: params.evaluationId,
                },
            });

            await tx.module.update({
                where: { id: params.moduleId },
                data: {
                    isEvaluable: false,
                    evaluationMethod: null,
                    isPublished: false,
                },
            });

            const publishedModules = await tx.module.findMany({
                where: {
                    courseId: params.courseId,
                    isPublished: true,
                },
            });

            if (publishedModules.length === 0) {
                await tx.course.update({
                    where: { id: params.courseId },
                    data: { isPublished: false },
                });
            }
        });

        return new NextResponse("Evaluación eliminada correctamente");
    } catch (error) {
        console.log("[EVALUATION_DELETE_ID]", error);
        return new NextResponse("Internal error", { status: 500 });
    }
}


