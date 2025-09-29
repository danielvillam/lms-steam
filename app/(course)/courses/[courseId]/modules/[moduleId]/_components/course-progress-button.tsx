'use client';

import axios from 'axios';
import { CheckCircle, XCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import toast from 'react-hot-toast';

import { Button } from '@/components/ui/button';

interface CourseProgressButtonProps {
    moduleId: string;
    courseId: string;
    isCompleted?: boolean;
    nextModuleId?: string;
}

/**
 * Button to mark a module as completed or incomplete.
 */
export const CourseProgressButton = ({
                                         moduleId,
                                         courseId,
                                         isCompleted,
                                         nextModuleId,
                                     }: CourseProgressButtonProps) => {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);

    const onClick = async () => {
        try {
            setIsLoading(true);

            await axios.put(
                `/api/courses/${courseId}/modules/${moduleId}/progress`,
                {
                    isCompleted: !isCompleted,
                }
            );

            if (!isCompleted && nextModuleId) {
                router.push(`/courses/${courseId}/modules/${nextModuleId}`);
            }

            toast.success('Progreso actualizado');
            router.refresh();
        } catch {
            toast.error('Algo salió mal');
        } finally {
            setIsLoading(false);
        }
    };

    const Icon = isCompleted ? XCircle : CheckCircle;

    return (
        <Button
            onClick={onClick}
            disabled={isLoading}
            type="button"
            variant={isCompleted ? 'outline' : 'success'}
            className="w-full md:w-auto"
        >
            {isCompleted ? 'No completado' : 'Marcar como completo'}
            <Icon className="w-4 h-4 ml-2" />
        </Button>
    );
};