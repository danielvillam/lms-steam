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

            {/* Vision section */}
            <div className="bg-white text-black p-6 rounded-lg shadow-lg text-center max-w-5xl w-full">
                <h3 className="text-2xl md:text-3xl font-bold">🌍 ¿Qué buscamos?</h3>
                <p className="text-base md:text-lg text-gray-600 mt-4">
                    El aula busca brindar un espacio abierto para la comunidad universitaria,
                    pero de igual forma está dispuesta para otras universidades, entidades estatales y organizaciones sociales
                    de la región. Permitiendo que los distintos saberes, conocimientos y experiencias de las personas que hagan
                    uso tanto del espacio físico del aula, como de la metodología STEAM, se integren para planear y ejecutar
                    proyectos que respondan a los desafíos de la sociedad.
                </p>
            </div>

            {/* Principles section */}
            <div className="w-full max-w-5xl">
                <h2 className="text-3xl md:text-4xl font-bold text-center mb-8">💡 Nuestros 7 Principios</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Principle 1 */}
                    <div className="bg-white p-6 rounded-lg shadow-lg">
                        <h3 className="text-lg md:text-xl font-bold flex items-start gap-2">
                            <span className="text-2xl">🤝</span>
                            <span>Las alianzas y la multidisciplinariedad enriquecen</span>
                        </h3>
                        <p className="text-gray-600 mt-3 text-sm md:text-base">
                            Reunir en un mismo espacio las ciencias, las tecnologías, las ingenierías, las artes y las matemáticas para generar sinergia en la construcción y deconstrucción del conocimiento. Los diferentes saberes son un mecanismo efectivo para la creación, en tanto la articulación de distintas organizaciones de carácter público, privado o comunitario enriquecen los procesos y la viabilidad de las iniciativas.
                        </p>
                    </div>

                    {/* Principle 2 */}
                    <div className="bg-white p-6 rounded-lg shadow-lg">
                        <h3 className="text-lg md:text-xl font-bold flex items-start gap-2">
                            <span className="text-2xl">☁️</span>
                            <span>El conocimiento se comparte</span>
                        </h3>
                        <p className="text-gray-600 mt-3 text-sm md:text-base">
                            Para tener un espacio accesible se requiere compartir el uso y la utilidad de las herramientas tecnológicas, al igual que las metodologías STEAM y los procesos y aprendizajes que se desarrollan en el aula.
                        </p>
                    </div>

                    {/* Principle 3 */}
                    <div className="bg-white p-6 rounded-lg shadow-lg">
                        <h3 className="text-lg md:text-xl font-bold flex items-start gap-2">
                            <span className="text-2xl">🔧</span>
                            <span>Aprender haciendo y del error</span>
                        </h3>
                        <p className="text-gray-600 mt-3 text-sm md:text-base">
                            Las experiencias se obtienen a través de la práctica, llevando la teoría de la academia y las experiencias personales al hacer. En donde los obstáculos y fallas durante el proceso, son igual de importantes al resultado.
                        </p>
                    </div>

                    {/* Principle 4 */}
                    <div className="bg-white p-6 rounded-lg shadow-lg">
                        <h3 className="text-lg md:text-xl font-bold flex items-start gap-2">
                            <span className="text-2xl">🔒</span>
                            <span>El acceso promueve la participación</span>
                        </h3>
                        <p className="text-gray-600 mt-3 text-sm md:text-base">
                            Un espacio abierto a la comunidad educativa especialmente a estudiantes que encuentran en el aula las herramientas para crear, explorar e imaginar escenarios posibles para los desafíos actuales de la sociedad.
                        </p>
                    </div>

                    {/* Principle 5 */}
                    <div className="bg-white p-6 rounded-lg shadow-lg">
                        <h3 className="text-lg md:text-xl font-bold flex items-start gap-2">
                            <span className="text-2xl">💡</span>
                            <span>Toda idea es buena</span>
                        </h3>
                        <p className="text-gray-600 mt-3 text-sm md:text-base">
                            La innovación y la creatividad logran resolver diferentes desafíos para diversos problemas, la solución puede ser más sencilla de lo que se piensa.
                        </p>
                    </div>

                    {/* Principle 6 */}
                    <div className="bg-white p-6 rounded-lg shadow-lg">
                        <h3 className="text-lg md:text-xl font-bold flex items-start gap-2">
                            <span className="text-2xl">⚙️</span>
                            <span>Tecnología de vanguardia no es sinónimo de solución</span>
                        </h3>
                        <p className="text-gray-600 mt-3 text-sm md:text-base">
                            Los problemas tienen diversos matices. El arte, los oficios y las destrezas son elementos que se integran en el concepto de tecnología, por lo tanto en el proceso la solución no siempre se encuentra en la tecnología de punta. Una solución debe ir más allá de la tecnología.
                        </p>
                    </div>

                    {/* Principle 7 */}
                    <div className="bg-white p-6 rounded-lg shadow-lg">
                        <h3 className="text-lg md:text-xl font-bold flex items-start gap-2">
                            <span className="text-2xl">📖</span>
                            <span>Innovación, ¿es igual a nuevo?</span>
                        </h3>
                        <p className="text-gray-600 mt-3 text-sm md:text-base">
                            Esta pregunta busca poner en duda la referencia que tenemos del verbo innovar, ya que este conlleva a un ejercicio de repensar las cosas, aportando valor a las soluciones de manera más efectiva, pero que no siempre resulta en lo desconocido.
                        </p>
                    </div>
                </div>
            </div>

            {/* Footer */}
            <footer className="mt-12 text-center text-gray-600">
                <p>© {new Date().getFullYear()} Plataforma de cursos del Aula STEAM. Todos los derechos reservados.</p>
            </footer>
        </div>
    );
}