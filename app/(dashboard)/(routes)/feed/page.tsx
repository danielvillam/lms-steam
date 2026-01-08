'use client'

import React, { useState, useMemo, useEffect } from 'react'
import EventCardReadOnly from '@/app/(dashboard)/(routes)/feed/_components/EventCardReadOnly'
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
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando eventos...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
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
    <div className="min-h-screen flex flex-col">
      {/* Header sin botón de crear evento */}
      <div className="flex-shrink-0 p-4 border-b bg-white">
        <h1 className="text-2xl font-semibold text-gray-800">
          Eventos {events.length > 0 && `(${events.length})`}
        </h1>
      </div>

      {/* Contenido principal - Flexible */}
      <div className="flex flex-1 min-h-0">
        {/* Columna izquierda: eventos - Solo esta columna hace scroll */}
        <div className="w-2/3 overflow-y-auto">
          <div className="p-6 bg-gray-50">
            {displayedEvents.length > 0 ? (
              <div className="space-y-6">
                {displayedEvents.map((event) => (
                  <div key={event.id} className="max-w-2xl mx-auto">
                    <EventCard event={event} />
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center mt-20">
                {events.length === 0 ? (
                  <div>
                    <h3 className="text-xl text-gray-600 mb-2">No hay eventos disponibles</h3>
                    <p className="text-gray-500">No hay eventos para mostrar</p>
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
        </div>

        {/* Columna derecha: calendario - Fijo, sin scroll propio */}
        <div className="w-1/3 border-l bg-white flex flex-col">
          <div className="p-6">
            <h2 className="text-lg font-semibold mb-4 text-gray-800">Calendario</h2>
            <div className="space-y-4">
              <CustomCalendar
                selected={selectedDay}
                onSelect={setSelectedDay}
                className="rounded-md shadow-sm border"
                eventDates={eventDates}
                showEventDetails={true}
              />
            </div>
            
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

// Componente individual para cada evento (versión solo lectura)
function EventCard({ event }: { event: Event }) {
  const [isModalOpen, setIsModalOpen] = useState(false)
  
  const start = new Date(event.startDateTime)
  const end = new Date(event.endDateTime)

  const fmtTime = (date: Date) =>
    date.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })

  const timeRange = `${fmtTime(start)} - ${fmtTime(end)}`

  // Determinar si el evento ya pasó
  const isPastEvent = start < new Date()

  const openModal = () => setIsModalOpen(true)
  const closeModal = () => setIsModalOpen(false)

  return (
    <>
      <div className={`bg-white border border-gray-200 rounded-lg shadow-md overflow-hidden ${isPastEvent ? 'opacity-75' : ''}`}>
        {/* Header con fecha */}
        <div className={`px-6 py-4 border-b ${isPastEvent ? 'bg-gray-50' : 'bg-blue-50'}`}>
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-semibold text-gray-800 mb-1">{event.title}</h3>
              <div className="flex items-center text-sm text-gray-600">
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3a1 1 0 012 0v4h2V3a1 1 0 012 0v4h2V3a1 1 0 012 0v4a1 1 0 011 1v6a1 1 0 01-1 1H7a1 1 0 01-1-1V8a1 1 0 011-1z" />
                </svg>
                {start.toLocaleDateString('es-ES', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </div>
            </div>
            {isPastEvent && (
              <span className="bg-gray-500 text-white text-xs px-2 py-1 rounded-full">
                Finalizado
              </span>
            )}
          </div>
        </div>

        {/* Imagen clickeable */}
        <div 
          className="relative w-full h-64 bg-gray-100 cursor-pointer hover:opacity-90 transition-opacity"
          onClick={openModal}
        >
          <img
            src={event.imageUrl}
            alt={event.title}
            className="w-full h-full object-cover"
          />
          {/* Indicador de que es clickeable */}
          <div className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity bg-black bg-opacity-20">
            <div className="bg-white bg-opacity-90 rounded-full p-2">
              <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
              </svg>
            </div>
          </div>
        </div>

        {/* Información del evento */}
        <div className="p-6">
          <p className="text-gray-600 mb-4 leading-relaxed">{event.description}</p>
          
          <div className="space-y-3">
            <div className="flex items-center text-gray-700">
              <svg className="w-5 h-5 mr-3 text-gray-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span className="font-medium">{event.location}</span>
            </div>
            
            <div className="flex items-center text-gray-700">
              <svg className="w-5 h-5 mr-3 text-gray-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="font-medium">{timeRange}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Modal para imagen completa */}
      {isModalOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4"
          onClick={closeModal}
        >
          <div className="relative max-w-4xl max-h-[90vh] w-full h-full">
            {/* Botón cerrar */}
            <button
              onClick={closeModal}
              className="absolute top-4 right-4 z-10 bg-white bg-opacity-90 hover:bg-opacity-100 rounded-full p-2 transition-colors"
            >
              <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {/* Información del evento */}
            <div className="absolute bottom-4 left-4 right-4 z-10 bg-black bg-opacity-75 text-white p-4 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-xl font-bold">{event.title}</h3>
                {isPastEvent && (
                  <span className="bg-gray-600 text-xs px-2 py-1 rounded">
                    Evento finalizado
                  </span>
                )}
              </div>
              <p className="text-sm mb-2 opacity-90">{event.description}</p>
              <div className="flex flex-wrap gap-4 text-sm">
                <span className="flex items-center">
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  {event.location}
                </span>
                <span className="flex items-center">
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {timeRange}
                </span>
                <span className="flex items-center">
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3a1 1 0 012 0v4h2V3a1 1 0 012 0v4h2V3a1 1 0 012 0v4a1 1 0 011 1v6a1 1 0 01-1 1H7a1 1 0 01-1-1V8a1 1 0 011-1z" />
                  </svg>
                  {start.getDate()} {start.toLocaleDateString('es-ES', { month: 'long' })} {start.getFullYear()}
                </span>
              </div>
            </div>

            {/* Imagen completa */}
            <img
              src={event.imageUrl}
              alt={event.title}
              className="w-full h-full object-contain"
            />
          </div>
        </div>
      )}
    </>
  )
}