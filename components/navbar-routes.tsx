'use client';

import { UserButton, useAuth } from '@clerk/nextjs';
import { LogIn, UserRoundCog, UserRound, Home } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { Button } from '@/components/ui/button';
import { SearchInput } from './search-input';
import { isTeacher } from '@/lib/teacher';

export const NavbarRoutes = () => {
    const { userId, isLoaded } = useAuth();
    const pathname = usePathname();

    if (!isLoaded) {
        return null;
    }

    const isTeacherPage = pathname?.startsWith("/teacher");
    const isCoursePage = pathname?.includes("/course");
    const isSearchPage = pathname === "/search";

    return (
        <>
            {isSearchPage && (
                <div className="hidden md:block">
                    <SearchInput />
                </div>
            )}

            <div className="flex gap-4 items-center ml-auto">
                {userId ? (
                    isTeacherPage ? (
                        // If you are on the teacher page, it shows "Student Mode"
                        <Link href="/">
                            <Button size="sm" variant="outline">
                                <UserRound className="h-4 w-4 mr-2 text-blue-500" />
                                Modo Estudiante
                            </Button>
                        </Link>
                    ) : isCoursePage ? (
                        // If you are on the course page, display "Back to top"
                        <Link href="/">
                            <Button size="sm" variant="outline">
                                <Home className="h-4 w-4 mr-2 text-blue-500" />
                                Volver al inicio
                            </Button>
                        </Link>
                    ) : isTeacher(userId) ? (
                        // If you are a teacher and are not on the teacher or course page, show "Teacher Mode"
                        <Link href="/teacher/courses">
                            <Button size="sm" variant="outline">
                                <UserRoundCog className="h-4 w-4 mr-2 text-green-500" />
                                Modo Profesor
                            </Button>
                        </Link>
                    ) : null
                ) : (
                    // If not logged in, display "Login"
                    <Link href="/sign-in">
                        <Button size="sm" variant="outline">
                            <LogIn className="h-4 w-4 mr-2 text-green-500" />
                            Iniciar sesión
                        </Button>
                    </Link>
                )}


                <UserButton afterSwitchSessionUrl="/" />
            </div>
        </>
    );
};

