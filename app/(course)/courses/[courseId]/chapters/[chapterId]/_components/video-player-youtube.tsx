'use client';

import { LayoutDashboard, Loader2, Lock } from 'lucide-react';
import { IconBadge } from '@/components/icon-badge';

interface VideoPlayerProps {
    videoUrl: string;
    isLocked: boolean;
    title: string;
}

// Check that the video link is valid (in this case only YouTube links will be allowed)
const getEmbedUrl = (url: string | null): string | undefined => {
    if (!url || !url.includes("youtube.com")) return undefined;
    const videoId = url.split("v=")[1]?.split("&")[0];
    return videoId ? `https://www.youtube.com/embed/${videoId}` : undefined;
};

/**
 * Video player YouTube component for course chapters.
 */
const VideoPlayerYoutube = ({
                         isLocked,
                         videoUrl,
                         title,
                     }: VideoPlayerProps) => {

    return (
        <div className="relative aspect-video">
            {isLocked && (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-800 gap-y-2 text-secondary">
                    <Lock className="w-8 h-8" />
                    <p className="text-sm">Este módulo está bloqueado</p>
                </div>
            )}
            {!isLocked && (
                <div>
                    <div className="flex items-center gap-x-2">
                        <IconBadge icon={LayoutDashboard} />
                        <h2 className="text-xl">Video del módulo "{title}"</h2>
                    </div>
                    <div className="relative aspect-video mt-2">
                        <iframe
                            className="w-full h-full rounded-lg"
                            src={getEmbedUrl(videoUrl)}
                            title={title}
                            frameBorder="0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                            referrerPolicy="strict-origin-when-cross-origin"
                            allowFullScreen
                        />
                    </div>
                </div>
)}
        </div>
    );
};

export { VideoPlayerYoutube };