'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { Course } from '@prisma/client';
import axios from 'axios';
import { Pencil } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { FC, useState } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import * as z from 'zod';

import { Loading } from '@/components/loading';
import { Button } from '@/components/ui/button';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { formatPrice } from '@/lib/format';
import { cn } from '@/lib/utils';

interface PriceFormProps {
    initialData: Course;
    courseId: string;
}

const formSchema = z.object({
    price: z.coerce.number(),
});

const PriceForm: FC<PriceFormProps> = ({ courseId, initialData }) => {
    const router = useRouter();
    const [isEditing, setIsEditing] = useState<boolean>(false);

    const toggleEdit = () => setIsEditing((prev) => !prev);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            price: initialData.price ?? 0,
        },
    });

    const { isSubmitting, isValid } = form.formState;

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            await axios.patch(`/api/courses/${courseId}`, values);
            toast.success('Curso actualizado');
            toggleEdit();
            router.refresh();
        } catch {
            toast.error('Algo salió mal');
        }
    };

    return (
        <div className="p-4 mt-6 border rounded-md bg-slate-100">
            <div className="flex items-center justify-between font-medium">
                Precio del curso
                <Button variant="ghost" type="button" onClick={toggleEdit}>
                    {isEditing ? (
                        'Cancelar'
                    ) : (
                        <>
                            <Pencil className="w-4 h-4 mr-2" />
                            Editar precio
                        </>
                    )}
                </Button>
            </div>
            {isEditing ? (
                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className="mt-4 space-y-4"
                    >
                        <FormField
                            control={form.control}
                            name="price"
                            render={({ field }) => (
                                <FormItem>
                                    <FormControl>
                                        <Input
                                            type="number"
                                            step="1"
                                            min="0"
                                            disabled={isSubmitting}
                                            placeholder="Establece un precio para tu curso"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <div className="flex items-center gap-x-2">
                            <Button disabled={!isValid || isSubmitting} type="submit">
                                {isSubmitting && <Loading />}
                                Guardar
                            </Button>
                        </div>
                    </form>
                </Form>
            ) : (
                <p
                    className={cn(
                        'text-sm mt-2',
                        !initialData.price && 'text-slate-500 italic'
                    )}
                >
                    {initialData.price === null || initialData.price === undefined
                        ? 'Sin precio'
                        : initialData.price === 0
                            ? 'Gratis'
                            : formatPrice(initialData.price)}

                </p>
            )}
        </div>
    );
};

export { PriceForm };