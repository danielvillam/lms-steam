// components/EventCard.tsx
'use client'

import Image from 'next/image'
import React from 'react'

interface Event {
  id: string
  title: string
  description: string
  imageUrl: string
  startDateTime: string // ISO
  endDateTime: string   // ISO
  location: string
}

interface EventCardProps {
  event: Event
}

const MONTHS_ABBR = ['ENE', 'FEB', 'MAR', 'ABR', 'MAY', 'JUN', 'JUL', 'AGO', 'SEP', 'OCT', 'NOV', 'DIC']

export default function EventCard({ event }: EventCardProps) {
  const start = new Date(event.startDateTime)
  const end = new Date(event.endDateTime)

  const month = MONTHS_ABBR[start.getMonth()]
  const day = start.getDate()

  const fmtTime = (date: Date) =>
    date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })

  const timeRange = `Horario: ${fmtTime(start)} - ${fmtTime(end)}`

  return (
    <div className="relative bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
      {/* Fecha */}
      <div className="absolute top-3 left-3 bg-yellow-300 px-2 py-1 rounded-md text-center z-10">
        <span className="block text-xs font-bold">{month}</span>
        <span className="block text-sm">{day}</span>
      </div>

      {/* Imagen */}
      <div className="w-full h-full relative element-background">
        <Image
          src={event.imageUrl}
          alt={event.title}
           width={500} height={500}
          style={{ objectFit: 'cover' }}
        />
      </div>

      {/* Información */}
      <div className="p-4">
        <h3 className="text-lg font-semibold mb-2">{event.title}</h3>
        <p className="text-sm text-gray-600 mb-2">{event.description}</p>
        <p className="text-sm text-gray-600 mb-1">{event.location}</p>
        <p className="text-sm text-gray-600">{timeRange}</p>
      </div>
    </div>
  )
}
