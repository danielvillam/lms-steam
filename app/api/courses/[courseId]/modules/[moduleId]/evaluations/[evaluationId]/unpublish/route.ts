import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function PATCH(
    req: Request,
    props: {
        params: Promise<{ evaluationId: string; moduleId: string; courseId: string }>;
    }
) {
    try {
        const params = await props.params;
        const { userId } = await auth();

        if (!userId) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const evaluation = await db.evaluation.findUnique({
            where: {
                id: params.evaluationId,
                moduleId: params.moduleId,
            },
        });

        if (!evaluation) {
            return new NextResponse("Evaluación no encontrada", { status: 404 });
        }

        const result = await db.$transaction(async (tx) => {
            await tx.evaluation.update({
                where: {
                    id: params.evaluationId,
                },
                data: {
                    isPublished: false,
                },
            });

            await tx.module.update({
                where: {
                    id: params.moduleId,
                },
                data: {
                    isPublished: false,
                },
            });

            const publishedModules = await tx.module.findMany({
                where: {
                    courseId: params.courseId,
                    isPublished: true,
                },
            });

            if (publishedModules.length === 0) {
                await tx.course.update({
                    where: { id: params.courseId },
                    data: { isPublished: false },
                });
            }

            return { success: true };
        });

        return NextResponse.json(result);
    } catch (error) {
        console.log("[EVALUATION_UNPUBLISH]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
