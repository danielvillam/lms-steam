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
  ...props
}: CustomCalendarProps) {
  // 1) Construimos nuestro modifier “event”, pero sin ponerle
  //    una anotación explícita de tipo: TS infiere correctamente que
  //    eventDates es un Date[] y por tanto CalendarProps['modifiers']
  //    lo acepta.
  const eventModifier = {
    ...modifiers,
    event: eventDates,
  }

  // 2) La clase que pinta el puntito amarillo
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
        // 3) Pasamos los modifiers y sus clases ya mergeados
        modifiers={eventModifier}
        modifiersClassNames={eventClassNames}
      />
    </div>
  )
}