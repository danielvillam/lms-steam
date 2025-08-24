'use client'

import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import toast from 'react-hot-toast'
import { useRouter } from 'next/navigation'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import { FileUpload } from '@/components/file-upload' // Importamos el componente de carga de archivos

// Esquema de validación con Zod
const formSchema = z.object({
  title: z.string().min(3, 'El título es obligatorio'),
  description: z.string().min(10, 'La descripción es obligatoria'),
  location: z.string().min(3, 'La ubicación es obligatoria'),
  date: z.date({ required_error: 'Selecciona una fecha' }),
  startTime: z.date({ required_error: 'Selecciona la hora de inicio' }),
  endTime: z.date({ required_error: 'Selecciona la hora de fin' }),
  imageUrl: z.string().url('Se requiere una URL de imagen válida'),
})

type FormValues = z.infer<typeof formSchema>

export default function CreateEventPage() {
  const [imageUrl, setImageUrl] = useState<string | null>(null) // Para almacenar la URL de la imagen
  const router = useRouter()

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
      description: '',
      location: '',
      date: new Date(),
      startTime: new Date(),
      endTime: new Date(),
      imageUrl: '',
    },
  })

  const {
    control,
    handleSubmit,
    formState: { isSubmitting, isValid },
  } = form

  const watched = form.watch()

  const onSubmit = async (data: FormValues) => {
    const startDateTime = new Date(data.date)
    startDateTime.setHours(data.startTime.getHours())
    startDateTime.setMinutes(data.startTime.getMinutes())

    const endDateTime = new Date(data.date)
    endDateTime.setHours(data.endTime.getHours())
    endDateTime.setMinutes(data.endTime.getMinutes())

    // Validación: fin debe ser después de inicio
    if (endDateTime <= startDateTime) {
      toast.error('La hora de fin debe ser posterior a la de inicio')
      return
    }

    try {
      const res = await fetch('/api/event', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: data.title,
          description: data.description,
          location: data.location,
          imageUrl: imageUrl, // Usamos la URL de la imagen cargada
          startDateTime: startDateTime.toISOString(),
          endDateTime: endDateTime.toISOString(),
        }),
      })

      if (!res.ok) {
        const errorData = await res.json()
        toast.error(errorData.message || 'Hubo un error al crear el evento')
        return
      }

      toast.success('Evento creado correctamente')
      router.push('/') // Redirige al feed de eventos
    } catch (err: any) {
      console.error('Error inesperado:', err)
      toast.error('Ocurrió un error inesperado')
    }
  }

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-8">
      <h1 className="text-2xl font-semibold">Crear nuevo evento</h1>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Título */}
        <div>
          <label className="text-lg">Título del Evento</label>
          <Input
            {...form.register('title')}
            placeholder="Ej: Evento Especial"
            disabled={isSubmitting}
          />
        </div>

        {/* Descripción */}
        <div>
          <label className="text-lg">Descripción</label>
          <Input
            {...form.register('description')}
            placeholder="Describe tu evento"
            disabled={isSubmitting}
          />
        </div>

        {/* Ubicación */}
        <div>
          <label className="text-lg">Ubicación</label>
          <Input
            {...form.register('location')}
            placeholder="Dónde se realizará"
            disabled={isSubmitting}
          />
        </div>

        {/* Fecha */}
        <div>
          <label className="text-lg">Fecha</label>
          <DatePicker
            className="w-full rounded-md border px-3 py-2"
            selected={form.watch('date')}
            onChange={(date) => form.setValue('date', date!)}
            dateFormat="P"
            placeholderText="Selecciona un día"
            disabled={isSubmitting}
          />
        </div>

        {/* Hora de inicio */}
        <div>
          <label className="text-lg">Hora de inicio</label>
          <DatePicker
            className="w-full rounded-md border px-3 py-2"
            selected={form.watch('startTime')}
            onChange={(date) => form.setValue('startTime', date!)}
            showTimeSelect
            showTimeSelectOnly
            timeIntervals={30}
            timeCaption="Hora"
            dateFormat="h:mm aa"
            disabled={isSubmitting}
          />
        </div>

        {/* Hora de fin */}
        <div>
          <label className="text-lg">Hora de fin</label>
          <DatePicker
            className="w-full rounded-md border px-3 py-2"
            selected={form.watch('endTime')}
            onChange={(date) => form.setValue('endTime', date!)}
            showTimeSelect
            showTimeSelectOnly
            timeIntervals={30}
            timeCaption="Hora"
            dateFormat="h:mm aa"
            disabled={isSubmitting}
          />
        </div>

        {/* Imagen */}
        <div>
          <label className="text-lg">Imagen</label>
          <FileUpload
            endpoint="eventImage" // Ajusta este endpoint según la configuración de tu API
            action={(url) => {
              if (url) {
                form.setValue('imageUrl', url) // Actualiza el valor del campo imageUrl
                setImageUrl(url) // Guarda la URL de la imagen en el estado local
              }
            }}
          />
        </div>

        {/* Vista previa de la imagen cargada */}
        {imageUrl && (
          <div className="mt-4">
            <img src={imageUrl} alt="Vista previa de la imagen" className="w-full h-48 object-cover rounded-lg" />
          </div>
        )}

        {/* Botón de Enviar */}
        <button
          type="submit"
          className="w-full px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-50"
          disabled={!isValid || isSubmitting}
        >
          Crear evento
        </button>
      </form>
    </div>
  )
}
