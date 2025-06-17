import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function POST(
    req: Request,
    props: {
        params: Promise<{ evaluationId: string }>;
    }
) {
    try {
        const { evaluationId } = await props.params;
        const { userId } = await auth();

        if (!userId) return new NextResponse("Unauthorized", { status: 401 });

        const { selectedAnswers, score } = await req.json();

        // Basic validation
        if (!Array.isArray(selectedAnswers) || typeof score !== "number") {
            return new NextResponse("Datos inválidos", { status: 400 });
        }

        // Number of previous attempts
        const previousAttempts = await db.evaluationResult.count({
            where: { userId, evaluationId },
        });

        const attempt = previousAttempts + 1;

        // Transaction to record results and answers
        const evaluationResult = await db.$transaction(async (tx) => {
            const result = await tx.evaluationResult.create({
                data: {
                    userId,
                    evaluationId,
                    attempt,
                    score,
                    completedAt: new Date(),
                },
            });

            // Associate responses selected to the result
            await tx.selectedAnswer.createMany({
                data: selectedAnswers.map((answer: any) => ({
                    title: answer.title,
                    questionId: answer.questionId,
                    isCorrect: answer.isCorrect,
                    evaluationResultId: result.id,
                })),
            });

            return result;
        });

        return NextResponse.json(evaluationResult);
    } catch (error) {
        console.error("[EVALUATION_RESULT_ERROR]", error);
        return new NextResponse("Internal server error", { status: 500 });
    }
}
