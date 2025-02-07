import Mux from "@mux/mux-node";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

import { db } from "@/lib/db";

const mux = new Mux({
  tokenId: process.env.MUX_TOKEN_ID!,
  tokenSecret: process.env.MUX_TOKEN_SECRET!,
});

/**
 * DELETE Request Handler for Deleting a Chapter and Associated Video.
 *
 * This function handles DELETE requests to remove a specific chapter from a course.
 * If the chapter has an associated video, it will also be deleted from Mux.
 * Additionally, if no chapters are left published in the course, the course itself will be unpublished.
 */

// TODO: Cambiar la funcion DELETE, ya no es necesario eliminar el MUX ( sería inexistente )
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

  if (chapter.videoUrl) {
    const existingMuxData = await db.muxData.findFirst({
      where: {
        chapterId: chapterId,
      },
    });

    if (existingMuxData) {
      await mux.video.assets.delete(existingMuxData.assetId);
      await db.muxData.delete({
        where: {
          id: existingMuxData.id,
        },
      });
    }
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
 * If the chapter's video URL is updated, it will delete the old video from Mux
 * and upload the new video to Mux.
 */
/**
export async function PATCH(
  req: Request,
  props: { params: Promise<{ courseId: string; chapterId: string }> }
) {
  const params = await props.params;
  try {
    const { userId } = await auth();
    const { courseId, chapterId } = params;
    const { isPublished, ...values } = await req.json();

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

    const chapter = await db.chapter.update({
      where: {
        id: chapterId,
        courseId: courseId,
      },
      data: {
        ...values,
      },
    });

    if (values.videoUrl) {
      const existingMuxData = await db.muxData.findFirst({
        where: {
          chapterId: chapterId,
        },
      });

      if (existingMuxData) {
        await mux.video.assets.delete(existingMuxData.assetId);
        await db.muxData.delete({
          where: {
            id: existingMuxData.id,
          },
        });
      }

      const asset = await mux.video.assets.create({
        input: [{ url: values.videoUrl }],
        playback_policy: ["public"],
        test: false,
      });

      await db.muxData.create({
        data: {
          chapterId: chapterId,
          assetId: asset.id,
          playbackId: asset.playback_ids?.[0]?.id,
        },
      });
    }

    return NextResponse.json(chapter);
  } catch (error) {
    console.log("[COURSES_CHAPTER_ID]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
 */

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
