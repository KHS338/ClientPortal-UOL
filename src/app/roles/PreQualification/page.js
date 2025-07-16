// app/roles/page.js
"use client"

import { useState, useEffect } from "react"
import { columns } from "./columns"
import { DataTable } from "./data-table"
import AddRoleForm from "./AddRoleForm"

import {
    Sheet,
    SheetTrigger,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetClose,
} from "@/components/ui/sheet"



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
            rCandidates: 4 - 1 - 0, // safely computed to avoid NaN
        },
    ]
}

export default function RolesPage() {
    const [data, setData] = useState([])
    const [isSheetOpen, setIsSheetOpen] = useState(false)
    const [successMessage, setSuccessMessage] = useState("")
    const [messageType, setMessageType] = useState("success")

    useEffect(() => {
        getData().then((fetchedData) => {
            const sanitizedData = fetchedData.map((role) => ({
                ...role,
                rCandidates: isNaN(role.rCandidates) ? 0 : role.rCandidates,
            }))
            setData(sanitizedData)
        })
    }, [])

    const handleRoleSuccess = (message, type = "success") => {
        setSuccessMessage(message)
        setMessageType(type)
        setIsSheetOpen(false)

        setTimeout(() => {
            setSuccessMessage("")
        }, 5000)
    }

    const closeSuccessMessage = () => {
        setSuccessMessage("")
    }

    return (
        <>
            {/* ✅ Success Message with hydration suppression */}
            {successMessage && (
                <div
                    suppressHydrationWarning
                    className={`fixed top-4 right-4 z-50 max-w-md rounded-lg border p-4 shadow-lg transition-all duration-300 ${messageType === "success"
                            ? "border-green-200 bg-green-50 text-green-800"
                            : "border-red-200 bg-red-50 text-red-800"
                        }`}
                >
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <span className="text-lg">
                                {messageType === "success" ? "✅" : "❌"}
                            </span>
                            <span className="font-medium">{successMessage}</span>
                        </div>
                        <button
                            onClick={closeSuccessMessage}
                            className="ml-4 text-gray-400 hover:text-gray-600"
                        >
                            ✕
                        </button>
                    </div>
                </div>
            )}

            <div className="container mx-auto px-4 py-8 flex flex-col items-center">
                <h1 className="mb-4 text-center text-4xl font-bold text-gray-900">
                    Manage Your Roles
                </h1>

                <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
                    <SheetTrigger asChild>
                        <button className="rounded-lg bg-green-600 px-6 py-2 font-semibold text-white transition-colors hover:bg-green-700">
                            Add Roles
                        </button>
                    </SheetTrigger>

                    <SheetContent
                        side="right"
                        size="full"
                        className="sm:max-w-[480px] sm:rounded-l-lg"
                    >
                        <SheetHeader className="sr-only">
                            <SheetTitle>Add New Role</SheetTitle>
                        </SheetHeader>
                        <AddRoleForm onSuccess={handleRoleSuccess} />
                        <SheetClose className="absolute top-4 right-4" />
                    </SheetContent>
                </Sheet>
            </div>
            <section className="container mx-auto px-4 py-10">
                <div className="mb-6 rounded-lg bg-gray-100 px-6 py-4">
                    <h2 className="text-3xl font-bold text-gray-900">Pre Qualification</h2>
                </div>
                <DataTable columns={columns} data={data} />
            </section>
        </>
    )
}