import { auth } from '@clerk/nextjs/server';
import { CheckCircle, Clock, LogIn, CircleUserRound } from 'lucide-react';
import { getDashboardCourses } from '@/actions/get-dashboard-courses';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { CarouselHome } from './_components/carousel';

interface FeatureProps {
    title: string;
    description: string;
}

// Test data
const upcomingEvents = [
    { title: "Taller de Robótica", date: "20 de Febrero - 10:00 AM", location: "Aula STEAM - Bloque M3" },
    { title: "Curso de Impresión 3D", date: "25 de Febrero - 2:00 PM", location: "Aula STEAM - Sala 2" },
    { title: "Curso de Impresión 3D", date: "25 de Febrero - 2:00 PM", location: "Aula STEAM - Sala 2" },
];

const latestNews = [
    { title: "Nuevo curso de Arduino", description: "Aprende desde cero a programar y diseñar circuitos con Arduino." },
    { title: "Charlas de innovación tecnológica", description: "No te pierdas nuestras sesiones con expertos en tecnología." },
];

// Reusable components
const Banner = () => (
    <div className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white text-center py-1 px-4">
        <p className="mt-2 text-sm md:text-base">
            Horario de atención 9:00 AM - 12:00 y 13:00 - 18:00 PM | Bloque M3 - 120 |
            <span>
                <a className="text-orange-300" href="mailto:aula_steam_med@unal.edu.co"> aula_steam_med@unal.edu.co</a>
            </span>
        </p>
    </div>
);

// Reusable components
const FeatureCard = ({ title, description }: FeatureProps) => (
    <div className="bg-white text-black p-6 rounded-lg shadow-lg text-center">
        <h3 className="text-xl font-bold">{title}</h3>
        <p className="text-gray-600 mt-2">{description}</p>
    </div>
);

export default async function Dashboard() {
    const { userId } = await auth();

    return (
        <div className="min-h-screen flex flex-col justify-center items-center bg-white">
            <CarouselHome />
            <Banner />
            {userId ? <AuthenticatedDashboard userId={userId} /> : <PublicDashboard />}
            <Footer />
        </div>
    );
}

const AuthenticatedDashboard = async ({ userId }: { userId: string }) => {
    const { completedCourses, coursesInProgress } = await getDashboardCourses(userId);

    return (
        <div className="w-full px-4 sm:px-6 lg:px-8">
            {/* Courses Section */}
            <h2 className="text-3xl font-extrabold text-center my-6">Revisa tus cursos inscritos</h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="bg-blue-50 p-6 rounded-xl shadow-md text-center">
                    <Clock className="w-10 h-10 mx-auto text-blue-500" />
                    <h3 className="text-xl font-semibold mt-2">Cursos en Progreso</h3>
                    <p className="text-gray-700">{coursesInProgress.length} cursos</p>
                    <Link href="/mycourses">
                        <Button className="mt-3" type="button" variant="default">Ver Cursos</Button>
                    </Link>
                </div>

                <div className="bg-green-50 p-6 rounded-xl shadow-md text-center">
                    <CheckCircle className="w-10 h-10 mx-auto text-green-500" />
                    <h3 className="text-xl font-semibold mt-2">Cursos Finalizados</h3>
                    <p className="text-gray-700">{completedCourses.length} cursos</p>
                    <Link href="/mycourses">
                        <Button className="mt-3" type="button" variant="default">Ver Cursos</Button>
                    </Link>
                </div>
            </div>

            {/* Upcoming Events */}
            <div className="mt-10">
                <h2 className="text-2xl font-bold text-center">📅 Próximos Eventos</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-4">
                    {upcomingEvents.map((event, index) => (
                        <div key={index} className="bg-gradient-to-br from-indigo-500 to-purple-600 text-white p-5 rounded-lg shadow-lg">
                            <h3 className="text-xl font-semibold">{event.title}</h3>
                            <p className="mt-1">{event.date}</p>
                            <p className="mt-1 italic">{event.location}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Latest News */}
            <div className="mt-10">
                <h2 className="text-2xl font-bold text-center">📰 Últimas Novedades</h2>
                <div className="flex flex-col sm:flex-row gap-6 mt-4">
                    {latestNews.map((news, index) => (
                        <div key={index} className="flex-1 bg-gray-100 p-5 rounded-lg shadow-md">
                            <h3 className="text-lg font-bold">{news.title}</h3>
                            <p className="text-gray-600 mt-2">{news.description}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};


const PublicDashboard = () => (
    <>
        <div className="text-center space-y-6 px-6 mt-6">
            <h1 className="text-4xl md:text-6xl font-extrabold">Explora, Aprende y Participa 🚀</h1>
            <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto">
                Accede a cursos, eventos presenciales y novedades tecnológicas en un solo lugar.
            </p>
            <div className="space-x-4">
                <Link href="/sign-up">
                    <Button size="sm" variant="outline">
                        <CircleUserRound className="h-4 w-4 mr-2 text-blue-500" />
                        Regístrate Gratis
                    </Button>
                </Link>
                <Link href="/sign-in">
                    <Button size="sm" variant="outline">
                        <LogIn className="h-4 w-4 mr-2 text-green-500" />
                        Iniciar sesión
                    </Button>
                </Link>
            </div>
        </div>
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 px-6 max-w-5xl">
            <FeatureCard title="📚 Cursos en línea" description="Aprende a tu ritmo con cursos diseñados por expertos." />
            <FeatureCard title="📅 Actividades presenciales" description="Inscríbete en talleres y eventos en el Aula STEAM." />
            <FeatureCard title="📰 Feed de novedades" description="Mantente al día con las últimas noticias y oportunidades." />
        </div>
    </>
);

const Footer = () => (
    <footer className="mt-16 py-6 text-center text-gray-600">
        <p>© {new Date().getFullYear()} Plataforma Aula STEAM. Todos los derechos reservados.</p>
    </footer>
);
