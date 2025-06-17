import { File } from 'lucide-react';
import { redirect } from 'next/navigation';

import { getModule } from '@/actions/get-module';
import { Banner } from '@/components/banner';
import { Separator } from '@/components/ui/separator';
import { auth } from '@clerk/nextjs/server';

import { CourseEnrollButton } from './_components/course-enroll-button';
import { VideoPlayerYoutube } from './_components/video-player-youtube';
import { EvaluationButton } from './_components/evaluation-button';
import { db } from '@/lib/db';

/**
 * Page component for displaying a specific module.
 */
export default async function ModuleIdPage({
                                               params,
                                           }: {
    params: Promise<{ evaluationId: string; moduleId: string; courseId: string }>;
}) {
    const { courseId, moduleId, evaluationId } = await params;
    const { userId, redirectToSignIn } = await auth();

    if (!userId) return redirectToSignIn();

    const {
        attachments,
        module,
        course,
        evaluation,
        registration,
        userProgress,
    } = await getModule({
        userId,
        courseId,
        moduleId,
        evaluationId,
    });

    if (!module || !course || !evaluation) return redirect('/');

    const isLocked = !module.isEnabled && !registration;

    // Get the story of the attempt
    const results = await db.evaluationResult.findMany({
        where: {
            evaluationId: evaluation.id,
            userId,
        },
        orderBy: { attempt: 'asc' },
    });

    // Transform results to the attempt format []
    const attemptsHistory = results.map((result) => ({
        attemptNumber: result.attempt,
        score: result.score,
        date: result.completedAt.toISOString(),
    }));

    // Calcular intento actual
    const lastAttempt = results.reduce((max, r) =>
        Math.max(max, r.attempt), 0
    );

    // Calculate better score
    const bestScore = results.reduce((max, r) =>
        Math.max(max, r.score), 0
    );

    // Verify if you already approved
    const hasCompleted = results.some(r => r.score >= 80);

    const maxAttempts = evaluation.maxAttempts ?? 0;

    return (
        <div className="flex flex-col pb-20 mx-auto max-w-7xl">
            {/* Banners */}
            <div className="w-full space-y-2">
                {userProgress?.isCompleted && (
                    <Banner label="Has completado este módulo" variant="success" />
                )}
                {isLocked && (
                    <Banner
                        label="Necesitas inscribirte en este curso para poder visualizarlo"
                        variant="warning"
                    />
                )}
            </div>

            {/* Layout en 2 columnas */}
            <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Video */}
                <div className="bg-white rounded-lg shadow-md p-4">
                    <VideoPlayerYoutube
                        videoUrl={module.videoUrl || ''}
                        title={module.title}
                        isLocked={isLocked}
                    />
                </div>

                {/* Title and description */}
                <div className="bg-white rounded-lg shadow-md p-4 flex flex-col justify-between">
                    <div>
                        <h2 className="text-3xl font-bold text-gray-800">{module.title}</h2>
                        <Separator className="my-4" />
                        <p>{module.description}</p>
                    </div>
                    {!registration && (
                        <div className="mt-6 pt-4 border-t border-gray-200">
                            <CourseEnrollButton courseId={courseId} price={course.price!} />
                        </div>
                    )}
                </div>

                {/* Resources */}
                {!!attachments.length && (
                    <div className="bg-white rounded-lg shadow-md p-4 md:col-span-1">
                        <h3 className="text-xl font-semibold mb-3 text-gray-700">Recursos del módulo</h3>
                        <Separator className="mb-4" />
                        <div className="space-y-3">
                            {attachments.map((attachment) => (
                                <a
                                    key={attachment.id}
                                    href={attachment.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-x-2 w-full p-3 border border-sky-300 rounded-md bg-sky-50 text-sky-700 hover:bg-sky-100 transition"
                                >
                                    <File className="w-5 h-5" />
                                    <p className="text-sm font-medium line-clamp-1">{attachment.name}</p>
                                </a>
                            ))}
                        </div>
                    </div>
                )}

                {/* Assessment */}
                {registration && (
                    <div className="bg-white rounded-lg shadow-md p-6 flex flex-col justify-between h-full md:col-span-1">
                        <div>
                            <h3 className="text-xl font-semibold mb-3 text-gray-700">Evaluación del módulo</h3>
                            <Separator className="mb-4" />
                        </div>
                        <div className="w-full">
                            <EvaluationButton
                                courseId={course.id}
                                moduleId={module.id}
                                evaluationId={evaluation.id}
                                attempt={lastAttempt}
                                maxAttempts={maxAttempts}
                                isCompleted={hasCompleted}
                                score={bestScore}
                            />
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

