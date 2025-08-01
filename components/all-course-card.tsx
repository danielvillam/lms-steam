import Image from 'next/image';
import Link from 'next/link';
import { BookOpen } from 'lucide-react';

import { IconBadge } from '@/components/icon-badge';

interface CourseCardProps {
    id: string,
    title: string,
    imageUrl: string,
    modulesLength: number,
    category: string,
    level: string,
}

export const AllCourseCard = ({
                                  id,
                                  title,
                                  imageUrl,
                                  modulesLength,
                                  category,
                                  level,
                              }: CourseCardProps) => {
    return (
        <Link href={`/courses/${id}`}>
            <div className="group hover:shadow-sm transition overflow-hidden
            border rounded-lg p-3 h-full">
                <div className="relative w-full aspect-video rounded-md
                overflow-hidden">
                    <Image
                        fill
                        className="object-cover"
                        alt={title}
                        src={imageUrl}
                        sizes="(max-width: 768px) 100vw, 50vw"
                    />
                </div>
                <div className="flex flex-col pt-2">
                    <div className="text-lg md:text-base font-medium
                    group-hover:text-sky-700 transition line-clamp-2">
                        {title}
                    </div>
                    <p className="text-xs text-muted-foreground">
                        {category}
                    </p>
                    <div className="my-3 flex items-center gap-x-s text-sm">
                        <div className="flex item-center gap-x-1
                        text-slate-500">
                            <IconBadge size="sm" icon={BookOpen} />
                            <span>
                                {modulesLength} {modulesLength === 1 ? 'Módulo' : 'Módulos'}
                            </span>
                        </div>
                    </div>
                    <p className="text-md md:text-sm font-medium text-slate-700">
                        {level}
                    </p>
                </div>
            </div>
        </Link>
    );
};