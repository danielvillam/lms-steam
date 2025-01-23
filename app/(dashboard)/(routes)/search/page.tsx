import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';

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

export const dynamic = 'force-dynamic';

export default async function SearchPage({ searchParams, }: {
    searchParams: Promise<SearchPageProps['searchParams']>;
}) {

    const resolvedSearchParams = await searchParams;
    const { userId } = await auth();

    if (!userId) {
        return redirect('/');
    }

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

