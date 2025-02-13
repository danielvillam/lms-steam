import { auth } from '@clerk/nextjs/server';
import { CheckCircle, Clock, LogIn, CircleUserRound } from 'lucide-react';

import { CoursesList } from '@/components/courses-list';
import { getDashboardCourses } from '@/actions/get-dashboard-courses';
import { InfoCard } from './_components/info-card';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

/**
 * Dashboard page that shows the user's course progress if they are authenticated,
 * otherwise it just shows a list of courses.
 */
export default async function Dashboard() {
    const { userId, redirectToSignIn } = await auth()

    //if (!userId) return redirectToSignIn()

    if (userId){
        const { completedCourses, coursesInProgress } = await getDashboardCourses(
            userId
        );

        return (
            <div className="p-6 space-y-4">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <InfoCard
                        icon={Clock}
                        label="En Curso"
                        numberOfItems={coursesInProgress.length}
                    />
                    <InfoCard
                        icon={CheckCircle}
                        label="Finalizado"
                        numberOfItems={completedCourses.length}
                        variant="success"
                    />
                </div>
                <CoursesList items={[...coursesInProgress, ...completedCourses]} />
            </div>
        );

    } else {

        // Component for each feature
        const FeatureCard = ({ title, description }: { title: string; description: string }) => (
            <div className="bg-white text-black p-6 rounded-lg shadow-lg text-center">
                <h3 className="text-xl font-bold">{title}</h3>
                <p className="text-gray-600 mt-2">{description}</p>
            </div>
        );

        return (
            <div
                className="min-h-screen flex flex-col justify-center items-center bg-gradient-to-br" >
                <div className="text-center space-y-6 px-6">
                    <h1 className="text-4xl md:text-6xl font-extrabold">
                        Aprende, Crece y Conquista 🚀
                    </h1>
                    <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto">
                        Únete a nuestra plataforma y accede a los mejores cursos para impulsar tu conocimiento y
                        carrera.
                    </p>

                    <div className="space-x-4">
                        <Link href="/sign-up">
                            <Button size="sm" variant="ghost">
                                <CircleUserRound className="h-4 w-4 mr-2" />
                                Regístrate Gratis
                            </Button>
                        </Link>
                        <Link href="/sign-in">
                            <Button size="sm" variant="ghost">
                                <LogIn className="h-4 w-4 mr-2" />
                                Iniciar sesión
                            </Button>
                        </Link>
                    </div>
                </div>

                {/* Characteristics */}
                <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 px-6 max-w-5xl">
                    <FeatureCard
                        title="📚 +10 Cursos"
                        description="Accede a una gran variedad de cursos en diferentes áreas del conocimiento."
                    />
                    <FeatureCard
                        title="🎓 Certificaciones"
                        description="Obtén certificados que validen tu aprendizaje y aumenta tus oportunidades del uso del Aula STEAM."
                    />
                    <FeatureCard
                        title="💡 Profesores Expertos"
                        description="Aprende de profesionales con años de experiencia en la industria y una pasión por enseñar."
                    />
                </div>

                {/* Footer */}
                <footer className="mt-16 py-6 text-center text-gray-600">
                    <p>© {new Date().getFullYear()} Tu Plataforma de Cursos. Todos los derechos reservados.</p>
                </footer>
            </div>
        );
    }
}