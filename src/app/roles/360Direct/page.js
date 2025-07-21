// app/roles/360Direct/page.js
"use client"

import React, { useState, useEffect } from "react"
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

export default function DirectPage() {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)
  const [isSheetOpen, setIsSheetOpen] = useState(false)
  const [editingRole, setEditingRole] = useState(null)
  const [message, setMessage] = useState('')
  const [messageType, setMessageType] = useState('success')

  // Fetch 360 direct data from API
  const fetchData = async () => {
    try {
      setLoading(true)
      
      // Get user data from localStorage
      const userData = localStorage.getItem('user')
      if (!userData) {
        throw new Error('User not authenticated')
      }
      
      const user = JSON.parse(userData)
      
      // Fetch direct roles for this user
      const response = await fetch(`http://localhost:3001/direct?userId=${user.id}`)
      const result = await response.json()
      
      if (result.success) {
        setData(result.data || [])
      } else {
        console.error('Failed to fetch 360 direct roles:', result.message)
        setData([])
      }
    } catch (error) {
      console.error('Error fetching 360 direct data:', error)
      setData([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  // Handle role creation/editing success
  const handleSuccess = (successMsg, msgType = 'success') => {
    setMessage(successMsg)
    setMessageType(msgType)
    setIsSheetOpen(false)
    setEditingRole(null)
    
    // Refresh data after successful operation
    fetchData()
    
    // Clear message after 5 seconds
    setTimeout(() => {
      setMessage('')
    }, 5000)
  }

  // Handle editing a role
  const handleEdit = (role) => {
    setEditingRole(role)
    setIsSheetOpen(true)
  }

  // Handle deleting a role
  const handleDeleteRole = async (role) => {
    if (!confirm('Are you sure you want to delete this 360 direct role?')) {
      return
    }

    try {
      const response = await fetch(`http://localhost:3001/direct/${role.id}`, {
        method: 'DELETE'
      })
      
      const result = await response.json()
      
      if (result.success) {
        setMessage('360 Direct role deleted successfully! 🗑️')
        setMessageType('success')
        fetchData() // Refresh data
        
        // Clear message after 5 seconds
        setTimeout(() => {
          setMessage('')
        }, 5000)
      } else {
        setMessage('Error deleting 360 direct role: ' + result.message)
        setMessageType('error')
      }
    } catch (error) {
      console.error('Error deleting 360 direct role:', error)
      setMessage('Error deleting 360 direct role')
      setMessageType('error')
    }
  }

  const closeMessage = () => {
    setMessage('')
  }

  // Make handlers available globally for columns
  React.useEffect(() => {
    window.handleEditRole = handleEdit
    window.handleDeleteRole = handleDeleteRole

    return () => {
      delete window.handleEditRole
      delete window.handleDeleteRole
    }
  }, [handleEdit, handleDeleteRole])

  return (
    <>
      {/* Success/Error Message */}
      {message && (
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
              <span className="font-medium">{message}</span>
            </div>
            <button
              onClick={closeMessage}
              className="ml-4 text-gray-400 hover:text-gray-600"
            >
              ✕
            </button>
          </div>
        </div>
      )}

      <div className="container mx-auto px-4 py-8 flex flex-col items-center">
        <h1 className="mb-4 text-center text-4xl font-bold text-gray-900">
          Manage Your 360 Direct Roles
        </h1>

        <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
          <SheetTrigger asChild>
            <button className="rounded-lg bg-[#0958d9] px-6 py-2 font-semibold text-white transition-colors hover:bg-[#24AC4A]">
              Add 360 Direct Role
            </button>
          </SheetTrigger>

          <SheetContent
            side="right"
            size="full"
            className="sm:max-w-[480px] sm:rounded-l-lg"
          >
            <SheetHeader className="sr-only">
              <SheetTitle>Add New 360 Direct Role</SheetTitle>
            </SheetHeader>
            <AddRoleForm onSuccess={handleSuccess} editingRole={editingRole} />
            <SheetClose className="absolute top-4 right-4" />
          </SheetContent>
        </Sheet>
      </div>
      
      <section className="container mx-auto px-4 py-10">
        <div className="mb-6 rounded-lg bg-gray-100 px-6 py-4">
          <h2 className="text-3xl font-bold text-gray-900">360 Direct Roles</h2>
        </div>
        {loading ? (
          <div className="flex justify-center items-center py-8">
            <div className="text-lg text-gray-600">Loading 360 direct roles...</div>
          </div>
        ) : (
          <DataTable columns={columns} data={data} />
        )}
      </section>
    </>
  )
}
