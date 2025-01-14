import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import {
  File,
  LayoutDashboard,
  ListChecks,
} from "lucide-react";

import { db } from "@/lib/db";
import { IconBadge } from "@/components/icon-badge";
import { Banner } from '@/components/banner';

import { TitleForm } from "./_components/title-form";
import { DescriptionForm } from "./_components/description-form";
import { ImageForm } from "./_components/image-form";
import { CategoryForm } from "./_components/category-form";
import { AttachmentForm } from "./_components/attachment-form";
import { ChaptersForm } from "./_components/chapters-form";
import { SkillsForm } from './_components/skills-form';
import { LevelForm } from './_components/level-form';
import { Actions } from './_components/actions';

const CourseIdPage = async ({ params }: { params: { courseId: string } }) => {
  const { userId } = await auth();

  const { courseId } = await params
  
  if (!userId) {
    return redirect("/");
  }

  if (!courseId) {
    return redirect("/");
  }

  const course = await db.course.findUnique({
    where: {
      id: courseId,
      userId,
    },
    include: {
      chapters: {
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
    course.skills,
    course.imageUrl,
    course.categoryId,
    course.chapters.some((chapter: { isPublished: boolean }) => chapter.isPublished),
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
              courseId={courseId}
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
              <LevelForm initialData={course} courseId={course.id} />
              <SkillsForm initialData={course} courseId={course.id} />
              <ImageForm initialData={course} courseId={course.id} />
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
                  <h2 className="text-xl">Capítulos del curso</h2>
                </div>
                <ChaptersForm initialData={course} courseId={course.id} />
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
};

export default CourseIdPage;
