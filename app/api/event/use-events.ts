// hooks/use-events.ts
import { useState, useEffect } from 'react'

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

export function useEvents() {
  const [events, setEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchEvents = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const response = await fetch('/api/event')
      
      if (!response.ok) {
        throw new Error('Error al cargar los eventos')
      }
      
      const data = await response.json()
      setEvents(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchEvents()
  }, [])

  // Función para refrescar eventos después de crear/eliminar
  const refetchEvents = () => {
    fetchEvents()
  }

  // Convertir las fechas de eventos a array de Date objects para el calendario
  const eventDates = events.map(event => new Date(event.startDateTime))

  return {
    events,
    eventDates, // Esto es lo que necesitas para el calendario
    loading,
    error,
    refetchEvents
  }
}