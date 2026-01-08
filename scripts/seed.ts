// scripts/seed.ts
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const categories = [
  "Ciencias de la Computación",
  "Inteligencia Artificial",
  "Ciberseguridad",
  "Desarrollo Web",
  "Desarrollo Móvil",
  "Bases de Datos",
  "Robótica",
  "Internet de las Cosas (IoT)",
  "Matemáticas",
  "Física",
  "Química",
  "Biología",
  "Astronomía",
  "Administración de Empresas",
  "Emprendimiento",
  "Finanzas Personales",
  "Contabilidad",
  "Marketing Digital",
  "Recursos Humanos",
  "Liderazgo y Gestión",
  "Comercio Electrónico",
  "Economía",
  "Diseño Gráfico",
  "Fotografía",
  "Dibujo y Pintura",
  "Filmación y Video",
  "Edición de Video",
  "Animación",
  "Música",
  "Producción Musical",
  "Historia del Arte",
  "Inglés",
  "Español",
  "Francés",
  "Portugués",
  "Historia",
  "Filosofía",
  "Literatura",
  "Comunicación",
  "Lingüística",
  "Aptitud Física",
  "Nutrición",
  "Yoga",
  "Meditación",
  "Primeros Auxilios",
  "Psicología",
  "Salud Mental",
  "Sexualidad y Educación",
  "Ingeniería Civil",
  "Ingeniería Eléctrica",
  "Ingeniería Electrónica",
  "Ingeniería Mecánica",
  "Automatización",
  "CAD/CAM",
  "Procesos Industriales",
  "Cocina",
  "Repostería",
  "Jardinería",
  "Cuidado del Hogar",
  "Manualidades",
  "Moda y Estilo",
  "Pedagogía",
  "Didáctica Digital",
  "Enseñanza de STEM",
  "Diseño Instruccional",
  "Educación Inclusiva",
  "Gamificación del Aprendizaje",
  "Soporte Técnico",
  "Redes de Computadores",
  "Cloud Computing",
  "DevOps",
  "Sistemas Operativos",
  "Administración de Sistemas",
];

async function main() {
  const unique = Array.from(new Set(categories.map((c) => c.trim())));

  for (const name of unique) {
    await prisma.category.upsert({
      where: { name },
      update: {},
      create: { name },
    });
  }

  console.log(`✅ Categorías aseguradas: ${unique.length}`);
}

main()
  .catch((e) => {
    console.error("❌ Error al inicializar las categorías:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
