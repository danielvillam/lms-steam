import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

import { db } from "@/lib/db";


/**
 * DELETE Request Handler for Deleting a Module and Associated Video.
 *
 * This function handles DELETE requests to remove a specific module from a course.
 * Additionally, if no modules are left published in the course, the course itself will be unpublished.
 */

export async function DELETE(
    req: Request,
    props: { params: Promise<{ courseId: string; moduleId: string }> }
) {
  const params = await props.params;
  try {
    const { userId } = await auth();
    const { courseId, moduleId } = params;

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

  const courseOwner = await db.course.findUnique({
    where: {
      id: courseId,
      userId,
    },
  });

  if (!courseOwner) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const module = await db.module.findUnique({
    where: {
      id: moduleId,
      courseId: courseId,
    },
    include: {
      evaluation: true,
    },
  });

  if (!module) {
    return new NextResponse("Not Found", { status:404 });
  }

  // Delete user progress for this module
  await db.userProgress.deleteMany({
    where: { moduleId },
  });

  // Delete evaluation and its related data
  if (module.evaluation) {
    const evaluationId = module.evaluation.id;

    // Delete selected answers
    await db.selectedAnswer.deleteMany({
      where: { question: { evaluationId } },
    });

    // Delete evaluation results
    await db.evaluationResult.deleteMany({
      where: { evaluationId },
    });

    // Delete answers
    await db.answer.deleteMany({
      where: { question: { evaluationId } },
    });

    // Delete questions
    await db.question.deleteMany({
      where: { evaluationId },
    });

    // Delete evaluation
    await db.evaluation.delete({
      where: { id: evaluationId },
    });
  }

  const deletedModule = await db.module.delete({
    where: {
      id: moduleId
    },
  });

  const publishedModulesInCourse = await db.module.findMany({
    where: {
      courseId: courseId,
      isPublished: true,
    },
  })

  if (!publishedModulesInCourse.length) {
    await db.course.update({
      where: {
        id: courseId,
      },
      data: {
        isPublished: false,
      },
    });
  }

  return NextResponse.json(deletedModule);
} catch (error) {
  console.log("[COURSES_MODULE_ID]", error);
  return new NextResponse("Internal Error", { status: 500});
}
}

/**
 * PATCH Request Handler for Updating a Module and Associated Video.
 *
 * This function handles PATCH requests to update the details of a specific module in a course.
 */
export async function PATCH(
    req: Request,
    props: { params: Promise<{ courseId: string; moduleId: string }> }
) {
  try {
    const { userId } = await auth();
    const params = await props.params;
    const { isPublished, ...values } = await req.json();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const courseOwner = await db.course.findUnique({
      where: {
        id: params.courseId,
        userId,
      },
    });

    if (!courseOwner) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const module = await db.module.update({
      where: {
        id: params.moduleId,
        courseId: params.courseId,
      },
      data: {
        ...values,
      },
    });

    return NextResponse.json(module);
  } catch (error) {
    console.log("[COURSES_MODULE_ID]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
