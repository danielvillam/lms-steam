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
import { Evaluation, EvaluationType } from '@prisma/client';
import { Badge } from '@/components/ui/badge';

interface EvaluationsFormProps {
    initialData: { id: string; type: EvaluationType | null };
    courseId: string;
    moduleId: string;
    evaluation: Evaluation | null;
    evaluationTypes: { label: string; value: EvaluationType }[];
}

/**
 * A form component for managing the module's assessment methodology. Allows users to view and edit the module's assessment methodology.
 * Includes a combo box for selecting a methodology from the available options and a button for toggling between editing and viewing.
 */
const formSchema = z.object({
    type: z.nativeEnum(EvaluationType),
});

export const EvaluationsForm = ({
                                    initialData,
                                    courseId,
                                    moduleId,
                                    evaluation,
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
            await axios.post(`/api/courses/${courseId}/modules/${moduleId}/evaluations`, values);
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

    const handleEdit = () => {
        router.push(`/teacher/courses/${courseId}/modules/${moduleId}/evaluations/${initialData.id}`);
    };

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
                <div className="flex items-center justify-between mt-2">
                    <p
                        className={cn(
                            "text-sm",
                            !initialData.type && "text-slate-500 italic"
                        )}
                    >
                        {selectedOption?.label || "Sin evaluación"}
                    </p>
                    {initialData.type && (
                        <div className="flex items-center gap-x-2">
                            <Badge
                                className={cn(
                                    "bg-slate-500",
                                    evaluation?.isPublished && "bg-sky-700"
                                )}
                            >
                                {evaluation?.isPublished ? "Publicado" : "Borrador"}
                            </Badge>
                        </div>
                    )}
                </div>
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

                        <div className="flex items-center gap-x-2">
                            {initialData.id && (
                                <Button
                                    type="button"
                                    onClick={handleEdit}
                                    disabled={!isValid || isSubmitting}
                                >
                                    Editar método de evaluación
                                </Button>
                            )}
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
