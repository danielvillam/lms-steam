'use client';

import axios from 'axios';
import { useState } from 'react';
import toast from 'react-hot-toast';

import { Button } from '@/components/ui/button';
import { formatPrice } from '@/lib/format';

interface CourseEnrollButtonProps {
    price: number;
    courseId: string;
}

/**
 * Button to enroll in a course.
 */
const CourseEnrollButton = ({ courseId, price }: CourseEnrollButtonProps) => {
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const onClick = async () => {
        try {
            setIsLoading(true);

            await axios.post(`/api/courses/${courseId}/enroll`);
            toast.success('Inscrito exitosamente');
            window.location.reload();
        } catch {
            toast.error('Algo salió mal');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Button
            onClick={onClick}
            disabled={isLoading}
            size="sm"
            className="w-full md:w-auto"
        >
            Inscribirse por {formatPrice(price)}
        </Button>
    );
};

export { CourseEnrollButton };