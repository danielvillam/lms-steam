"use client"

import axios from 'axios';
import { Trash } from 'lucide-react';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';

import { Button } from '@/components/ui/button';
import { ConfirmModal } from '@/components/modals/confirm-modal';

interface ActionsProps {
    disabled: boolean;
    courseId: string;
    isPublished: boolean;
}

export const Actions = ({
    disabled,
    courseId,
    isPublished
}: ActionsProps) => {
    const router = useRouter();
    const [isLoading, setIsLoaded] = useState(false);

    const onClick = async () => {
        try {
            setIsLoaded(true);

            if (isPublished) {
                await axios.patch(`/api/courses/${courseId}/unpublish`);
                toast.success("Curso despublicado exitosamente");
            } else {
                await axios.patch(`/api/courses/${courseId}/publish`);
                toast.success("Curso publicado exitosamente");
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

            await axios.delete(`/api/courses/${courseId}`);
            toast.success("Curso eliminado exitosamente");
            router.refresh();
            router.push(`/teacher/courses`);
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