import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import {
  CircleDollarSign,
  File,
  LayoutDashboard,
  ListChecks,
} from 'lucide-react';

import { db } from "@/lib/db";
import { IconBadge } from "@/components/icon-badge";
import { Banner } from '@/components/banner';

import { TitleForm } from "./_components/title-form";
import { DescriptionForm } from "./_components/description-form";
import { ImageForm } from "./_components/image-form";
import { CategoryForm } from "./_components/category-form";
import { AttachmentForm } from "./_components/attachment-form";
import { ModulesForm } from "./_components/modules-form";
import { PreviousSkillsForm } from './_components/previous-skills-form';
import { LevelForm } from './_components/level-form';
import { Actions } from './_components/actions';
import {
  DevelopedSkillsForm
} from './_components/developed-skills-form';
import { PriceForm } from './_components/price-form';

/**
 * Course Configuration Page.
 * Displays and allows the editing of a course's title, description, image, category, level, skills, modules, and attachments.
 */
export default async function CourseIdPage(
  props: {
      params: Promise<{ courseId: string }>;
  }
) {
  const params = await props.params;
  const { userId, redirectToSignIn } = await auth();

  if (!userId) return redirectToSignIn()

  if (!params.courseId) {
    return redirect("/");
  }

  const course = await db.course.findUnique({
    where: {
      id: params.courseId,
      userId,
    },
    include: {
      modules: {
        orderBy: {
          position: "asc",
        },
      },
      attachments: {
        orderBy: {
          createdAt: "desc",
        },
      },
    },
  });

  const categories = await db.category.findMany({
    orderBy: {
      name: "asc",
    },
  });

  if (!course) {
    return redirect("/");
  }

  const requiredFields = [
    course.title,
    course.description,
    course.level,
    course.previousSkills,
    course.developedSkills,
    course.imageUrl,
    course.categoryId,
    course.modules.some((module: { isPublished: boolean }) => module.isPublished),
    course.price !== null,
  ];

  const totalFields = requiredFields.length;
  const completedFields = requiredFields.filter(Boolean).length;

  const completionText = `(${completedFields}/${totalFields})`;

  const isComplete = requiredFields.every(Boolean);

  return (
      <>
        {!course.isPublished && (
            <Banner
              label="Este curso no está publicado. No será visible para los estudiantes."
            />
        )}
        <div className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex flex-col gap-y-2">
              <h1 className="text-2xl font-medium">Configuración del curso</h1>
              <span className="text-sm text-slate-700">
                Complete todos los campos {completionText}
              </span>
            </div>
            <Actions
              disabled={!isComplete}
              courseId={params.courseId}
              isPublished={course.isPublished}
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-16">
            <div>
              <div className="flex items-center gap-x-2">
                <IconBadge icon={LayoutDashboard} />
                <h2 className="text-xl">Personaliza tu curso</h2>
              </div>
              <TitleForm initialData={course} courseId={course.id} />
              <DescriptionForm initialData={course} courseId={course.id} />
              <ImageForm initialData={course} courseId={course.id} />
              <LevelForm initialData={course} courseId={course.id} />
              <PreviousSkillsForm initialData={course} courseId={course.id} />
              <DevelopedSkillsForm initialData={course} courseId={course.id} />
              <CategoryForm
                initialData={course}
                courseId={course.id}
                options={categories.map((category: { id: string; name: string }) => ({
                  label: category.name,
                  value: category.id,
                }))}
              />
            </div>
            <div className="space-y-6">
              <div>
                <div className="flex items-center gap-x-2">
                  <IconBadge icon={ListChecks} />
                  <h2 className="text-xl">Módulos del curso</h2>
                </div>
                <ModulesForm initialData={course} courseId={course.id} />
              </div>
              <div>
                <div className="flex items-center gap-x-2">
                  <IconBadge icon={CircleDollarSign} />
                  <h2 className="text-xl">Precio del curso</h2>
                </div>
                <PriceForm initialData={course} courseId={params.courseId} />
              </div>
              <div>
                <div className="flex items-center gap-x-2">
                  <IconBadge icon={File} />
                  <h2 className="text-xl">Recursos y anexos</h2>
                </div>
                <AttachmentForm initialData={course} courseId={course.id} />
              </div>
            </div>
          </div>
        </div>
      </>
  );
}