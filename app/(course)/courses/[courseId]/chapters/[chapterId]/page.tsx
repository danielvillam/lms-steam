import { File } from 'lucide-react';
import { redirect } from 'next/navigation';

import { getChapter } from '@/actions/get-chapter';
import { Banner } from '@/components/banner';
import { Preview } from '@/components/preview';
import { Separator } from '@/components/ui/separator';
import { auth } from '@clerk/nextjs/server';
import { CourseEnrollButton } from './_components/course-enroll-button';
import { CourseProgressButton } from './_components/course-progress-button';
import { VideoPlayerYoutube } from './_components/video-player-youtube';

/**
 * Page component for displaying a specific chapter.
 */
export default async function ChapterIdPage(
    props: {
        params: Promise<{ chapterId: string; courseId: string }>;
    }
) {
    const params = await props.params;
    const { userId, redirectToSignIn } = await auth()

    if (!userId) return redirectToSignIn()
    const {
        attachments,
        chapter,
        course,
        nextChapter,
        registration,
        userProgress,
    } = await getChapter({
        userId,
        courseId: params.courseId,
        chapterId: params.chapterId,
    });

    if (!chapter || !course) {
        return redirect('/');
    }

    const isLocked = !chapter.isEnabled && !registration;
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
                        videoUrl={chapter.videoUrl || ""}
                        title={chapter.title}
                        isLocked={isLocked}
                    />
                </div>
                <div>
                    <div className="flex flex-col items-center justify-between p-4 md:flex-row">
                        <h2 className="mb-2 text-2xl font-semibold">{chapter.title}</h2>
                        {registration ? (
                            <CourseProgressButton
                                chapterId={params.chapterId}
                                courseId={params.courseId}
                                nextChapterId={nextChapter?.id}
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
                        <Preview value={chapter.description!} />
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