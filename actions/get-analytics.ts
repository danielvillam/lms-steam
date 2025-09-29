import { db } from '@/lib/db';
import { startOfMonth, subMonths, format, isAfter } from "date-fns";

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
        grouped[courseTitle] += 1;
    });

    return grouped;
};

export const getAnalytics = async (userId: string) => {
    try {

        /**
         * Query for course registrations
         */

        // Search for registered users
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

        // Normalize data to ensure typing
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

        /**
         * Query courses by level
         */

        // Count courses per level
        const coursesWithLevels = await db.course.findMany({
            where: {
                userId: userId,
            },
            select: {
                level: true,
                id: true,
            },
        });

        const coursesByLevel = coursesWithLevels.reduce((acc, course) => {
            const level = course.level || 'Desconocido';
            if (!acc[level]) {
                acc[level] = 0;
            }
            acc[level] += 1;
            return acc;
        }, {} as { [level: string]: number });

        /**
         * Query registrations by level
         */

        // Count enrolled students by course level
        const registrationsByLevel = normalized.reduce((acc, registration) => {
            const level = registration.course.level || 'Desconocido';
            if (!acc[level]) {
                acc[level] = 0;
            }
            acc[level] += 1;
            return acc;
        }, {} as { [level: string]: number });

        const sixMonthsAgo = subMonths(new Date(), 6);
        const registrations = await db.registration.findMany({
            where: { userId, createdAt: { gte: sixMonthsAgo } },
            select: { createdAt: true },
        });

        /**
         * Check registrations in the last 6 months
         */

        // We initialize the object with the last 6 months with 0 registrations
        let registrationsByMonth: Record<string, number> = {};
        for (let i = 5; i >= 0; i--) {
            const month = format(subMonths(new Date(), i), "MMM yyyy"); // "Ene 2024"
            registrationsByMonth[month] = 0;
        }

        // We count the actual registrations
        registrations.forEach((reg) => {
            const month = format(startOfMonth(reg.createdAt), "MMM yyyy");
            if (isAfter(startOfMonth(reg.createdAt), sixMonthsAgo)) {
                registrationsByMonth[month] = (registrationsByMonth[month] || 0) + 1;
            }
        });

        return {
            data,
            totalRegistrations,
            coursesByLevel,
            registrationsByLevel,
            registrationsByMonth,
        };
    } catch (error) {
        console.log('[GET_ANALYTICS]', error);
        return {
            data: [],
            totalRegistrations: 0,
            coursesByLevel: {},
            registrationsByLevel: {},
            registrationsByMonth: {},
        };
    }
};
