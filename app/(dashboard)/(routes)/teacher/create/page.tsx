"use client";

import * as z from "zod";
import axios from "axios";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import Link from "next/link";
import toast from "react-hot-toast";

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

/**
 * Create Course Page.
 *
 * This page allows users to create a new course by entering a title.
 */
const formSchema = z.object({
  title: z.string().min(1, {
    message: "El título es obligatorio",
  }),
});

const CreatePage = () => {
  const router = useRouter();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
    },
  });

  const { isSubmitting, isValid } = form.formState;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const response = await axios.post("/api/courses", values);
      router.push(`/teacher/courses/${response.data.id}`);
      toast.success("Curso creado");
    } catch {
      toast.error("Algo salió mal");
    }
  };

  return (
    <div className="max-w-5xl max-auto flex md:items-center md:justify-center h-full p-6">
      <div>
        <h1 className="text-2xl">Escribe el nombre de tu curso</h1>
        <p className="text-sm text-slate-600">
          ¿Qué nombre te gustaría ponerle a tu curso? No te preocupes, 
          puedes cambiarlo más adelante.
        </p>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-8 mt-8"
          >
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Título del curso</FormLabel>
                  <FormControl>
                    <Input
                      disabled={isSubmitting}
                      placeholder="p.ej. 'Desarrollo Web Avanzado'"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    ¿Qué enseñarás en este curso?
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex items-center gap-x-2">
              <Link href="/">
                <Button type="button" variant="ghost">
                  Cancelar
                </Button>
              </Link>
              <Button type="submit" disabled={!isValid || isSubmitting}>
                Continuar
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default CreatePage;
