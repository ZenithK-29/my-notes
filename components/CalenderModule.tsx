"use client"

import * as React from "react"
import { Calendar } from "@/components/ui/calendar"
interface Props {
  selected: Date | undefined,
  onSelect: (date: Date | undefined) => void
}

export function CalendarDemo({selected, onSelect}: Props) {


  return (
    <Calendar
      mode="single"
      selected={selected}
      onSelect={onSelect}
      className="rounded-lg border"
      captionLayout="dropdown"
    />
  )
}
