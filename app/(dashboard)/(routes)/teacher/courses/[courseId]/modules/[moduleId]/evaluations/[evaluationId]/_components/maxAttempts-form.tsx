"use client";

import * as z from "zod";
import axios from "axios";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Pencil } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from '@/lib/utils';

interface MaxAttemptsFormProps {
    initialData: {
        id: string;
        maxAttempts: number | null;
    };
    courseId: string;
    moduleId: string;
}

/**
 * A form component to manage maximum attempts
 */
const formSchema = z.object({
    maxAttempts: z
        .number({
            required_error: "Este campo es obligatorio",
            invalid_type_error: "Debe ser un número",
        })
        .min(1, "Debe ser al menos 1")
        .max(10, "No puede ser mayor a 10"),
});

export const MaxAttemptsForm = ({
                                    initialData,
                                    courseId,
                                    moduleId,
                                }: MaxAttemptsFormProps) => {
    const [isEditing, setIsEditing] = useState(false);

    const toggleEdit = () => setIsEditing((current) => !current);

    const router = useRouter();

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            maxAttempts: initialData?.maxAttempts || undefined,
        },
    });

    const { isSubmitting, isValid } = form.formState;

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            await axios.post(`/api/courses/${courseId}/modules/${moduleId}/evaluations/${initialData.id}`, values);
            toast.success("Intentos máximos actualizados");
            toggleEdit();
            router.refresh();
        } catch {
            toast.error("Algo salió mal");
        }
    };

    return (
        <div className="mt-6 border bg-slate-100 rounded-md p-4">
            <div className="font-medium flex items-center justify-between">
                Intentos máximos
                <Button onClick={toggleEdit} variant="ghost">
                    {isEditing ? (
                        <>Cancelar</>
                    ) : (
                        <>
                            <Pencil className="h-4 w-4 mr-2" />
                            Editar intentos
                        </>
                    )}
                </Button>
            </div>
            {!isEditing && (
            <p
                className={cn(
                    "text-sm mt-2",
                    !initialData.maxAttempts && "text-slate-500 italic"
                )}
            >
                {initialData.maxAttempts || "Sin intentos máximos"}
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
                            name="maxAttempts"
                            render={({ field }) => (
                                <FormItem>
                                    <FormControl>
                                        <Input
                                            type="number"
                                            min={1}
                                            max={10}
                                            disabled={isSubmitting}
                                            placeholder="Entre 1 y 10"
                                            {...field}
                                            value={field.value ?? ""}
                                            onChange={(e) =>
                                                field.onChange(
                                                    e.target.value === "" ? undefined : +e.target.value
                                                )
                                            }
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <div className="flex items-center gap-x-2">
                            <Button disabled={!isValid || isSubmitting} type="submit">
                                Guardar
                            </Button>
                        </div>
                    </form>
                </Form>
            )}
        </div>
    );
};
