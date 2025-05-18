"use client"

import axios from 'axios';
import { Trash } from 'lucide-react';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';

import { Button } from '@/components/ui/button';
import { ConfirmModal } from '@/components/modals/confirm-modal';

interface ModuleActionsProps {
    disabled: boolean;
    courseId: string;
    moduleId: string;
    isPublished: boolean;
}

/**
 * Component for managing module actions.
 * Allows publishing, unpublishing, or deleting a module.
 */
export const ModuleActions = ({
    disabled,
    courseId,
    moduleId,
    isPublished
}: ModuleActionsProps) => {
    const router = useRouter();
    const [isLoading, setIsLoaded] = useState(false);

    const onClick = async () => {
        try {
            setIsLoaded(true);

            if (isPublished) {
                await axios.patch(`/api/courses/${courseId}/modules/${moduleId}/unpublish`);
                toast.success("Módulo despublicado exitosamente");
            } else {
                await axios.patch(`/api/courses/${courseId}/modules/${moduleId}/publish`);
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

            await axios.delete(`/api/courses/${courseId}/modules/${moduleId}`);
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