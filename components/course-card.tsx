import Image from "next/image";
import Link from "next/link";
import { BookOpen } from "lucide-react";

import { IconBadge } from "@/components/icon-badge";
import { CourseProgress } from "@/components/course-progress";

interface CourseCardProps {
    id: string;
    title: string;
    imageUrl: string;
    chaptersLength: number;
    progress: number | null;
    category: string;
    level: string;
}

export const CourseCard = ({
                               id,
                               title,
                               imageUrl,
                               chaptersLength,
                               progress,
                               category,
                               level,
                           }: CourseCardProps) => {
    return (
        <Link href={`/courses/${id}`}>
            <div
                className="group hover:shadow-lg transition-all overflow-hidden
        border rounded-xl p-4 h-full bg-white hover:scale-[1.02] relative"
            >
                {/* Course image */}
                <div
                    className="relative w-full aspect-video rounded-md overflow-hidden"
                >
                    <Image
                        fill
                        className="object-cover transition-transform duration-300 group-hover:scale-110"
                        alt={title}
                        src={imageUrl}
                        sizes="(max-width: 768px) 100vw, 50vw"
                    />
                </div>

                {/* Content */}
                <div className="flex flex-col pt-3 space-y-2">
                    <div
                        className="text-lg md:text-base font-semibold
            group-hover:text-sky-700 transition line-clamp-2"
                    >
                        {title}
                    </div>
                    <p className="text-xs text-muted-foreground">{category}</p>

                    {/* Modules info */}
                    <div className="flex items-center gap-x-2 text-sm text-gray-600">
                        <IconBadge size="sm" icon={BookOpen} />
                        <span>
                            {chaptersLength} {chaptersLength === 1 ? "Módulo" : "Módulos"}
                        </span>
                    </div>

                    {/* Progress or Level */}
                    {progress !== null ? (
                        <CourseProgress
                            variant={progress === 100 ? "success" : "default"}
                            size="sm"
                            value={progress}
                        />
                    ) : (
                        <p className="text-md md:text-sm font-medium text-gray-700">
                            {level}
                        </p>
                    )}
                </div>

                {/* Progress Label */}
                {progress !== null && (
                    <div
                        className={`absolute top-2 right-2 px-2 py-1 text-xs font-semibold rounded-full ${
                            progress === 100 ? "bg-green-700 text-white" : "bg-gray-200 text-gray-700"
                        }`}
                    >
                        {progress === 100 ? "Completado" : `${progress}%`}
                    </div>
                )}
            </div>
        </Link>
    );
};
