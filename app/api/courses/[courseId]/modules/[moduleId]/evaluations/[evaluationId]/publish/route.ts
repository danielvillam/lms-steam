import { auth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

import { db } from '@/lib/db';

/**
 * PATCH Request Handler for Publishing an Evaluation in a Module.
 *
 * This function handles PATCH requests to publish an evaluation in a module.
 */
export async function PATCH(
    req: Request,
    props: {
        params: Promise<{ evaluationId: string, moduleId: string; courseId: string }>;
    }
) {
    try {
        const params = await props.params;
        const { userId } = await auth();

        if (!userId) {
            return new NextResponse('Unauthorized', { status: 401 });
        }

        const evaluation = await db.evaluation.findUnique({
            where: {
                moduleId: params.moduleId,
                id: params.evaluationId,
            },
            include: {
                questions: {
                    include: {
                        answers: true,
                    },
                },
            },
        });

        if (!evaluation || !evaluation.type || evaluation.questions.length === 0) {
            return new NextResponse('Faltan campos obligatorios', { status: 400 });
        }

        const allQuestionsHaveCorrectAnswer = evaluation.questions.every((question) =>
            question.answers.some((answer) => answer.isCorrect)
        );

        if (!allQuestionsHaveCorrectAnswer) {
            return new NextResponse('Cada pregunta debe tener al menos una respuesta correcta', { status: 400 });
        }

        const publishedEvaluation = await db.evaluation.update({
            data: {
                isPublished: true,
            },
            where: {
                moduleId: params.moduleId,
                id: params.evaluationId,
            }
        });

        return NextResponse.json(publishedEvaluation);
    } catch (error) {
        console.log('[EVALUATION_PUBLISH]', error);
        return new NextResponse('Internal Error', { status: 500 });
    }
}