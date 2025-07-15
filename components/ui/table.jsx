// app/components/ui/table.jsx
"use client"

import * as React from "react"
import { cn } from "@/components/lib/utils"

function Table({ className, ...props }) {
  return (
    <table
      data-slot="table"
      className={cn(
        // never shrink narrower than 640px
        "min-w-[640px] bg-white",
        className
      )}
      {...props}
    />
  )
}

function TableHeader({ className, ...props }) {
  return (
    <thead
      data-slot="table-header"
      className={cn(
        "bg-gray-50 uppercase text-gray-700 [&_tr]:border-b",
        className
      )}
      {...props}
    />
  )
}

function TableBody({ className, ...props }) {
  return (
    <tbody
      data-slot="table-body"
      className={cn(
        "[&_tr]:border-b [&_tr:nth-child(odd)]:bg-white [&_tr:nth-child(even)]:bg-gray-50",
        className
      )}
      {...props}
    />
  )
}

function TableRow({ className, ...props }) {
  return (
    <tr
      data-slot="table-row"
      className={cn(
        "transition-colors hover:bg-gray-100 data-[state=selected]:bg-blue-50",
        className
      )}
      {...props}
    />
  )
}

function TableHead({ className, ...props }) {
  return (
    <th
      data-slot="table-head"
      className={cn(
        // mobile-first: larger & tighter
        "px-3 py-1 text-base font-semibold tracking-wide",
        // desktop: compact
        "sm:px-4 sm:py-3 sm:text-sm",
        className
      )}
      {...props}
    />
  )
}

function TableCell({ className, ...props }) {
  return (
    <td
      data-slot="table-cell"
      className={cn(
        "px-3 py-1 text-base align-middle",
        "sm:px-4 sm:py-2 sm:text-sm",
        className
      )}
      {...props}
    />
  )
}

export {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
}
