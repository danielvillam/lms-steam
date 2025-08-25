// scripts/cleanup-events.js
const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function cleanupEvents() {
  try {
    console.log('🧹 Limpiando eventos con userId null...')
    
    // Contar eventos con userId null
    const count = await prisma.event.count({
      where: {
        userId: null
      }
    })
    
    console.log(`📊 Encontrados ${count} eventos con userId null`)
    
    if (count > 0) {
      // Eliminar eventos con userId null
      const deleted = await prisma.event.deleteMany({
        where: {
          userId: null
        }
      })
      
      console.log(`✅ Eliminados ${deleted.count} eventos`)
    }
    
    console.log('🎉 Limpieza completada!')
    
  } catch (error) {
    console.error('❌ Error durante la limpieza:', error)
  } finally {
    await prisma.$disconnect()
  }
}

cleanupEvents()