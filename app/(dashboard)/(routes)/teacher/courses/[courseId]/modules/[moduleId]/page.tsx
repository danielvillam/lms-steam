import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Eye, LayoutDashboard, Video, BookOpenCheck } from "lucide-react";

import { db } from "@/lib/db";
import { EvaluationType } from "@prisma/client";

import { Banner } from "@/components/banner";
import { IconBadge } from "@/components/icon-badge";

import { Actions } from "./_components/actions";
import { TitleForm } from "./_components/title-form";
import { DescriptionForm } from "./_components/description-form";
import { AccessForm } from "./_components/access-form";
import { VideoUrlForm } from './_components/videoUrl-form';
import { VideoYoutubeForm } from "./_components/videoYoutube-form";
import { VideoTranscriptForm } from "./_components/videoTranscript-form";
import { EvaluationsForm } from "./_components/evaluations-form";

/**
 * Module Edit Page for Course.
 * Displays and allows the editing of module title, description, access settings, video and evaluation.
 */
export default async function ModuleIdPage({
                                             params,
                                           }: {
  params: Promise<{ moduleId: string; courseId: string }>;
}) {
  const { moduleId, courseId } = await params;
  const { userId, redirectToSignIn } = await auth();

  if (!userId) return redirectToSignIn();

  const [module, course, evaluation] = await Promise.all([
    db.module.findUnique({ where: { id: moduleId, courseId } }),
    db.course.findUnique({ where: { id: courseId } }),
    db.evaluation.findUnique({ where: { moduleId } }),
  ]);

  if (!module || !course) return redirect("/");

  const evaluationTypes = Object.values(EvaluationType).map((type) => ({
    label: type.charAt(0).toUpperCase() + type.slice(1),
    value: type,
  }));

  const requiredFields = [
    module.title,
    module.description,
    module.videoUrl,
    evaluation?.isPublished,
  ];

  const totalFields = requiredFields.length;
  const completedFields = requiredFields.filter(Boolean).length;
  const completionText = `(${completedFields}/${totalFields})`;
  const isComplete = requiredFields.every(Boolean);

  return (
      <>
        {!module.isPublished && (
            <Banner
                variant="warning"
                label="Este módulo no está publicado. No será visible en el curso."
            />
        )}

        <div className="p-6">
          <div className="flex items-center justify-between">
            <div className="w-full">
              <Link
                  href={`/teacher/courses/${courseId}`}
                  className="flex items-center text-sm hover:opacity-75 transition mb-6"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Volver a la configuración del curso
              </Link>

              <div className="flex items-center justify-between w-full">
                <div className="flex flex-col gap-y-2">
                  <h1 className="text-2xl font-medium">Creación de módulos</h1>
                  <span className="text-sm text-slate-700">
                  Completa todos los campos {completionText}
                </span>
                </div>
                <Actions
                    disabled={!isComplete}
                    courseId={courseId}
                    moduleId={moduleId}
                    isPublished={module.isPublished}
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-16">
            <div className="space-y-4">
              <section>
                <div className="flex items-center gap-x-2">
                  <IconBadge icon={LayoutDashboard} />
                  <h2 className="text-xl">Personaliza el módulo</h2>
                </div>
                <TitleForm initialData={module} courseId={courseId} moduleId={moduleId} />
                <DescriptionForm initialData={module} courseId={courseId} moduleId={moduleId} />
              </section>

              <section>
                <div className="flex items-center gap-x-2">
                  <IconBadge icon={Eye} />
                  <h2 className="text-xl">Configuración de acceso</h2>
                </div>
                <AccessForm initialData={module} courseId={courseId} moduleId={moduleId} />
              </section>

              <section>
                <div className="flex items-center gap-x-2">
                  <IconBadge icon={BookOpenCheck} />
                  <h2 className="text-xl">Evalúa el módulo</h2>
                </div>
                <EvaluationsForm
                    initialData={evaluation ?? { id: "", type: null }}
                    courseId={course.id}
                    moduleId={module.id}
                    evaluation={evaluation}
                    evaluationTypes={evaluationTypes}
                />
              </section>
            </div>

            <div className="space-y-4">
              <section>
                <div className="flex items-center gap-x-2">
                  <IconBadge icon={Video} />
                  <h2 className="text-xl">Añadir un video</h2>
                </div>
                <VideoUrlForm initialData={module} courseId={courseId} moduleId={moduleId} />
                <VideoYoutubeForm initialData={module} />
                {module.videoUrl && (
                    <VideoTranscriptForm
                        initialData={module}
                        courseId={courseId}
                        moduleId={moduleId}
                    />
                )}
              </section>
            </div>
          </div>
        </div>
      </>
  );
}
