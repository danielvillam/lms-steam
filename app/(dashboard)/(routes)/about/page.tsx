import Image from "next/image";

/**
 * About us page
 */
export default function AboutPage() {
    return (
        <div className="min-h-screen flex flex-col justify-center items-center bg-white p-6 space-y-12">
            {/* Introduction section */}
            <div className="text-center max-w-3xl">
                <h1 className="text-4xl md:text-5xl font-extrabold">Quiénes Somos</h1>
                <p className="text-lg md:text-xl text-gray-600 mt-4">
                    Impulsamos el aprendizaje con tecnología innovadora y un equipo apasionado por la educación.
                </p>
            </div>

            {/* Mission section with image */}
            <div className="flex flex-col md:flex-row items-center gap-8 max-w-5xl">
                <Image
                    src="/images/team.jpg"
                    alt="Nuestro equipo"
                    width={500}
                    height={350}
                    className="rounded-lg shadow-lg"
                />
                <div className="flex-1 text-center md:text-left">
                    <h2 className="text-2xl md:text-3xl font-semibold">Nuestra Misión</h2>
                    <p className="text-gray-700 mt-3 text-lg">
                        Brindar educación accesible y de calidad a través de una plataforma innovadora,
                        permitiendo que más personas alcancen sus objetivos de aprendizaje y crecimiento profesional.
                    </p>
                </div>
            </div>

            {/* Vision and values cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl">
                <div className="bg-white text-black p-6 rounded-lg shadow-lg text-center">
                    <h3 className="text-xl font-bold">🌍 Nuestra Visión</h3>
                    <p className="text-gray-600 mt-2">
                        Ser la plataforma líder en educación digital, impactando la vida de miles de estudiantes en todo el mundo.
                    </p>
                </div>
                <div className="bg-white text-black p-6 rounded-lg shadow-lg text-center">
                    <h3 className="text-xl font-bold">💡 Nuestros Valores</h3>
                    <ul className="list-disc list-inside text-gray-600 mt-3 space-y-1">
                        <li>Innovación</li>
                        <li>Compromiso</li>
                        <li>Accesibilidad</li>
                        <li>Calidad</li>
                        <li>Colaboración</li>
                    </ul>
                </div>
            </div>

            {/* Footer */}
            <footer className="mt-12 text-center text-gray-600">
                <p>© {new Date().getFullYear()} Plataforma de cursos del Aula STEAM. Todos los derechos reservados.</p>
            </footer>
        </div>
    );
}
