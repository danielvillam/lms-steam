'use client'

import React, { useState, useMemo } from 'react'
import Link from 'next/link'
import EventCard from '@/app/(dashboard)/(routes)/feed/_components/event-card'
import { CustomCalendar } from '@/app/(dashboard)/(routes)/feed/_components/custom-calendar'
import { isSameDay, parseISO, compareAsc } from 'date-fns'
import { Button } from '@/components/ui/button'

interface Event {
  id: string
  title: string
  description: string
  location: string
  imageUrl: string
  startDateTime: string // ISO
  endDateTime: string   // ISO
}

// Datos de ejemplo; en producción venían de una llamada a tu API
const EVENTS: Event[] = [
  {
    id: '1',
    title: 'Charla de Ingeniería',
    description: 'Un conversatorio sobre sistemas sostenibles.',
    location: 'Aula Máxima Pedro Nel Gómez',
    imageUrl: '/images/event1.jpg',
    startDateTime: '2025-04-21T10:00:00.000Z',
    endDateTime: '2025-04-21T12:00:00.000Z',
  },
  {
    id: '2',
    title: 'Workshop de React',
    description: 'Taller práctico de React y Next.js.',
    location: 'Sala de cómputo 3',
    imageUrl: '/images/event2.jpg',
    startDateTime: '2025-04-25T14:00:00.000Z',
    endDateTime: '2025-04-25T16:00:00.000Z',
  },
  {
    id: '3',
    title: 'Reto Steam',
    description: 'Reto de la semana steam',
    location: 'Aula Steam M3 - 120',
    imageUrl: '/images/Reto setam.png',
    startDateTime: '2025-04-25T19:00:00.000Z',
    endDateTime: '2025-04-25T21:00:00.000Z',
  },
  // …otros eventos
]

export default function EventsPage() {
  const [selectedDay, setSelectedDay] = useState<Date | undefined>(undefined)

  const eventDates = useMemo(
    () => EVENTS.map(e => parseISO(e.startDateTime)),
    []
  )

  const displayedEvents = useMemo(() => {
    if (selectedDay) {
      return EVENTS.filter(e =>
        isSameDay(parseISO(e.startDateTime), selectedDay)
      )
    }
    const today = new Date()
    const future = EVENTS
      .filter(e => compareAsc(parseISO(e.startDateTime), today) >= 0)
      .sort((a, b) =>
        compareAsc(parseISO(a.startDateTime), parseISO(b.startDateTime))
      )
    return future.slice(0, 1)
  }, [selectedDay])

  return (
    <div className="h-screen flex flex-col">
      {/* Botón superior */}
      <div className="p-4 border-b bg-white flex justify-end">
        <Link href="/teacher/feed/create" passHref>
          <Button variant="default">Crear Evento</Button>
        </Link>
      </div>

      {/* Contenido principal */}
      <div className="flex flex-1 overflow-hidden">
        {/* Columna izquierda: eventos */}
        <div className="w-2/3 overflow-y-auto p-6 bg-gray-50">
          {displayedEvents.length > 0 ? (
            <div className="flex flex-wrap justify-center gap-14">
              {displayedEvents.map((e) => (
                <div key={e.id} className="w-full md:w-1/2">
                  <EventCard event={e} />
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-500 mt-20">
              No hay eventos para esta fecha.
            </p>
          )}
        </div>

        {/* Columna derecha: calendario */}
        <div className="w-1/3 border-l p-12 sticky top-16 bg-white">
          <CustomCalendar
            mode="single"
            selected={selectedDay}
            onSelect={setSelectedDay}
            className="rounded-md shadow"
            eventDates={eventDates}
          />
        </div>
      </div>
    </div>
  )
}
