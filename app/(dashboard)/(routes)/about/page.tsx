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
                <p className="text-base md:text-lg text-gray-600 mt-4">
                El aula STEAM es un entorno interdisciplinario en el que convergen las ciencias,
                    la tecnología, la ingeniería, el arte y las matemáticas para fomentar principalmente
                    en los estudiantes la cocreación, la experimentación y la exploración, mediante recursos
                    y herramientas que impulsan el aprendizaje basado en proyectos.
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
                    <h2 className="text-2xl md:text-3xl font-semibold">¿Por qué se llama Sonny Jiménez?</h2>
                    <p className="text-base md:text-lg text-gray-700 mt-4">
                        El Aula STEAM de la sede Medellín lleva el nombre de Sonny Jiménez como primera egresada
                        del pregrado de ingeniería Civil y de Minas en 1946 de la Facultad de Minas de la Universidad
                        Nacional de Colombia. La participación activa de Sonny en la política, la educación y la
                        vinculación laboral de las mujeres, demostraron la importancia del género femenino en los
                        diferentes sectores sociales y que sus capacidades van más allá de la formación de una familia.
                    </p>
                </div>
            </div>

            {/* Vision and values cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl">
                <div className="bg-white text-black p-6 rounded-lg shadow-lg text-center">
                    <h3 className="text-xl font-bold">🌍 ¿Qué buscamos?</h3>
                    <p className="text-gray-600 mt-2">
                        El aula busca brindar un espacio abierto para la comunidad universitaria,
                        pero de igual forma está dispuesta para otras universidades, entidades estatales y organizaciones sociales
                        de la región. Permitiendo que los distintos saberes, conocimientos y experiencias de las personas que hagan
                        uso tanto del espacio físico del aula, como de la metodología STEAM, se integren para planear y ejecutar
                        proyectos que respondan a los desafíos de la sociedad.
                    </p>
                </div>
                <div className="bg-white text-black p-6 rounded-lg shadow-lg text-center">
                    <h3 className="text-xl font-bold">💡 Nuestros 7 principios</h3>
                    <ul className="list-disc list-inside text-gray-600 mt-3 space-y-1 text-left">
                        <li>🤝 Las alianzas y la multidisciplinariedad enriquecen</li>
                        <li>☁️ El conocimiento se comparte</li>
                        <li>🔧 Aprender haciendo y del error</li>
                        <li>🔒 El acceso genera apropiación</li>
                        <li>💡 Toda idea es buena</li>
                        <li>⚙️ Tecnología de vanguardia no es sinónimo de solución</li>
                        <li>📖 Innovación, ¿es igual a nuevo?</li>
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
