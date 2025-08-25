// app/api/event/route.ts

import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { auth } from '@clerk/nextjs/server'

// Esquema de validación simple
interface CreateEventData {
  title: string
  description?: string
  location: string
  imageUrl?: string
  startDateTime: string
  endDateTime: string
}

function validateEventData(data: any): CreateEventData {
  const { title, description, location, imageUrl, startDateTime, endDateTime } = data

  if (!title || typeof title !== 'string' || title.trim().length === 0) {
    throw new Error('El título es requerido')
  }

  if (!location || typeof location !== 'string' || location.trim().length === 0) {
    throw new Error('La ubicación es requerida')
  }

  if (!startDateTime || !endDateTime) {
    throw new Error('Las fechas de inicio y fin son requeridas')
  }

  const startDate = new Date(startDateTime)
  const endDate = new Date(endDateTime)

  if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
    throw new Error('Las fechas deben tener un formato válido')
  }

  if (startDate >= endDate) {
    throw new Error('La fecha de inicio debe ser anterior a la fecha de fin')
  }

  if (startDate < new Date()) {
    throw new Error('La fecha de inicio no puede ser en el pasado')
  }

  return {
    title: title.trim(),
    description: description?.trim(),
    location: location.trim(),
    imageUrl: imageUrl?.trim(),
    startDateTime,
    endDateTime
  }
}

// Método GET para obtener todos los eventos
export async function GET(req: NextRequest) {
  try {
    const { userId } = await auth()

    if (!userId) {
      return NextResponse.json({ error: 'No estás autenticado' }, { status: 401 })
    }

    // Obtener solo eventos futuros, ordenados por fecha
    const events = await db.event.findMany({
      where: {
        startDateTime: {
          gte: new Date()
        }
      },
      orderBy: {
        startDateTime: 'asc'
      },
      select: {
        id: true,
        title: true,
        description: true,
        location: true,
        imageUrl: true,
        startDateTime: true,
        endDateTime: true,
        userId: true,
        createdAt: true
      }
    })

    return NextResponse.json(events)
  } catch (error) {
    console.error('Error fetching events:', error)
    return NextResponse.json(
      { error: 'Error al obtener los eventos' }, 
      { status: 500 }
    )
  }
}

// Método POST para crear un nuevo evento
export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth()

    if (!userId) {
      return NextResponse.json({ error: 'No estás autenticado' }, { status: 401 })
    }

    const body = await req.json()
    
    // Validar los datos
    const validatedData = validateEventData(body)

    // Crear el evento en la base de datos
    const newEvent = await db.event.create({
      data: {
        ...validatedData,
        userId,
        startDateTime: new Date(validatedData.startDateTime),
        endDateTime: new Date(validatedData.endDateTime),
      },
    })

    return NextResponse.json(newEvent, { status: 201 })
  } catch (error) {
    console.error('Error creating event:', error)
    
    if (error instanceof Error) {
      return NextResponse.json(
        { error: error.message }, 
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: 'Error al crear el evento' }, 
      { status: 500 }
    )
  }
}

// Método DELETE para borrar un evento
export async function DELETE(req: NextRequest) {
  try {
    const { userId } = await auth()

    if (!userId) {
      return NextResponse.json({ error: 'No estás autenticado' }, { status: 401 })
    }

    const url = new URL(req.url)
    const eventId = url.searchParams.get('id')

    if (!eventId) {
      return NextResponse.json(
        { error: 'ID del evento es requerido' }, 
        { status: 400 }
      )
    }

    // Verificar que el evento existe y pertenece al usuario
    const existingEvent = await db.event.findFirst({
      where: {
        id: eventId,
        userId: userId
      }
    })

    if (!existingEvent) {
      return NextResponse.json(
        { error: 'Evento no encontrado o no tienes permisos para eliminarlo' }, 
        { status: 404 }
      )
    }

    // Eliminar el evento
    await db.event.delete({
      where: {
        id: eventId
      }
    })

    return NextResponse.json({ 
      message: 'Evento eliminado correctamente',
      eventId: eventId 
    })
  } catch (error) {
    console.error('Error deleting event:', error)
    return NextResponse.json(
      { error: 'Error al eliminar el evento' }, 
      { status: 500 }
    )
  }
}