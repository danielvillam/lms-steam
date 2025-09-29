import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { EvaluationForm } from "./_components/evaluation-form";
import { InformationForm } from './_components/information-form';
import { getModule } from '@/actions/get-module';

/**
 * Evaluation page for a specific course module.
 *
 * - Verify user authentication using Clerk.
 * - Get the published evaluation and its questions from the database.
 */
export default async function EvaluationPage({
                                                 params,
                                             }: {
    params: Promise<{ courseId: string; moduleId: string }>;
}) {
    const { courseId, moduleId } = await params;
    const { userId, redirectToSignIn } = await auth();
    if (!userId) return redirectToSignIn();

    // Obtain published evaluation
    const evaluation = await db.evaluation.findFirst({
        where: {
            moduleId,
            isPublished: true,
        },
        include: {
            questions: {
                include: { answers: true },
            },
        },
    });

    if (!evaluation) {
        return redirect(`/courses/${courseId}/modules/${moduleId}`);
    }

    // Obtain NextModule to send it to the evaluation
    const {
        nextModule
    } = await getModule({
        userId,
        courseId,
        moduleId,
        evaluationId: evaluation.id,
    });

    // Get attempt history
    const results = await db.evaluationResult.findMany({
        where: {
            evaluationId: evaluation.id,
            userId
        },
        orderBy: { attempt: "asc" },
    });

    // Transform results to the attempt format []
    const attemptsHistory = results.map((result) => ({
        attemptNumber: result.attempt,
        score: result.score,
        date: result.completedAt.toISOString(),
    }));

    // Calculate current attempt
    const lastAttempt = results.reduce((max, r) =>
        Math.max(max, r.attempt), 0
    );

    // Calculate better score
    const bestScore = results.reduce((max, r) =>
        Math.max(max, r.score), 0
    );

    return (
        <div className="max-w-2xl mx-auto p-6">
            <InformationForm
                attempt={lastAttempt}
                questions={evaluation.questions.length}
                maxAttempts={evaluation.maxAttempts || 0}
            />
            <EvaluationForm
                courseId={courseId}
                moduleId={moduleId}
                evaluationId={evaluation.id}
                evaluationType={evaluation.type}
                questions={evaluation.questions}
                nextModuleId={nextModule?.id}
                maxAttempts={evaluation.maxAttempts || 0}
                attempt={lastAttempt}
                score={bestScore}
                attemptsHistory={attemptsHistory}
            />
        </div>
    );
}
