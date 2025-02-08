import { db } from '@/lib/db';
import { Registration } from '@prisma/client';

type RegistrationWithCourse = Registration & {
    course: {
        id: string;
        userId: string;
        createdAt: Date;
        updatedAt: Date;
        title: string;
        description: string | null;
        imageUrl: string | null;
        previousSkills: string | null;
        developedSkills: string | null;
        level: string | null;
        isPublished: boolean;
        categoryId: string | null;
    };
};

const groupByCourse = (registrations: RegistrationWithCourse[]) => {
    const grouped: { [courseTitle: string]: number } = {};

    registrations.forEach((registration) => {
        const courseTitle = registration.course.title;
        if (!grouped[courseTitle]) {
            grouped[courseTitle] = 0;
        }
        grouped[courseTitle] += 1; // Contar inscripciones
    });

    return grouped;
};

export const getAnalytics = async (userId: string) => {
    try {
        const registered = await db.registration.findMany({
            where: {
                course: {
                    userId: userId,
                },
            },
            include: {
                course: true,
            },
        });

        // Normalizar datos para garantizar el tipado
        const normalized = registered.map((registration) => {
            if (!registration.course) {
                throw new Error('Registration with null course found');
            }
            return registration as RegistrationWithCourse;
        });

        const groupedRegistrations = groupByCourse(normalized);

        const data = Object.entries(groupedRegistrations).map(
            ([courseTitle, total]) => ({
                name: courseTitle,
                total: total,
            })
        );

        const totalRegistrations = registered.length;

        return {
            data,
            totalRegistrations,
        };
    } catch (error) {
        console.log('[GET_ANALYTICS]', error);
        return {
            data: [],
            totalRegistrations: 0,
        };
    }
};
