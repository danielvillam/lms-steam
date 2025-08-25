'use client'

import React, { useState, useMemo, useEffect } from 'react'
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
  userId: string
}

export default function EventsPage() {
  const [selectedDay, setSelectedDay] = useState<Date | undefined>(undefined)
  const [events, setEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Fetch events from API
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true)
        const response = await fetch('/api/event')
        
        if (!response.ok) {
          throw new Error('Error al cargar los eventos')
        }
        
        const data = await response.json()
        setEvents(data)
        setError(null)
      } catch (err) {
        console.error('Error fetching events:', err)
        setError(err instanceof Error ? err.message : 'Error desconocido')
      } finally {
        setLoading(false)
      }
    }

    fetchEvents()
  }, [])

  const eventDates = useMemo(
    () => events.map(e => parseISO(e.startDateTime)),
    [events]
  )

  const displayedEvents = useMemo(() => {
    if (selectedDay) {
      return events.filter(e =>
        isSameDay(parseISO(e.startDateTime), selectedDay)
      )
    }
    const today = new Date()
    const future = events
      .filter(e => compareAsc(parseISO(e.startDateTime), today) >= 0)
      .sort((a, b) =>
        compareAsc(parseISO(a.startDateTime), parseISO(b.startDateTime))
      )
    return future
  }, [selectedDay, events])

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando eventos...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500 mb-4">Error: {error}</p>
          <Button onClick={() => window.location.reload()}>
            Reintentar
          </Button>
        </div>
      </div>
    )
  }

return (
    <div className="h-screen flex flex-col">
      {/* Contenedor con fondo común */}
      <div className="flex flex-1 overflow-hidden bg-gray-50">
        {/* Columna izquierda: eventos */}
        <div className="w-2/3 overflow-y-auto p-6">
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

        {/* Columna derecha: calendario (fijo en su lugar) */}
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