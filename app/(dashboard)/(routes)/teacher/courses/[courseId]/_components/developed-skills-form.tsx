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
import { Textarea } from "@/components/ui/textarea";
import { Loading } from '@/components/loading';

interface DevelopedSkillsFormProps {
  initialData: Course;
  courseId: string;
}

/**
 * A form component for managing and editing the "developed skills" required for a course.
 * It allows toggling between viewing the current skills and editing them.
 */
const formSchema = z.object({
  developedSkills: z.string().min(1, {
    message: "Se requiere habilidades desarrolladas",
  }),
});

export const DevelopedSkillsForm = ({
  initialData,
  courseId,
}: DevelopedSkillsFormProps) => {
  const [isEditing, setIsEditing] = useState(false);

  const toggleEdit = () => setIsEditing((current) => !current);

  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      developedSkills: initialData?.developedSkills || "",
    },
  });

  const { isSubmitting, isValid } = form.formState;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      await axios.patch(`/api/courses/${courseId}`, values);
      toast.success("Curso actualizado exitosamente");
      toggleEdit();
      router.refresh();
    } catch {
      toast.error("Algo salió mal");
    }
  };

  return (
    <div className="mt-6 border bg-slate-100 rounded-md p-4">
      <div className="font-medium flex items-center justify-between">
        Habilidades desarrolladas en el curso
        <Button onClick={toggleEdit} variant="ghost">
          {isEditing ? (
            <>Cancelar</>
          ) : (
            <>
              <Pencil className="h-4 w-4 mr-2" />
              Editar habilidades desarrolladas
            </>
          )}
        </Button>
      </div>
      {!isEditing && (
        <p
          className={cn(
            "text-sm mt-2",
            !initialData.developedSkills && "text-slate-500 italic"
          )}
        >
          {initialData.developedSkills || "Sin habilidades desarrolladas"}
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
              name="developedSkills"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Textarea
                      disabled={isSubmitting}
                      placeholder="p.ej. 'Inteligencia empresarial, Python...'"
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
