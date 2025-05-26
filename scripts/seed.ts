const { PrismaClient } = require("@prisma/client");

const database = new PrismaClient();

async function main() {
  try {
    await database.category.createMany({
      data: [
        //Ciencias y Tecnología
        { name: "Ciencias de la Computación" },
        { name: "Inteligencia Artificial" },
        { name: "Ciberseguridad" },
        { name: "Desarrollo Web" },
        { name: "Desarrollo Móvil" },
        { name: "Bases de Datos" },
        { name: "Robótica" },
        { name: "Internet de las Cosas (IoT)" },
        { name: "Matemáticas" },
        { name: "Física" },
        { name: "Química" },
        { name: "Biología" },
        { name: "Astronomía" },

        //Negocios y Emprendimiento
        { name: "Administración de Empresas" },
        { name: "Emprendimiento" },
        { name: "Finanzas Personales" },
        { name: "Contabilidad" },
        { name: "Marketing Digital" },
        { name: "Recursos Humanos" },
        { name: "Liderazgo y Gestión" },
        { name: "Comercio Electrónico" },
        { name: "Economía" },

        //Arte y Creatividad
        { name: "Diseño Gráfico" },
        { name: "Fotografía" },
        { name: "Dibujo y Pintura" },
        { name: "Filmación y Video" },
        { name: "Edición de Video" },
        { name: "Animación" },
        { name: "Música" },
        { name: "Producción Musical" },
        { name: "Historia del Arte" },

        //Idiomas y Humanidades
        { name: "Inglés" },
        { name: "Español" },
        { name: "Francés" },
        { name: "Portugués" },
        { name: "Historia" },
        { name: "Filosofía" },
        { name: "Literatura" },
        { name: "Comunicación" },
        { name: "Lingüística" },

        //Salud y Bienestar
        { name: "Aptitud Física" },
        { name: "Nutrición" },
        { name: "Yoga" },
        { name: "Meditación" },
        { name: "Primeros Auxilios" },
        { name: "Psicología" },
        { name: "Salud Mental" },
        { name: "Sexualidad y Educación" },

        //Ingeniería y Manufactura
        { name: "Ingeniería Civil" },
        { name: "Ingeniería Eléctrica" },
        { name: "Ingeniería Electrónica" },
        { name: "Ingeniería Mecánica" },
        { name: "Automatización" },
        { name: "CAD/CAM" },
        { name: "Procesos Industriales" },

        //Vida y Estilo
        { name: "Cocina" },
        { name: "Repostería" },
        { name: "Jardinería" },
        { name: "Cuidado del Hogar" },
        { name: "Manualidades" },
        { name: "Moda y Estilo" },

        //Educación y Formación
        { name: "Pedagogía" },
        { name: "Didáctica Digital" },
        { name: "Enseñanza de STEM" },
        { name: "Diseño Instruccional" },
        { name: "Educación Inclusiva" },
        { name: "Gamificación del Aprendizaje" },

        //Tecnología de la Información
        { name: "Soporte Técnico" },
        { name: "Redes de Computadores" },
        { name: "Cloud Computing" },
        { name: "DevOps" },
        { name: "Sistemas Operativos" },
        { name: "Administración de Sistemas" },
      ],
      skipDuplicates: true, // evita errores por nombres duplicados si ya se insertaron
    });

    console.log("Categorías insertadas con éxito");
  } catch (error) {
    console.error("Error al inicializar las categorías:", error);
  } finally {
    await database.$disconnect();
  }
}

main();
