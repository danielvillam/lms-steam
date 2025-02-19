"use client"

import axios from 'axios';
import { Trash } from 'lucide-react';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';

import { Button } from '@/components/ui/button';
import { ConfirmModal } from '@/components/modals/confirm-modal';

interface ChapterActionsProps {
    disabled: boolean;
    courseId: string;
    chapterId: string;
    isPublished: boolean;
}

/**
 * Component for managing chapter actions.
 * Allows publishing, unpublishing, or deleting a chapter.
 */
export const ChapterActions = ({
    disabled,
    courseId,
    chapterId,
    isPublished
}: ChapterActionsProps) => {
    const router = useRouter();
    const [isLoading, setIsLoaded] = useState(false);

    const onClick = async () => {
        try {
            setIsLoaded(true);

            if (isPublished) {
                await axios.patch(`/api/courses/${courseId}/chapters/${chapterId}/unpublish`);
                toast.success("Módulo despublicado exitosamente");
            } else {
                await axios.patch(`/api/courses/${courseId}/chapters/${chapterId}/publish`);
                toast.success("Módulo publicado exitosamente");
            }

            router.refresh();
        } catch {
            toast.error("Algo salió mal")
        } finally {
            setIsLoaded(false);
        }
    }

    const onDelete = async () => {
        try{
            setIsLoaded(true);

            await axios.delete(`/api/courses/${courseId}/chapters/${chapterId}`);
            toast.success("Módulo eliminado exitosamente");
            router.refresh();
            router.push(`/teacher/courses/${courseId}`);
        } catch {
            toast.error("Algo salió mal");
        } finally {
            setIsLoaded(false);
        }
    }

    return (
        <div className={"flex items-center gap-x-2"}>
            <Button
                onClick={onClick}
                disabled={disabled || isLoading}
                variant="outline"
                size="sm"
            >
                {isPublished ? "Despublicar" : "Publicar"}
            </Button>
            <ConfirmModal onConfirm={onDelete}>
                <Button size="sm" disabled={isLoading}>
                    <Trash className="h-4 w-4"/>
                </Button>
            </ConfirmModal>
        </div>
    )
}