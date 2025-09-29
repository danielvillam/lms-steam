"use client";

import * as z from "zod";
import axios from "axios";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { Pencil } from "lucide-react";

import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormMessage,
} from '@/components/ui/form';
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Combobox } from "@/components/ui/combobox";
import { Loading } from "@/components/loading";
import { EvaluationType } from "@prisma/client";

interface EvaluationsFormProps {
    initialData: { id: string; type: EvaluationType | null };
    courseId: string;
    moduleId: string;
    evaluationTypes: { label: string; value: EvaluationType }[];
}

/**
 * A form component to manage the module's evaluation type.
 */
const formSchema = z.object({
    type: z.nativeEnum(EvaluationType),
});

export const TypeForm = ({
                                    initialData,
                                    courseId,
                                    moduleId,
                                    evaluationTypes
                                }: EvaluationsFormProps) => {
    const [isEditing, setIsEditing] = useState(false);

    const toggleEdit = () => setIsEditing((current) => !current);

    const router = useRouter();

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            type: initialData?.type || undefined,
        },
    });

    const { isSubmitting, isValid } = form.formState;

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            await axios.post(`/api/courses/${courseId}/modules/${moduleId}/evaluations/${initialData.id}`, values);
            toast.success("Evaluación guardada");
            toggleEdit();
            router.refresh();
        } catch {
            toast.error("Error al guardar la evaluación");
        }
    };

    const selectedOption = evaluationTypes.find(
        (evaluationType) => evaluationType.value === initialData.type
    );

    const watchedType = form.watch("type");

    return (
        <div className="mt-6 border bg-slate-100 rounded-md p-4">
            <div className="font-medium flex items-center justify-between">
                Evaluación del módulo
                <Button onClick={toggleEdit} variant="ghost">
                    {isEditing ? (
                        <>Cancelar</>
                    ) : (
                        <>
                            <Pencil className="h-4 w-4 mr-2" />
                            Editar evaluación
                        </>
                    )}
                </Button>
            </div>
            {!isEditing && (
                <p
                    className={cn(
                        "text-sm mt-2",
                        !initialData.type && "text-slate-500 italic"
                    )}
                >
                    {selectedOption?.label || "Sin evaluación"}
                </p>
            )}
            {isEditing && (
                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className="space-y-4 mt-4"
                    >
                        <FormField
                            control={form.control}
                            name="type"
                            render={({ field }) => (
                                <FormItem>
                                    <FormControl>
                                        <Combobox
                                            options={evaluationTypes}
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <div className="flex items-center text-sm gap-x-2">
                            <span>Cambiar el tipo de evaluación eliminará todas las preguntas y respuestas actuales.</span>
                        </div>
                        <div className="flex items-center gap-x-2">
                            <Button
                                disabled={
                                    !isValid || isSubmitting || watchedType === initialData.type
                                }
                                type="submit"
                            >
                                {isSubmitting && <Loading />}
                                Guardar
                            </Button>

                        </div>
                    </form>
                </Form>
            )}
        </div>
    );
};
