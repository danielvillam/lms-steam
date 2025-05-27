"use client";

import * as z from "zod";
import axios from "axios";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loading } from "@/components/loading";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";

interface OpenQuestionFormProps {
    courseId: string;
    moduleId: string;
    evaluationId: string;
}

const formSchema = z.object({
    question: z.string().min(5, "La pregunta debe tener al menos 5 caracteres"),
    expectedAnswer: z.string().min(1, "La respuesta correcta no puede estar vacía"),
});

export const OpenQuestionForm = ({
                                     courseId,
                                     moduleId,
                                     evaluationId,
                                 }: OpenQuestionFormProps) => {
    const [isCreating, setIsCreating] = useState(false);
    const router = useRouter();

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            question: "",
            expectedAnswer: "",
        },
    });

    const { isSubmitting, isValid } = form.formState;

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            await axios.post(
                `/api/courses/${courseId}/modules/${moduleId}/evaluations/${evaluationId}/questions`,
                {
                    title: values.question,
                    answers: [
                        {
                            title: values.expectedAnswer,
                            isCorrect: true,
                        },
                    ],
                }
            );
            toast.success("Pregunta abierta agregada");
            form.reset();
            router.refresh();
        } catch {
            toast.error("Error al guardar la pregunta");
        }
    };

    return (
        <div className="mt-6 border bg-slate-100 rounded-md p-4">
            <div className="font-medium flex items-center justify-between">
                Agregar una nueva pregunta abierta
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
                                        <Input
                                            placeholder="p.ej. '¿Cuál es la función del sensor?'"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="expectedAnswer"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Respuesta correcta esperada</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="p.ej. 'Detectar temperatura y humedad'"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

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
