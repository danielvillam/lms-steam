import { Category, Course } from "@prisma/client";
import { AllCourseCard } from '@/components/all-course-card';

type CourseWithCategory = Course & {
    category: Category | null;
    modules: { id: string }[];
};

interface CoursesListProps {
    items: CourseWithCategory[];
}

export const AllCoursesList = ({
                                   items
                               }: CoursesListProps) => {
    return (
        <div>
            <div className="grid sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2 lg:grid-cols-3
            xl:grid-cols-4 2xl:grid-cols-4 gap-4">
                {items.map((item) => (
                    <AllCourseCard
                        key={item.id}
                        id={item.id}
                        title={item.title}
                        imageUrl={item.imageUrl!}
                        modulesLength={item.modules.length}
                        category={item?.category?.name!}
                        level={item.level!}
                    />
                ))}
            </div>
            {items.length === 0 && (
                <div className="text-center text-sm text-muted-foreground mt-10">
                    No se encontraron cursos.
                </div>

            )}
        </div>
    )
}