import Mux from "@mux/mux-node";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

import { db } from "@/lib/db";


/**
 * DELETE Request Handler for Deleting a Chapter and Associated Video.
 *
 * This function handles DELETE requests to remove a specific chapter from a course.
 * Additionally, if no chapters are left published in the course, the course itself will be unpublished.
 */

export async function DELETE(
    req: Request,
    props: { params: Promise<{ courseId: string; chapterId: string }> }
) {
  const params = await props.params;
  try {
    const { userId } = await auth();
    const { courseId, chapterId } = params;

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

  const chapter = await db.chapter.findUnique({
    where: {
      id: chapterId,
      courseId: courseId,
    },
  });

  if (!chapter) {
    return new NextResponse("Not Found", { status:404 });
  }

  const deletedChapter = await db.chapter.delete({
    where: {
      id: chapterId
    },
  });

  const publishedChaptersInCourse = await db.chapter.findMany({
    where: {
      courseId: courseId,
      isPublished: true,
    },
  })

  if (!publishedChaptersInCourse.length) {
    await db.course.update({
      where: {
        id: courseId,
      },
      data: {
        isPublished: false,
      },
    });
  }

  return NextResponse.json(deletedChapter);
} catch (error) {
  console.log("[COURSES_CHAPTER_ID]", error);
  return new NextResponse("Internal Error", { status: 500});
}
}

/**
 * PATCH Request Handler for Updating a Chapter and Associated Video.
 *
 * This function handles PATCH requests to update the details of a specific chapter in a course.
 */
export async function PATCH(
    req: Request,
    props: { params: Promise<{ courseId: string; chapterId: string }> }
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

    const chapter = await db.chapter.update({
      where: {
        id: params.chapterId,
        courseId: params.courseId,
      },
      data: {
        ...values,
      },
    });

    return NextResponse.json(chapter);
  } catch (error) {
    console.log("[COURSES_CHAPTER_ID]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
