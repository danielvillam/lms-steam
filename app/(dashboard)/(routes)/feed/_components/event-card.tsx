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
    date.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })

  const timeRange = `Horario: ${fmtTime(start)} - ${fmtTime(end)}`

  return (
    <div className="relative bg-white border border-gray-200 rounded-lg shadow-md overflow-hidden max-w-md mx-auto">
      {/* Fecha */}
      <div className="absolute top-3 left-3 bg-yellow-400 px-2 py-1 rounded-md text-center z-10 shadow-sm">
        <span className="block text-xs font-bold text-gray-800">{month}</span>
        <span className="block text-lg font-bold text-gray-800">{day}</span>
      </div>

      {/* Imagen con altura fija */}
      <div className="relative w-full h-48 bg-gray-100">
        <Image
          src={event.imageUrl}
          alt={event.title}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover"
          priority={false}
        />
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
  )
}