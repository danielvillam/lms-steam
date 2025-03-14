import { auth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

import { db } from '@/lib/db';
import { isTeacher } from '@/lib/teacher';

/**
 * DELETE Request Handler for Deleting an Attachment.
 *
 * This function handles DELETE requests to remove an attachment associated with a course.
 */
export async function DELETE(
    req: Request,
    props: {
      params: Promise<{ attachmentId: string; courseId: string }>;
    }
) {
  try {
    const params = await props.params;
    const { userId } = await auth();

    if (!userId || !isTeacher(userId)) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const courseOwner = await db.course.findUnique({
      where: {
        id: params.courseId,
        userId,
      },
    });

    if (!courseOwner) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const attachment = await db.attachment.delete({
      where: {
        courseId: params.courseId,
        id: params.attachmentId,
      },
    });

    return NextResponse.json(attachment);
  } catch (error) {
    console.log('[ATTACHMENT_ID]', error);
    return new NextResponse('Internal error', { status: 500 });
  }
}
