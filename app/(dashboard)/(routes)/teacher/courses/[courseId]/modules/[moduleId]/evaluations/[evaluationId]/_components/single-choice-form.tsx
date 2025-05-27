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
import { Checkbox } from "@/components/ui/checkbox";
import { Loading } from "@/components/loading";

interface SingleChoiceFormProps {
    courseId: string;
    moduleId: string;
    evaluationId: string;
}

const answerSchema = z.object({
    title: z.string().min(1, "La respuesta no puede estar vacía"),
    isCorrect: z.boolean(),
});

const formSchema = z.object({
    question: z.string().min(5, "La pregunta debe tener al menos 5 caracteres"),
    answers: z
        .array(answerSchema)
        .min(2, "Debes ingresar al menos dos respuestas")
        .refine(
            (answers) => answers.filter((a) => a.isCorrect).length === 1,
            {
                message: "Debe haber exactamente una respuesta correcta",
            }
        ),
});


export const SingleChoiceForm = ({
                                            courseId,
                                            moduleId,
                                            evaluationId,
                                        }: SingleChoiceFormProps) => {
    const [isCreating, setIsCreating] = useState(false);
    const router = useRouter();

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            question: "",
            answers: [
                { title: "", isCorrect: false },
                { title: "", isCorrect: false },
            ],
        },
    });

    const { isSubmitting, isValid } = form.formState;

    const { fields, append, remove } = useFieldArray({
        control: form.control,
        name: "answers",
    });

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            await axios.post(
                `/api/courses/${courseId}/modules/${moduleId}/evaluations/${evaluationId}/questions`,
                {
                    title: values.question,
                    answers: values.answers,
                }
            );
            toast.success("Pregunta agregada");
            form.reset();
            router.refresh();
        } catch {
            toast.error("Error al guardar la pregunta");
        }
    };

    return (
        <div className="mt-6 border bg-slate-100 rounded-md p-4">
            <div className="font-medium flex items-center justify-between">
                Agregar una nueva pregunta
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
                                        <Input placeholder="p.ej. '¿Cuál es la función del sensor?'" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <div className="space-y-2">
                            <FormLabel>Respuestas</FormLabel>
                            {fields.map((field, index) => (
                                <div key={field.id} className="flex items-center gap-2">
                                    <FormField
                                        control={form.control}
                                        name={`answers.${index}.title`}
                                        render={({ field }) => (
                                            <FormItem className="flex-1">
                                                <FormControl>
                                                    <Input placeholder={`Respuesta ${index + 1}`} {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name={`answers.${index}.isCorrect`}
                                        render={({ field }) => (
                                            <FormItem className="flex items-center gap-1">
                                                <FormControl>
                                                    <Checkbox
                                                        checked={field.value}
                                                        onCheckedChange={(checked) => {
                                                            const isChecked = checked === true;
                                                            const currentAnswers = form.getValues("answers");
                                                            const updatedAnswers = currentAnswers.map((answer, i) => ({
                                                                ...answer,
                                                                isCorrect: i === index ? isChecked : false,
                                                            }));
                                                            form.setValue("answers", updatedAnswers);
                                                        }}
                                                    />
                                                </FormControl>
                                                <FormLabel>Correcta</FormLabel>
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
                                onClick={() => append({ title: "", isCorrect: false })}
                            >
                                Añadir respuesta
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
