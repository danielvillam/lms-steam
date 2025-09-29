import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

import { db } from "@/lib/db";
import { isTeacher } from '@/lib/teacher';

/**
 * POST Request Handler for Creating a New Course.
 *
 * This function handles POST requests to create a new course. It first checks if the user is authenticated and has the role of a teacher.
 */
export async function POST(req: Request) {
  try {
    const { userId } = await auth();
    const { title } = await req.json();

    if (!userId || !isTeacher(userId)) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const course = await db.course.create({
      data: {
        userId,
        title,
      },
    });

    return NextResponse.json(course);
  } catch (error) {
    console.log("[COURSES]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
