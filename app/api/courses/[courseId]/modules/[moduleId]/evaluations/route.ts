import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function POST(
    req: Request,
    props: {
        params: Promise<{ moduleId: string }>;
    }
) {
    try {
        const params = await props.params;
        const { userId } = await auth();
        const { type } = await req.json();

        if (!userId) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const module = await db.module.findUnique({
            where: { id: params.moduleId },
        });

        if (!module) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const existingEvaluation = await db.evaluation.findFirst({
            where: {
                moduleId: params.moduleId,
            },
        });

        const result = await db.$transaction(async (tx) => {
            let evaluation;
            let moduleWasUnpublished = false;

            if (existingEvaluation) {
                const typeChanged = existingEvaluation.type !== type;

                if (typeChanged) {
                    const questions = await tx.question.findMany({
                        where: {
                            evaluationId: existingEvaluation.id,
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

                    moduleWasUnpublished = true;
                }

                evaluation = await tx.evaluation.update({
                    where: {
                        id: existingEvaluation.id,
                    },
                    data: {
                        type,
                        isPublished: false,
                    },
                });
            } else {
                evaluation = await tx.evaluation.create({
                    data: {
                        type,
                        moduleId: params.moduleId,
                    },
                });
            }

            await tx.module.update({
                where: {
                    id: params.moduleId,
                },
                data: {
                    isEvaluable: true,
                    evaluationMethod: type,
                    ...(moduleWasUnpublished && { isPublished: false }),
                },
            });

            if (moduleWasUnpublished && module.courseId) {
                const publishedModules = await tx.module.findMany({
                    where: {
                        courseId: module.courseId,
                        isPublished: true,
                    },
                });

                if (publishedModules.length === 0) {
                    await tx.course.update({
                        where: { id: module.courseId },
                        data: { isPublished: false },
                    });
                }
            }

            return evaluation;
        });

        return NextResponse.json(result);
    } catch (error) {
        console.log("[EVALUATIONS]", error);
        return new NextResponse("Internal error", { status: 500 });
    }
}
