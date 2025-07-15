"use client"

import * as React from "react"

import { cn } from "@/components/lib/utils"

function Table({ className, ...props }) {
  return (
    <div
      data-slot="table-container"
      className={cn(
        // base container styling
        "relative w-full overflow-x-auto rounded-lg border border-gray-200 shadow-sm",
        // Ultra-thin sleek scrollbar styling
        "scrollbar scrollbar-thin scrollbar-thumb-slate-300 scrollbar-track-transparent",
        "hover:scrollbar-thumb-slate-400 scrollbar-thumb-rounded-full",
        "scrollbar-w-1.5 scrollbar-h-1.5",
        className
      )}
      // Firefox: ultra-thin scrollbar with subtle colors
      style={{ 
        scrollbarWidth: "thin",
        scrollbarColor: "#cbd5e1 transparent"
      }}
    >
      <table
        data-slot="table"
        className={cn("min-w-full text-sm bg-white", className)}
        {...props}
      />
    </div>
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

function TableFooter({ className, ...props }) {
  return (
    <tfoot
      data-slot="table-footer"
      className={cn(
        "bg-gray-100 border-t font-medium [&>tr]:last:border-b-0",
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
        "px-4 py-3 text-left font-semibold tracking-wide",
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
      className={cn("px-4 py-2 align-middle", className)}
      {...props}
    />
  )
}

function TableCaption({ className, ...props }) {
  return (
    <caption
      data-slot="table-caption"
      className={cn("text-gray-500 mt-2 text-sm", className)}
      {...props}
    />
  )
}

export {
  Table,
  TableHeader,
  TableBody,
  TableFooter,
  TableHead,
  TableRow,
  TableCell,
  TableCaption,
}
