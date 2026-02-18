import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

import { db } from "@/lib/db";

/**
 * DELETE Request Handler for Deleting a Course and its Related Data.
 *
 * This function handles DELETE requests to remove a course from the database.
 */
export async function DELETE(
    req: Request,
    props: {
      params: Promise<{ courseId: string }>;
    }
) {
  try {
    const params = await props.params;
    const { userId } = await auth();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const course = await db.course.findUnique({
      where: {
        id: params.courseId,
        userId: userId,
      },
      include: {
        modules: {
          include: {
            evaluation: true,
          },
        },
      },
    });

    if (!course) {
      return new NextResponse("Not Found", { status: 404 });
    }

    // Delete evaluation-related data for each module
    for (const module of course.modules) {
      // Delete user progress related to the module
      await db.userProgress.deleteMany({
        where: { moduleId: module.id },
      });

      if (module.evaluation) {
        const evaluationId = module.evaluation.id;

        // Delete selected answers (depends on evaluation results and questions)
        await db.selectedAnswer.deleteMany({
          where: { question: { evaluationId } },
        });

        // Delete evaluation results
        await db.evaluationResult.deleteMany({
          where: { evaluationId },
        });

        // Delete answers (depends on questions)
        await db.answer.deleteMany({
          where: { question: { evaluationId } },
        });

        // Delete questions
        await db.question.deleteMany({
          where: { evaluationId },
        });

        // Delete the evaluation
        await db.evaluation.delete({
          where: { id: evaluationId },
        });
      }
    }

    // Delete all modules
    await db.module.deleteMany({
      where: { courseId: params.courseId },
    });

    // Delete attachments
    await db.attachment.deleteMany({
      where: { courseId: params.courseId },
    });

    // Delete registrations
    await db.registration.deleteMany({
      where: { courseId: params.courseId },
    });

    // Delete ratings
    await db.rating.deleteMany({
      where: { courseId: params.courseId },
    });

    // Delete certificates
    await db.certificate.deleteMany({
      where: { courseId: params.courseId },
    });

    // Finally, delete the course itself
    const deletedCourse = await db.course.delete({
      where: { id: params.courseId },
    });

    return NextResponse.json(deletedCourse);
  } catch (error) {
    console.log("[COURSE_ID_DELETE]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

/**
 * PATCH Request Handler for Updating a Course.
 *
 * This function handles PATCH requests to update a course's details.
 */
export async function PATCH(
    req: Request,
    props: {
      params: Promise<{ courseId: string }>;
    }
) {
  try {
    const params = await props.params;
    const { userId } = await auth();
    const values = await req.json();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const course = await db.course.update({
      where: {
        id: params.courseId,
        userId,
      },
      data: {
        ...values,
      },
    });

    return NextResponse.json(course);
  } catch (error) {
    console.log("[COURSE_ID]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
