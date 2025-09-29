"use client";

import * as z from "zod";
import axios from "axios";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useFieldArray } from "react-hook-form";
import { useState } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Loading } from "@/components/loading";

interface SequenceChoiceFormProps {
    courseId: string;
    moduleId: string;
    evaluationId: string;
}

/**
 * A form component to manage sequence-choice evaluations
 */
//TODO: The answers are all saved as (isCorrect = true) and the sequence is evaluated in the order in which they are saved. Is this correct?

// Cada paso tendrá un título y un orden
const stepSchema = z.object({
    title: z.string().min(1, "El paso no puede estar vacío"),
    order: z.number().int().min(1, "El orden debe ser mayor a 0"),
});

const formSchema = z.object({
    question: z.string().min(5, "La pregunta debe tener al menos 5 caracteres"),
    steps: z.array(stepSchema).min(2, "Debes ingresar al menos dos pasos"),
});

export const SequenceChoiceForm = ({
                                       courseId,
                                       moduleId,
                                       evaluationId,
                                   }: SequenceChoiceFormProps) => {
    const [isCreating, setIsCreating] = useState(false);
    const router = useRouter();

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            question: "",
            steps: [
                { title: "", order: 1 },
                { title: "", order: 2 },
            ],
        },
    });

    const { isSubmitting, isValid } = form.formState;
    const { fields, append, remove } = useFieldArray({
        control: form.control,
        name: "steps",
    });

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            // Ordenamos los pasos por su orden antes de enviarlos
            const orderedSteps = values.steps
                .sort((a, b) => a.order - b.order)
                .map((step) => ({
                    title: step.title,
                    order: step.order,
                    isCorrect: true, // <- Aquí marcamos todos los pasos como correctos
                }));

            await axios.post(
                `/api/courses/${courseId}/modules/${moduleId}/evaluations/${evaluationId}/questions`,
                {
                    title: values.question,
                    answers: orderedSteps,
                }
            );

            toast.success("Pregunta de secuencia agregada");
            form.reset();
            router.refresh();
        } catch {
            toast.error("Error al guardar la pregunta");
        }
    };

    return (
        <div className="mt-6 border bg-slate-100 rounded-md p-4">
            <div className="font-medium flex items-center justify-between">
                Agregar pregunta de secuencia
                <Button onClick={() => setIsCreating(!isCreating)} variant="ghost">
                    {isCreating ? "Cancelar" : "Agregar"}
                </Button>
            </div>

            {isCreating && (
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 mt-4">
                        <FormField
                            control={form.control}
                            name="question"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Enunciado de la pregunta</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Describe la secuencia correcta" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <div className="space-y-2">
                            <FormLabel>Pasos</FormLabel>
                            {fields.map((field, index) => (
                                <div key={field.id} className="flex gap-2 items-center">
                                    <FormField
                                        control={form.control}
                                        name={`steps.${index}.title`}
                                        render={({ field }) => (
                                            <FormItem className="flex-1">
                                                <FormControl>
                                                    <Input placeholder={`Paso ${index + 1}`} {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name={`steps.${index}.order`}
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormControl>
                                                    <Input
                                                        type="number"
                                                        placeholder="Orden"
                                                        value={field.value}
                                                        onChange={(e) => field.onChange(Number(e.target.value))}
                                                        className="w-20"
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        onClick={() => remove(index)}
                                    >
                                        Eliminar
                                    </Button>
                                </div>
                            ))}
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => append({ title: "", order: fields.length + 1 })}
                            >
                                Añadir paso
                            </Button>
                        </div>

                        <Button type="submit" disabled={!isValid || isSubmitting}>
                            {isSubmitting && <Loading />}
                            Guardar
                        </Button>
                    </form>
                </Form>
            )}
        </div>
    );
};
