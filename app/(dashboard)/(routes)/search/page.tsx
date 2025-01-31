import { auth } from '@clerk/nextjs/server';

import { db } from '@/lib/db';
import { SearchInput } from '@/components/search-input';
import { getCourses } from '@/actions/get-courses';
import { CoursesList } from '@/components/courses-list';

import { Categories } from './_components/categories';

interface SearchPageProps {
    searchParams: {
        categoryId?: string;
        title?: string;
    };
}

/**
 * Search page that allows users to search for courses by category and title.
 * It fetches the courses and categories, then displays them with search and category filters.
 */
export const dynamic = 'force-dynamic';

export default async function SearchPage({ searchParams, }: {
    searchParams: Promise<SearchPageProps['searchParams']>;
}) {

    const resolvedSearchParams = await searchParams;
    const { userId, redirectToSignIn } = await auth()

    if (!userId) return redirectToSignIn()

    const categories = await db.category.findMany({
        orderBy: {
            name: 'asc',
        },
    });

    const courses = await getCourses({
        userId,
        ...resolvedSearchParams,
    });

    return (
        <>
            <div className="px-6 pt-6 md:hidden md:mb-0 block">
                <SearchInput />
            </div>
            <div className="p-6 space-y-4">
                <Categories items={categories} />
                <CoursesList items={courses} />
            </div>
        </>
    );
}

