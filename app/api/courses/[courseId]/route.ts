import Mux from "@mux/mux-node";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

import { db } from "@/lib/db";

const mux = new Mux({
  tokenId: process.env.MUX_TOKEN_ID!,
  tokenSecret: process.env.MUX_TOKEN_SECRET!,
});

export async function DELETE(
    req: Request,
    { params: asyncParams }: { params: { courseId: string } }
) {
  try {
    const params = await asyncParams;

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
        chapters: {
          include: {
            muxData: true,
          },
        },
      },
    });

    if (!course) {
      return new NextResponse("Not Found", { status: 404 });
    }

    // Elimina todos los capítulos relacionados
    for (const chapter of course.chapters) {
      // Si hay datos en Mux, elimínalos
      if (chapter.muxData?.assetId) {
        await mux.video.assets.delete(chapter.muxData.assetId);
      }

      // Elimina el progreso del usuario relacionado con el capítulo
      await db.userProgress.deleteMany({
        where: {
          chapterId: chapter.id,
        },
      });

      // Elimina los datos de Mux relacionados con el capítulo
      await db.muxData.deleteMany({
        where: {
          chapterId: chapter.id,
        },
      });
    }

    // Elimina los capítulos
    await db.chapter.deleteMany({
      where: {
        courseId: params.courseId,
      },
    });

    // Elimina los attachments relacionados
    await db.attachment.deleteMany({
      where: {
        courseId: params.courseId,
      },
    });

    // Finalmente, elimina el curso
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


export async function PATCH(
    req: Request,
    { params: asyncParams }: { params: { courseId: string } }
) {
  try {
    const params = await asyncParams;

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
