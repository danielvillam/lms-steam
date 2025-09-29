import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

import { db } from "@/lib/db";

/**
 * PUT Request Handler for Reordering Modules in a Course.
 *
 * This function handles PUT requests to update the order (position) of modules within a course.
 */
export async function PUT(
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

    const { list } = await req.json();

    const courseOwner = await db.course.findUnique({
      where: {
        id: params.courseId,
        userId,
      },
    });

    if (!courseOwner) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    for (let item of list) {
      await db.module.update({
        where: { id: item.id },
        data: { position: item.position },
      });
    }

    return new NextResponse("Success", { status: 200 });
  } catch (error) {
    console.log("[REORDER]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
