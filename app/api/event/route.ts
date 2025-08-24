// app/api/event/route.ts

import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db' // Importa la configuración de la base de datos
import { auth } from '@clerk/nextjs/server' // Clerk para autenticación

// Método GET para obtener todos los eventos
export async function GET(req: NextRequest) {
  try {
    const { userId } = await auth() // Verificamos si el usuario está autenticado

    if (!userId) {
      return NextResponse.json({ error: 'No estás autenticado' }, { status: 401 })
    }

    const events = await db.event.findMany() // Obtener todos los eventos
    return NextResponse.json(events) // Respondemos con los eventos
  } catch (error) {
    return NextResponse.json({ error: 'Error al obtener los eventos' }, { status: 500 })
  }
}

// Método POST para crear un nuevo evento
export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth() // Verificamos si el usuario está autenticado

    if (!userId) {
      return NextResponse.json({ error: 'No estás autenticado' }, { status: 401 })
    }

    const { title, description, location, imageUrl, startDateTime, endDateTime } = await req.json()

    // Crear un evento en la base de datos
    const newEvent = await db.event.create({
      data: {
        title,
        userId,
        description,
        imageUrl,
        startDateTime: new Date(startDateTime),
        endDateTime: new Date(endDateTime),
        location,
        
        
      },
    })

    return NextResponse.json(newEvent, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: 'Error al crear el evento' }, { status: 500 })
  }
}
