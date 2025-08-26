'use client'

import React, { useState, useMemo, useEffect } from 'react'
import Link from 'next/link'
import EventCard from '@/app/(dashboard)/(routes)/teacher/feed/_components/EventCard'
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
      {/* Botón superior */}
      <div className="p-4 border-b bg-white flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-gray-800">
          Eventos {events.length > 0 && `(${events.length})`}
        </h1>
        <Link href="/teacher/feed/create" passHref>
          <Button variant="default">Crear Evento</Button>
        </Link>
      </div>

      {/* Contenido principal */}
      <div className="flex flex-1 overflow-hidden">
        {/* Columna izquierda: eventos */}
        <div className="w-2/3 overflow-y-auto p-6 bg-gray-50">
          {displayedEvents.length > 0 ? (
            <div className="space-y-6">
              {displayedEvents.map((e) => (
                <div key={e.id} className="max-w-2xl mx-auto">
                  <EventCard event={e} />
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center mt-20">
              {events.length === 0 ? (
                <div>
                  <h3 className="text-xl text-gray-600 mb-2">No hay eventos creados</h3>
                  <p className="text-gray-500 mb-6">Comienza creando tu primer evento</p>
                  <Link href="/teacher/feed/create">
                    <Button>Crear mi primer evento</Button>
                  </Link>
                </div>
              ) : (
                <div>
                  <h3 className="text-xl text-gray-600 mb-2">
                    {selectedDay 
                      ? "No hay eventos para esta fecha" 
                      : "No hay eventos próximos"
                    }
                  </h3>
                  {selectedDay && (
                    <Button 
                      variant="outline" 
                      onClick={() => setSelectedDay(undefined)}
                      className="mt-4"
                    >
                      Ver todos los eventos
                    </Button>
                  )}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Columna derecha: calendario */}
        <div className="w-1/3 border-l p-6 bg-white">
          <div className="sticky top-6">
            <h2 className="text-lg font-semibold mb-4 text-gray-800">Calendario</h2>
            <CustomCalendar
              mode="single"
              selected={selectedDay}
              onSelect={setSelectedDay}
              className="rounded-md shadow-sm border"
              eventDates={eventDates}
            />
            {selectedDay && (
              <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                <p className="text-sm text-blue-800 font-medium">
                  Mostrando eventos del {selectedDay.toLocaleDateString('es-ES', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </p>
                <button 
                  onClick={() => setSelectedDay(undefined)}
                  className="text-xs text-blue-600 hover:text-blue-800 mt-2"
                >
                  Limpiar selección
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}