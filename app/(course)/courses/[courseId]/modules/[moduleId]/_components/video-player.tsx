'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import MuxPlayer from '@mux/mux-player-react';
import axios from 'axios';
import { Loader2, Lock } from 'lucide-react';
import toast from 'react-hot-toast';

import { cn } from '@/lib/utils';

interface VideoPlayerProps {
    playbackId: string;
    courseId: string;
    moduleId: string;
    nextModuleId?: string;
    isLocked: boolean;
    completeOnEnd: boolean;
    title: string;
}

/**
 * Video player component for course modules.
 */
const VideoPlayer = ({
                         moduleId,
                         completeOnEnd,
                         courseId,
                         isLocked,
                         playbackId,
                         title,
                         nextModuleId,
                     }: VideoPlayerProps) => {
    const router = useRouter();

    const [isReady, setIsReady] = useState<boolean>(false);

    const onEnd = async () => {
        try {
            if (completeOnEnd) {
                await axios.put(
                    `/api/courses/${courseId}/modules/${moduleId}/progress`,
                    {
                        isCompleted: true,
                    }
                );
                if (!nextModuleId) {
                    toast.success('Curso finalizado');
                }
                toast.success('Progreso actualizado');
                router.refresh();
                if (nextModuleId) {
                    router.push(`/courses/${courseId}/modules/${nextModuleId}`);
                }
            }
        } catch (error) {
            toast.error('Algo salió mal');
        }
    };

    return (
        <div className="relative aspect-video">
            {!isReady && !isLocked && (
                <div className="absolute inset-0 flex items-center justify-center bg-slate-800">
                    <Loader2 className="w-8 h-8 animate-spin text-secondary" />
                </div>
            )}
            {isLocked && (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-800 gap-y-2 text-secondary">
                    <Lock className="w-8 h-8" />
                    <p className="text-sm">Este módulo está bloqueado</p>
                </div>
            )}
            {!isLocked && (
                <MuxPlayer
                    title={title}
                    className={cn(!isReady && 'hidden')}
                    onCanPlay={() => setIsReady(true)}
                    onEnded={onEnd}
                    autoPlay
                    playbackId={playbackId}
                />
            )}
        </div>
    );
};

export { VideoPlayer };