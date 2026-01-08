// components/CustomCalendar.tsx
'use client'

import * as React from 'react'
import { useState, useEffect } from 'react'
import { Calendar } from '@/components/ui/calendar'
import { Loader2 } from 'lucide-react'

interface Event {
  id: string
  title: string
  description?: string
  location: string
  imageUrl?: string
  startDateTime: string
  endDateTime: string
  userId: string
  createdAt: string
}

export type CustomCalendarProps = {
  /** Fecha seleccionada controlada desde el componente padre */
  selected?: Date | undefined
  /** Función callback para manejar la selección de fecha */
  onSelect?: (date: Date | undefined) => void
  /** Fechas de eventos para mostrar indicadores */
  eventDates?: Date[]
  /** Mostrar información de eventos debajo del calendario */
  showEventDetails?: boolean
  showOutsideDays?: boolean
  className?: string
  classNames?: Record<string, string>
}

export function CustomCalendar({
  selected,
  onSelect,
  eventDates = [],
  showEventDetails = true,
  showOutsideDays = true,
  className,
  ...props
}: CustomCalendarProps) {
  const [events, setEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Obtener eventos de la API
  const fetchEvents = async () => {
    try {
      setLoading(true)
      setError(null)
      
      // Incluir eventos pasados para el calendario
      const response = await fetch('/api/event?includePast=true')
      
      if (!response.ok) {
        throw new Error('Error al cargar los eventos')
      }
      
      const data = await response.json()
      setEvents(data)
      
      // Debug
      console.log('📅 Eventos cargados:', data.length)
      console.log('📅 Eventos:', data)
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchEvents()
  }, [])

  // Usar eventDates del prop si se proporciona, sino usar eventos internos
  const calendarEventDates = eventDates.length > 0 
    ? eventDates 
    : events.map(event => new Date(event.startDateTime))

  // Configurar modifiers para marcar fechas con eventos
  const modifiers = {
    event: calendarEventDates,
  }

  // Estilos para fechas con eventos
  const modifiersClassNames = {
    event:
      'relative !bg-blue-50 !text-blue-900 hover:!bg-blue-100 ' +
      'after:absolute after:bottom-0.5 after:right-0.5 ' +
      'after:block after:w-2 after:h-2 after:rounded-full after:bg-yellow-500 after:shadow-sm',
  }

  // Manejar selección de fecha
  const handleDateSelect = (date: Date | undefined) => {
    onSelect?.(date)
  }

  // Obtener eventos para la fecha seleccionada
  const getEventsForDate = (date: Date) => {
    return events.filter(event => {
      const eventDate = new Date(event.startDateTime)
      return eventDate.toDateString() === date.toDateString()
    })
  }

  if (loading) {
    return (
      <div className={className}>
        <div className="flex items-center justify-center p-8 border rounded-lg">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span className="ml-2 text-sm text-gray-600">Cargando eventos...</span>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className={className}>
        <div className="p-4 border border-red-200 rounded-md bg-red-50">
          <p className="text-red-600 text-sm">Error: {error}</p>
          <button 
            onClick={fetchEvents}
            className="mt-2 px-3 py-1 bg-red-100 text-red-700 text-xs rounded hover:bg-red-200"
          >
            Reintentar
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full space-y-4">
      <Calendar
        {...props}
        mode="single"
        selected={selected}
        onSelect={handleDateSelect}
        showOutsideDays={showOutsideDays}
        modifiers={modifiers}
        modifiersClassNames={modifiersClassNames}
        className={className}
        classNames={{
          day_outside: "day-outside text-muted-foreground opacity-50 hover:bg-accent hover:text-accent-foreground",
          head_cell: "text-muted-foreground rounded-md w-9 font-normal text-[0.8rem] text-center",
          ...props.classNames,
        }}
      />

      {/* Mostrar eventos para la fecha seleccionada - SOLO del día específico */}
      {showEventDetails && selected && (
        <EventsForSelectedDate 
          date={selected} 
          events={getEventsForDate(selected)}
        />
      )}

      {/* Próximos eventos - solo eventos futuros */}
      {showEventDetails && events.length > 0 && (
        <UpcomingEvents 
          events={events
            .filter(event => new Date(event.startDateTime) >= new Date()) // Solo futuros
            .slice(0, 3)
          } 
        />
      )}
    </div>
  )
}

// Componente para mostrar eventos de la fecha seleccionada - SOLO de ese día específico
function EventsForSelectedDate({ date, events }: { date: Date, events: Event[] }) {
  // Filtrar eventos que sean exactamente del día seleccionado
  const eventsForExactDate = events.filter(event => {
    const eventDate = new Date(event.startDateTime)
    return eventDate.toDateString() === date.toDateString()
  })

  if (eventsForExactDate.length === 0) {
    return (
      <div className="p-3 bg-gray-50 rounded-md">
        <p className="text-sm text-gray-600">
          No hay eventos para {date.toLocaleDateString('es-ES', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          })}
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      <h3 className="font-medium text-sm text-gray-900">
        Eventos para {date.toLocaleDateString('es-ES', { 
          weekday: 'long', 
          year: 'numeric', 
          month: 'long', 
          day: 'numeric' 
        })} ({eventsForExactDate.length}):
      </h3>
      
      {/* Layout vertical - un evento debajo del otro */}
      <div className="space-y-3">
        {eventsForExactDate.map((event) => {
          const eventDate = new Date(event.startDateTime)
          const isPastEvent = eventDate < new Date()
          
          return (
            <div 
              key={event.id} 
              className={`p-4 rounded-lg border-l-4 transition-all duration-200 ${
                isPastEvent 
                  ? 'bg-gray-50 border-gray-400 opacity-75' 
                  : 'bg-blue-50 border-blue-400 hover:bg-blue-100'
              }`}
            >
              {/* Header con título y estado */}
              <div className="flex items-start justify-between mb-2">
                <h4 className={`font-medium text-base ${
                  isPastEvent ? 'text-gray-700' : 'text-blue-900'
                }`}>
                  {event.title}
                </h4>
                {isPastEvent && (
                  <span className="bg-gray-500 text-white text-xs px-2 py-1 rounded-full">
                    Finalizado
                  </span>
                )}
              </div>

              {/* Descripción */}
              {event.description && (
                <p className="text-sm text-gray-600 mb-3 leading-relaxed">
                  {event.description}
                </p>
              )}

              {/* Información del evento */}
              <div className="grid gap-2 text-sm">
                <div className="flex items-center text-gray-700">
                  <svg className="w-4 h-4 mr-2 text-gray-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span className="font-medium">📍 {event.location}</span>
                </div>
                
                <div className="flex items-center text-gray-700">
                  <svg className="w-4 h-4 mr-2 text-gray-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="font-medium">
                    🕐 {new Date(event.startDateTime).toLocaleTimeString('es-ES', { 
                      hour: '2-digit', 
                      minute: '2-digit' 
                    })} - {new Date(event.endDateTime).toLocaleTimeString('es-ES', { 
                      hour: '2-digit', 
                      minute: '2-digit' 
                    })}
                  </span>
                </div>

                {/* Fecha completa (útil para verificar) */}
                <div className="flex items-center text-gray-600 text-xs">
                  <svg className="w-3 h-3 mr-2 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3a1 1 0 012 0v4h2V3a1 1 0 012 0v4h2V3a1 1 0 012 0v4a1 1 0 011 1v6a1 1 0 01-1-1V8a1 1 0 011-1z" />
                  </svg>
                  {eventDate.toLocaleDateString('es-ES', { 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric',
                    weekday: 'long'
                  })}
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

// Componente para mostrar próximos eventos
function UpcomingEvents({ events }: { events: Event[] }) {
  if (events.length === 0) return null

  return (
    <div className="space-y-3">
      <h3 className="font-medium text-sm text-gray-900">Próximos eventos:</h3>
      {events.map((event) => (
        <div key={event.id} className="p-2 bg-gray-50 rounded-md border-l-2 border-gray-300">
          <div className="flex items-center justify-between">
            <h4 className="font-medium text-xs">{event.title}</h4>
            <span className="text-xs text-gray-500">
              {new Date(event.startDateTime).toLocaleDateString('es-ES')}
            </span>
          </div>
          <p className="text-xs text-gray-600 mt-1">📍 {event.location}</p>
        </div>
      ))}
    </div>
  )
}