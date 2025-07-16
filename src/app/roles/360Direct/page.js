// app/roles/page.js
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
    {
      no: 2,
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
  const [isSheetOpen, setIsSheetOpen] = useState(false)
  const [successMessage, setSuccessMessage] = useState('')
  const [messageType, setMessageType] = useState('success')
  const [editingRole, setEditingRole] = useState(null)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [roleToDelete, setRoleToDelete] = useState(null)

  useEffect(() => {
    getData().then(setData)
  }, [])

  const handleEdit = (role) => {
    setEditingRole(role)
    setIsSheetOpen(true)
  }

  const handleDelete = (role) => {
    setRoleToDelete(role)
    setIsDeleteDialogOpen(true)
  }

  const confirmDelete = () => {
    if (roleToDelete) {
      // Remove role from data
      setData(prevData => prevData.filter(item => item.no !== roleToDelete.no))
      
      // Show success message
      handleRoleSuccess(`Role "${roleToDelete.role}" deleted successfully!`, 'success')
      
      // Reset delete state
      setRoleToDelete(null)
      setIsDeleteDialogOpen(false)
    }
  }

  const cancelDelete = () => {
    setRoleToDelete(null)
    setIsDeleteDialogOpen(false)
  }

  const handleRoleSuccess = (message, type = 'success') => {
    setSuccessMessage(message)
    setMessageType(type)
    setIsSheetOpen(false)
    setEditingRole(null)
    
    // Clear message after 5 seconds
    setTimeout(() => {
      setSuccessMessage('')
    }, 5000)
  }

  const closeSuccessMessage = () => {
    setSuccessMessage('')
  }

  // Make handlers available globally for columns
  useEffect(() => {
    window.handleEditRole = handleEdit
    window.handleDeleteRole = handleDelete
    
    return () => {
      delete window.handleEditRole
      delete window.handleDeleteRole
    }
  }, [])

  return (
    <>
      {/* Success Message */}
      {successMessage && (
        <div className={`fixed top-4 right-4 z-50 max-w-md rounded-lg border p-4 shadow-lg transition-all duration-300 ${
          messageType === 'success' 
            ? 'border-green-200 bg-green-50 text-green-800' 
            : 'border-red-200 bg-red-50 text-red-800'
        }`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-lg">
                {messageType === 'success' ? '✅' : '❌'}
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

      {/* Delete Confirmation Dialog */}
      {isDeleteDialogOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="mx-4 max-w-md rounded-lg bg-white p-6 shadow-xl">
            <h3 className="mb-4 text-lg font-semibold text-gray-900">
              Delete Role
            </h3>
            <p className="mb-6 text-gray-600">
              Are you sure you want to delete the role "{roleToDelete?.role}"? This action cannot be undone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={confirmDelete}
                className="flex-1 rounded-lg bg-red-600 px-4 py-2 font-medium text-white transition-colors hover:bg-red-700"
              >
                Delete
              </button>
              <button
                onClick={cancelDelete}
                className="flex-1 rounded-lg border border-gray-300 bg-white px-4 py-2 font-medium text-gray-700 transition-colors hover:bg-gray-50"
              >
                Cancel
              </button>
            </div>
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
            <AddRoleForm onSuccess={handleRoleSuccess} editingRole={editingRole} />
            <SheetClose className="absolute top-4 right-4" />
          </SheetContent>
        </Sheet>
      </div>
      <section className="container mx-auto px-4 py-10">
        <div className="mb-6 rounded-lg bg-gray-100 px-6 py-4">
          <h2 className="text-3xl font-bold text-gray-900">360/Direct</h2>
        </div>
        <DataTable columns={columns} data={data} />
      </section>
    </>
  )
}
