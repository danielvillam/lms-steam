// components/CustomCalendar.tsx
'use client'

import * as React from 'react'
import { Calendar, CalendarProps } from '@/components/ui/calendar'
import 'react-day-picker/dist/style.css'

export type CustomCalendarProps = CalendarProps & {
  /** Fechas que tienen al menos un evento */
  eventDates?: Date[]
}

export function CustomCalendar({
  eventDates = [],
  modifiers = {},
  modifiersClassNames = {},
  showOutsideDays = true, // Por defecto mostrar días de otros meses en gris
  ...props
}: CustomCalendarProps) {
  // 1) Construimos nuestro modifier "event", pero sin ponerle
  //    una anotación explícita de tipo: TS infiere correctamente que
  //    eventDates es un Date[] y por tanto CalendarProps['modifiers']
  //    lo acepta.
  const eventModifier = {
    ...modifiers,
    event: eventDates,
  }

  // 2) La clase que pinta el puntito amarillo y asegura días externos en gris
  const eventClassNames = {
    ...modifiersClassNames,
    event:
      'relative ' +
      'after:absolute after:bottom-1 after:right-1 ' +
      'after:block after:w-2 after:h-2 after:rounded-full after:bg-yellow-400',
  }

  return (
    <div className="max-w-xs w-full overflow-hidden">
      <Calendar
        {...props}
        // 3) Mostrar días de otros meses en gris
        showOutsideDays={showOutsideDays}
        // 4) Pasamos los modifiers y sus clases ya mergeados
        modifiers={eventModifier}
        modifiersClassNames={eventClassNames}
        // 5) Asegurar que los estilos de días externos se apliquen correctamente
        classNames={{
          day_outside: "day-outside text-muted-foreground opacity-50",
          ...props.classNames,
        }}
      />
    </div>
  )
}