"use client";

import { Clapperboard } from "lucide-react";
import { Chapter } from "@prisma/client";

interface ChapterVideoYoutubeFormProps {
    initialData: Chapter;
}

// Check that the video link is valid (in this case only YouTube links will be allowed)
const getEmbedUrl = (url: string | null): string | undefined => {
    if (!url || !url.includes("youtube.com")) return undefined;
    const videoId = url.split("v=")[1]?.split("&")[0];
    return videoId ? `https://www.youtube.com/embed/${videoId}` : undefined;
};

/**
 * A form for viewing a chapter's video.
 */
export const ChapterVideoYoutubeForm = ({
                                     initialData,
                                 }: ChapterVideoYoutubeFormProps) => {

    return (
        <div>
            <div className="mt-6 border bg-slate-100 rounded-md p-4">
                <div className="font-medium flex items-center justify-between">
                    Vista previa del video
                </div>
                {initialData.videoUrl ? (
                    <div className="relative aspect-video mt-2">
                        <iframe width="800" height="315"
                                className="w-full h-full rounded-lg"
                                src={getEmbedUrl(initialData.videoUrl)}
                                title="YouTube video player"
                                frameBorder="0"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                referrerPolicy="strict-origin-when-cross-origin"
                                allowFullScreen
                        />
                    </div>
                ) : (
                    <div className="flex items-center justify-center h-60 bg-slate-200 rounded-md">
                    <Clapperboard className="h-10 w-10 text-slate-500" />
                </div>
                )}
            </div>
        </div>
    );
};
