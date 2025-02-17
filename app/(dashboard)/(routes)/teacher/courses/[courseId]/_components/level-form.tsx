"use client";

import * as z from "zod";
import axios from "axios";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Pencil } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { Course } from "@prisma/client";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Combobox } from "@/components/ui/combobox";
import { Loading } from '@/components/loading';

interface LevelFormProps {
  initialData: Course;
  courseId: string;
}

/**
 * A form component for managing and editing the course's difficulty level.
 * It allows the user to toggle between viewing the current level and editing it.
 */
const formSchema = z.object({
  level: z.string().min(1),
});

export const LevelForm = ({ initialData, courseId }: LevelFormProps) => {
  const [isEditing, setIsEditing] = useState(false);

  const toggleEdit = () => setIsEditing((current) => !current);

  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      level: initialData?.level || "",
    },
  });

  const { isSubmitting, isValid } = form.formState;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      await axios.patch(`/api/courses/${courseId}`, values);
      toast.success("Curso actualizado correctamente");
      toggleEdit();
      router.refresh();
    } catch {
      toast.error("Algo salió mal");
    }
  };

  const options = [
    { label: "Principiante", value: "Principiante" },
    { label: "Intermedio", value: "Intermedio" },
    { label: "Avanzado", value: "Avanzado" },
  ];

  const selectedOption = options.find(
      (option) => option.value === initialData.level
  );

  return (
      <div className="mt-6 border bg-slate-100 rounded-md p-4">
        <div className="font-medium flex items-center justify-between">
          Nivel del curso
          <Button onClick={toggleEdit} variant="ghost">
            {isEditing ? (
                <>Cancelar</>
            ) : (
                <>
                  <Pencil className="h-4 w-4 mr-2" />
                  Editar nivel
                </>
            )}
          </Button>
        </div>
        {!isEditing && (
            <p
                className={cn(
                    "text-sm mt-2",
                    !initialData.level && "text-slate-500 italic"
                )}
            >
              {selectedOption?.label || "Sin nivel"}
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
                    name="level"
                    render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Combobox
                                options={options}
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
        )}
      </div>
  );
};
