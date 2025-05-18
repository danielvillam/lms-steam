import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

import { db } from "@/lib/db";

/**
 * POST Request Handler for Creating a New Module in a Course.
 *
 * This function handles POST requests to create a new module for a specified course.
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
    const { title } = await req.json();

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

    const lastModule = await db.module.findFirst({
      where: {
        courseId: params.courseId,
      },
      orderBy: {
        position: "desc",
      },
    });

    const newPosition = lastModule ? lastModule.position + 1 : 1;

    const module = await db.module.create({
      data: {
        title,
        courseId: params.courseId,
        position: newPosition,
      },
    });

    return NextResponse.json(module);
  } catch (error) {
    console.log("[MODULES]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
