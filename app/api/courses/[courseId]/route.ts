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
        modules: true
      },
    });

    if (!course) {
      return new NextResponse("Not Found", { status: 404 });
    }

    // Delete all modules related to the course
    for (const module of course.modules) {
      // Delete user progress related to the module
      await db.userProgress.deleteMany({
        where: {
          moduleId: module.id,
        },
      });
    }

    // Delete the modules from the database
    await db.module.deleteMany({
      where: {
        courseId: params.courseId,
      },
    });

    // Delete any attachments related to the course
    await db.attachment.deleteMany({
      where: {
        courseId: params.courseId,
      },
    });

    // Delete the registrations related to the course
    await db.registration.deleteMany({
      where: {
        courseId: params.courseId,
      },
    });

    // Finally, delete the course itself
    const deletedCourse = await db.course.delete({
      where: {
        id: params.courseId,
      },
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
