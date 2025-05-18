import { db } from '@/lib/db';

export const getProgress = async (
   userId: string,
   courseId: string,
): Promise<number> => {
    try {
        const publishedModules = await db.module.findMany({
            where: {
                courseId: courseId,
                isPublished: true,
            },
            select: {
                id: true,
            }
        });

        const publishedModuleIds = publishedModules.map((module) => module.id);

        const validCompletedModules = await db.userProgress.count({
            where: {
                userId: userId,
                moduleId: {
                    in: publishedModuleIds,
                },
                isCompleted: true,
            }
        });

        return (validCompletedModules / publishedModuleIds.length) * 100;
    } catch (error) {
        console.log("[GET_PROGRESS]", error);
        return 0;
    }
}