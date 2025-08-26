// components/EventCard.tsx
'use client'

import Image from 'next/image'
import React, { useState } from 'react'

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

interface EventCardProps {
  event: Event
  onEventDeleted?: (eventId: string) => void
}

const MONTHS_ABBR = ['ENE', 'FEB', 'MAR', 'ABR', 'MAY', 'JUN', 'JUL', 'AGO', 'SEP', 'OCT', 'NOV', 'DIC']

export default function EventCard({ event, onEventDeleted }: EventCardProps) {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  
  const start = new Date(event.startDateTime)
  const end = new Date(event.endDateTime)

  const month = MONTHS_ABBR[start.getMonth()]
  const day = start.getDate()

  const fmtTime = (date: Date) =>
    date.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })

  const timeRange = `Horario: ${fmtTime(start)} - ${fmtTime(end)}`

  const openModal = () => setIsModalOpen(true)
  const closeModal = () => setIsModalOpen(false)

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    setShowDeleteConfirm(true)
  }

  const handleDeleteConfirm = async () => {
    setIsDeleting(true)
    try {
      const response = await fetch(`/api/event?id=${event.id}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Error al eliminar el evento')
      }

      // Notificar al componente padre que el evento fue eliminado
      onEventDeleted?.(event.id)
      setShowDeleteConfirm(false)
    } catch (error) {
      console.error('Error deleting event:', error)
      alert(error instanceof Error ? error.message : 'Error al eliminar el evento')
    } finally {
      setIsDeleting(false)
    }
  }

  const handleDeleteCancel = (e: React.MouseEvent) => {
    e.stopPropagation()
    setShowDeleteConfirm(false)
  }

  return (
    <>
      <div className="relative bg-white border border-gray-200 rounded-lg shadow-md overflow-hidden max-w-md mx-auto">
        {/* Fecha */}
        <div className="absolute top-3 left-3 bg-yellow-400 px-2 py-1 rounded-md text-center z-10 shadow-sm">
          <span className="block text-xs font-bold text-gray-800">{month}</span>
          <span className="block text-lg font-bold text-gray-800">{day}</span>
        </div>

        {/* Botón de eliminar */}
        <div className="absolute bottom-3 right-3 z-10">
          {showDeleteConfirm ? (
            <div className="flex space-x-1">
              <button
                onClick={handleDeleteCancel}
                className="bg-gray-500 hover:bg-gray-600 text-white rounded-full p-1.5 shadow-sm transition-colors"
                disabled={isDeleting}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
              <button
                onClick={handleDeleteConfirm}
                disabled={isDeleting}
                className="bg-red-500 hover:bg-red-600 text-white rounded-full p-1.5 shadow-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isDeleting ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </button>
            </div>
          ) : (
            <button
              onClick={handleDeleteClick}
              className="bg-red-500 hover:bg-red-600 text-white rounded-full p-1.5 shadow-sm transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          )}
        </div>

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
              <h3 className="text-xl font-bold mb-2">{event.title}</h3>
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
                  {day} {month}
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