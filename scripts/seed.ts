const { PrismaClient } = require("@prisma/client");

const database = new PrismaClient();

async function main() {
  try {
    await database.category.createMany({
      data: [
        { name: "Ciencias de la Computación" },
        { name: "Música" },
        { name: "Aptitud física" },
        { name: "Fotografía" },
        { name: "Contabilidad" },
        { name: "Filmación" },
        { name: "Ingeniería" },
      ],
    });

    console.log("Éxito");
  } catch (error) {
    console.log("Error al inicializar las categorías de la base de datos", error);
  } finally {
    await database.$disconnect();
  }
}

main();
