import { File } from 'lucide-react';
import { redirect } from 'next/navigation';

import { getModule } from '@/actions/get-module';
import { Banner } from '@/components/banner';
import { Preview } from '@/components/preview';
import { Separator } from '@/components/ui/separator';
import { auth } from '@clerk/nextjs/server';
import { CourseEnrollButton } from './_components/course-enroll-button';
import { CourseProgressButton } from './_components/course-progress-button';
import { VideoPlayerYoutube } from './_components/video-player-youtube';

/**
 * Page component for displaying a specific module.
 */
export default async function ModuleIdPage(
    props: {
        params: Promise<{ moduleId: string; courseId: string }>;
    }
) {
    const params = await props.params;
    const { userId, redirectToSignIn } = await auth()

    if (!userId) return redirectToSignIn()
    const {
        attachments,
        module,
        course,
        nextModule,
        registration,
        userProgress,
    } = await getModule({
        userId,
        courseId: params.courseId,
        moduleId: params.moduleId,
    });

    if (!module || !course) {
        return redirect('/');
    }

    const isLocked = !module.isEnabled && !registration;
    return (
        <div>
            {userProgress?.isCompleted && (
                <Banner label="Has completado este módulo" variant="success" />
            )}
            {isLocked && (
                <Banner
                    label="Necesitas inscribirte en este curso para poder visualizarlo"
                    variant="warning"
                />
            )}
            <div className="flex flex-col max-w-4xl pb-20 mx-auto">
                <div className="p-4">
                    <VideoPlayerYoutube
                        videoUrl={module.videoUrl || ""}
                        title={module.title}
                        isLocked={isLocked}
                    />
                </div>
                <div>
                    <div className="flex flex-col items-center justify-between p-4 md:flex-row">
                        <h2 className="mb-2 text-2xl font-semibold">{module.title}</h2>
                        {registration ? (
                            <CourseProgressButton
                                moduleId={params.moduleId}
                                courseId={params.courseId}
                                nextModuleId={nextModule?.id}
                                isCompleted={!!userProgress?.isCompleted}
                            />
                        ) : (
                            <CourseEnrollButton
                                courseId={params.courseId}
                                price={course.price!}
                            />
                        )}
                    </div>
                    <Separator />
                    <div>
                        <Preview value={module.description!} />
                    </div>
                    {!!attachments.length && (
                        <>
                            <Separator />
                            <div className="p-4">
                                {attachments.map((attachment) => (
                                    <a
                                        href={attachment.url}
                                        target="_blank"
                                        key={attachment.id}
                                        className="flex items-center w-full p-3 border rounded-md bg-sky-200 text-sky-700 hover:underline"
                                    >
                                        <File />
                                        <p className="line-clamp-1">{attachment.name}</p>
                                    </a>
                                ))}
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}