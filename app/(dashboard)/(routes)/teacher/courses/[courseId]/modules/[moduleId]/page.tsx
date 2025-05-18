import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Eye, LayoutDashboard, Video, Clapperboard } from "lucide-react";

import { db } from "@/lib/db";
import { IconBadge } from "@/components/icon-badge";
import { Banner } from '@/components/banner';

import { ModuleTitleForm } from "./_components/module-title-form";
import { ModuleDescriptionForm } from "./_components/module-description-form";
import { ModuleAccessForm } from "./_components/module-access-form";
import { ModuleVideoUrlForm } from './_components/module-videoUrl-form';
import { ModuleVideoYoutubeForm } from './_components/module-videoYoutube-form';
import { ModuleVideoTranscriptForm } from './_components/module-videoTranscript-form';
import { ModuleActions } from './_components/module-actions';

/**
 * Module Edit Page for Course.
 * Displays and allows the editing of module title, description, access settings, and video.
 */
export default async function ModuleIdPage(
  props: {
    params: Promise<{ moduleId: string; courseId: string }>;
  }
) {
  const params = await props.params;
  const { userId, redirectToSignIn } = await auth()

  if (!userId) return redirectToSignIn()

  const module = await db.module.findUnique({
    where: {
      id: params.moduleId,
      courseId: params.courseId,
    },
  });

  if (!module) {
    return redirect("/");
  }

  const requiredFields = [module.title, module.description, module.videoUrl];

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
                href={`/teacher/courses/${params.courseId}`}
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
                <ModuleActions
                  disabled={!isComplete}
                  courseId={params.courseId}
                  moduleId={params.moduleId}
                  isPublished={module.isPublished}
                />
              </div>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-16">
            <div className="space-y-4">
              <div>
                <div className="flex items-center gap-x-2">
                  <IconBadge icon={LayoutDashboard} />
                  <h2 className="text-xl">Personaliza tu módulo</h2>
                </div>
                <ModuleTitleForm
                    initialData={module}
                    courseId={params.courseId}
                    moduleId={params.moduleId}
                />
                <ModuleDescriptionForm
                    initialData={module}
                    courseId={params.courseId}
                    moduleId={params.moduleId}
                />
              </div>
              <div>
                <div className="flex items-center gap-x-2">
                  <IconBadge icon={Eye} />
                  <h2 className="text-xl">Configuración de acceso</h2>
                </div>
                <ModuleAccessForm
                    initialData={module}
                    courseId={params.courseId}
                    moduleId={params.moduleId}
                />
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <div className="flex items-center gap-x-2">
                  <IconBadge icon={Video} />
                  <h2 className="text-xl">Añadir un video</h2>
                </div>
                <ModuleVideoUrlForm
                    initialData={module}
                    courseId={params.courseId}
                    moduleId={params.moduleId}
                />
                <ModuleVideoYoutubeForm
                    initialData={module}
                />
               {module.videoUrl && (
                   <ModuleVideoTranscriptForm
                       initialData={module}
                       courseId={params.courseId}
                       moduleId={params.moduleId}
                   />
                )}
            </div>
            </div>
          </div>
        </div>
      </>
  );
}