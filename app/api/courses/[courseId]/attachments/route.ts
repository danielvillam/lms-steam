import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

import { db } from "@/lib/db";
import { isTeacher } from '@/lib/teacher';

/**
 * POST Request Handler for Adding an Attachment to a Course.
 *
 * This function handles POST requests to add an attachment (e.g., a file URL) to a course.
 */
export async function POST(
    req: Request,
    props: {
      params: Promise<{ courseId: string }>;
    }
) {
  try {
    const params = await props.params;

    const { userId } = await auth();
    const { url } = await req.json();

    if (!userId || !isTeacher(userId)) {
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

    const attachment = await db.attachment.create({
      data: {
        url,
        name: url.split("/").pop(),
        courseId: params.courseId,
      },
    });

    return NextResponse.json(attachment);
  } catch (error) {
    console.log("[COURSE_ID_ATTACHMENTS]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
