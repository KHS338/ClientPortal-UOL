"use client"

import { useState, useEffect } from "react"
import { columns } from "./columns"
import { DataTable } from "./data-table"

import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetClose,
} from "@/components/ui/sheet"

import AddRoleForm from "./AddRoleForm"

async function getData() {
  return [
    {
      no: 1,
      role: "Frontend Dev",
      focusPoint: "React UI",
      stages: "Interview",
      status: "pending",
      resourcers: "Alice",
      months: 3,
      salary: 75000,
      miles: 120,
      industry: "Tech",
      cvs: 5,
      lis: 2,
      zi: 0,
      tCandidates: 4,
      rejectedCvs: 1,
      rejectedLis: 0,
      rCandidates: NaN,
    },
  ]
}

export default function RolesPage() {
  const [data, setData] = useState([])

  useEffect(() => {
    getData().then(setData)
  }, [])

  return (
    <>
      <div className="container mx-auto px-4 py-8 flex flex-col items-center">
        <h1 className="mb-4 text-center text-4xl font-bold text-gray-900">
          Manage Your Roles
        </h1>

        <Sheet>
          <SheetTrigger asChild>
            <button className="rounded-lg bg-green-600 px-6 py-2 font-semibold text-white transition-colors hover:bg-green-700">
              Add Roles
            </button>
          </SheetTrigger>

          <SheetContent side="right" className="w-[420px] sm:w-[480px]">
            <SheetHeader>
              <SheetTitle>Add a new role</SheetTitle>
            </SheetHeader>

            <AddRoleForm />
          </SheetContent>
        </Sheet>
      </div>

      <section className="container mx-auto px-4 py-10">
          <div className="mb-6 rounded-lg bg-gray-100 px-6 py-4">
            <h2 className="text-3xl font-bold text-gray-900">CV Sourcing</h2>
          </div>
          <DataTable columns={columns} data={data} />
      </section>

      <section className="container mx-auto px-4 py-10">
          <div className="mb-6 rounded-lg bg-gray-100 px-6 py-4">
            <h2 className="text-3xl font-bold text-gray-900">Pre Qualificaiton</h2>
          </div>
          <DataTable columns={columns} data={data} />
      </section>

      <section  className="container mx-auto px-4 py-10">
          <div className="mb-6 rounded-lg bg-gray-100 px-6 py-4">
            <h2 className="text-3xl font-bold text-gray-900">360/Direct</h2>
          </div>
          <DataTable columns={columns} data={data} />
      </section>
    </>
  )
}
