'use client';

import { UserButton, useAuth } from '@clerk/nextjs';
import { LogOut, LogIn, School } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { Button } from '@/components/ui/button';
import { SearchInput } from './search-input';
import { isTeacher } from '@/lib/teacher';

export const NavbarRoutes = () => {
    const { userId } = useAuth();
    const pathname = usePathname();

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
                    isTeacherPage || isCoursePage ? (
                        <Link href="/">
                            <Button size="sm" variant="destructive">
                                <LogOut className="h-4 w-4 mr-2" />
                                Salir
                            </Button>
                        </Link>
                    ) : isTeacher(userId) ? (
                        <Link href="/teacher/courses">
                            <Button size="sm" variant="success">
                                <School className="h-4 w-4 mr-2" />
                                Modo Profesor
                            </Button>
                        </Link>
                    ) : null
                ) : (
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

