// components/EventCardReadOnly.tsx
'use client'

import Image from 'next/image'
import React, { useState, useEffect } from 'react'

interface Event {
  id: string
  title: string
  description: string
  imageUrl: string
  startDateTime: string // ISO
  endDateTime: string   // ISO
  location: string
  userId: string
}

interface EventCardReadOnlyProps {
  /** Mostrar solo eventos recientes (últimos 30 días por defecto) */
  showRecentEvents?: boolean
  /** Número de días hacia atrás para considerar eventos recientes */
  daysBack?: number
  /** Número máximo de eventos a mostrar */
  maxEvents?: number
  /** Callback cuando se carga la lista de eventos */
  onEventsLoaded?: (events: Event[]) => void
}

const MONTHS_ABBR = ['ENE', 'FEB', 'MAR', 'ABR', 'MAY', 'JUN', 'JUL', 'AGO', 'SEP', 'OCT', 'NOV', 'DIC']

export default function EventCardReadOnly({ 
  showRecentEvents = true,
  daysBack = 30,
  maxEvents = 10,
  onEventsLoaded
}: EventCardReadOnlyProps) {
  const [events, setEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Obtener eventos de la API
  const fetchEvents = async () => {
    try {
      setLoading(true)
      setError(null)
      
      // Construir URL con parámetros según configuración
      let url = '/api/event'
      const params = new URLSearchParams()
      
      if (showRecentEvents) {
        params.append('includePast', 'true')
        params.append('daysBack', daysBack.toString())
      }
      
      if (params.toString()) {
        url += `?${params.toString()}`
      }

      const response = await fetch(url)
      
      if (!response.ok) {
        throw new Error('Error al cargar los eventos')
      }
      
      const data = await response.json()
      
      // Filtrar y limitar eventos según configuración
      let filteredEvents = data
      
      if (showRecentEvents) {
        const cutoffDate = new Date()
        cutoffDate.setDate(cutoffDate.getDate() - daysBack)
        
        filteredEvents = data.filter((event: Event) => {
          const eventDate = new Date(event.startDateTime)
          return eventDate >= cutoffDate
        })
      }
      
      // Ordenar por fecha más reciente primero
      filteredEvents.sort((a: Event, b: Event) => 
        new Date(b.startDateTime).getTime() - new Date(a.startDateTime).getTime()
      )
      
      // Limitar número de eventos
      const limitedEvents = filteredEvents.slice(0, maxEvents)
      
      setEvents(limitedEvents)
      onEventsLoaded?.(limitedEvents)
      
      console.log(`📅 Eventos recientes cargados: ${limitedEvents.length}`)
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchEvents()
  }, [showRecentEvents, daysBack, maxEvents])

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
        <span className="ml-2 text-sm text-gray-600">Cargando eventos...</span>
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-4 border border-red-200 rounded-md bg-red-50">
        <p className="text-red-600 text-sm">Error: {error}</p>
        <button 
          onClick={fetchEvents}
          className="mt-2 px-3 py-1 bg-red-100 text-red-700 text-xs rounded hover:bg-red-200"
        >
          Reintentar
        </button>
      </div>
    )
  }

  if (events.length === 0) {
    return (
      <div className="p-8 text-center">
        <p className="text-gray-500 text-sm">
          {showRecentEvents 
            ? `No hay eventos de los últimos ${daysBack} días`
            : 'No hay eventos disponibles'
          }
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {showRecentEvents && (
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-gray-900">
            Eventos recientes
          </h2>
          <p className="text-sm text-gray-600">
            Últimos {daysBack} días • {events.length} evento{events.length !== 1 ? 's' : ''}
          </p>
        </div>
      )}
      
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {events.map((event) => (
          <EventCard key={event.id} event={event} />
        ))}
      </div>
    </div>
  )
}

// Componente individual para cada evento
function EventCard({ event }: { event: Event }) {
  const [isModalOpen, setIsModalOpen] = useState(false)
  
  const start = new Date(event.startDateTime)
  const end = new Date(event.endDateTime)

  const month = MONTHS_ABBR[start.getMonth()]
  const day = start.getDate()

  const fmtTime = (date: Date) =>
    date.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })

  const timeRange = `Horario: ${fmtTime(start)} - ${fmtTime(end)}`

  // Determinar si el evento ya pasó
  const isPastEvent = start < new Date()

  const openModal = () => setIsModalOpen(true)
  const closeModal = () => setIsModalOpen(false)

  return (
    <>
      <div className={`relative bg-white border border-gray-200 rounded-lg shadow-md overflow-hidden max-w-md mx-auto ${isPastEvent ? 'opacity-75' : ''}`}>
        {/* Fecha */}
        <div className={`absolute top-3 left-3 px-2 py-1 rounded-md text-center z-10 shadow-sm ${
          isPastEvent ? 'bg-gray-300' : 'bg-yellow-400'
        }`}>
          <span className="block text-xs font-bold text-gray-800">{month}</span>
          <span className="block text-lg font-bold text-gray-800">{day}</span>
        </div>

        {/* Indicador de evento pasado */}
        {isPastEvent && (
          <div className="absolute top-3 right-3 bg-gray-600 text-white text-xs px-2 py-1 rounded-md z-10">
            Finalizado
          </div>
        )}

        {/* Imagen clickeable */}
        <div 
          className="relative w-full h-48 bg-gray-100 cursor-pointer hover:opacity-90 transition-opacity"
          onClick={openModal}
        >
          <Image
            src={event.imageUrl}
            alt={event.title}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover"
            priority={false}
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

        {/* Información */}
        <div className="p-4">
          <h3 className="text-lg font-semibold mb-2 text-gray-800 line-clamp-2">
            {event.title}
          </h3>
          <p className="text-sm text-gray-600 mb-3 line-clamp-2">
            {event.description}
          </p>
          <div className="space-y-1">
            <p className="text-sm text-gray-700 font-medium flex items-center">
              <svg className="w-4 h-4 mr-2 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              {event.location}
            </p>
            <p className="text-sm text-gray-700 font-medium flex items-center">
              <svg className="w-4 h-4 mr-2 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {timeRange}
            </p>
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
                  {day} {month} {start.getFullYear()}
                </span>
              </div>
            </div>

            {/* Imagen completa */}
            <Image
              src={event.imageUrl}
              alt={event.title}
              fill
              sizes="90vw"
              className="object-contain"
              priority={true}
            />
          </div>
        </div>
      )}
    </>
  )
}