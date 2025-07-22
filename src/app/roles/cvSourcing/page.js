// app/roles/cvSourcing/page.js
"use client"

import React, { useState, useEffect } from "react"
import { columns } from "./columns"
import { DataTable } from "./data-table"
import ProtectedRoute from "@/components/ProtectedRoute"
import { useAuth } from "@/contexts/AuthContext"

import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetClose,
} from "@/components/ui/sheet"

import AddRoleForm from "./AddRoleForm"

export default function CVSourcingPage() {
  const { user, isAuthenticated, isLoading: authLoading } = useAuth()
  const [data, setData] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const [isSheetOpen, setIsSheetOpen] = useState(false)
  const [editingRole, setEditingRole] = useState(null)
  const [successMessage, setSuccessMessage] = useState("")

  // Fetch CV sourcing roles from backend
  const fetchCvSourcingRoles = async () => {
    setIsLoading(true)
    setError(null)
    
    try {
      const response = await fetch(`https://8w2mk49p-3001.inc1.devtunnels.ms/cv-sourcing?userId=${user.id}`)
      const result = await response.json()
      
      if (result.success) {
        // Transform data to match the table columns
        const transformedData = result.data.map((role, index) => ({
          id: role.id,
          no: index + 1,
          roleTitle: role.roleTitle,
          rolePriority: role.rolePriority,
          location: role.location,
          postalCode: role.postalCode || '',
          country: role.country || '',
          salaryFrom: role.salaryFrom || '',
          salaryTo: role.salaryTo || '',
          salaryCurrency: role.salaryCurrency || 'USD',
          salaryType: role.salaryType || '',
          industry: role.industry,
          experienceRequired: role.experienceRequired || '',
          searchRadius: role.searchRadius || '',
          acmCategory: role.acmCategory || '',
          status: role.status,
          cvsCount: role.cvsCount || 0,
          lisCount: role.lisCount || 0,
          ziCount: role.ziCount || 0,
          totalCandidates: role.totalCandidates || 0,
          rejectedCvs: role.rejectedCvs || 0,
          rejectedLis: role.rejectedLis || 0,
          qualifiedCandidates: role.qualifiedCandidates || 0,
          createdAt: role.createdAt,
          updatedAt: role.updatedAt
        }))
        
        setData(transformedData)
      } else {
        throw new Error(result.message || 'Failed to fetch CV sourcing roles')
      }
    } catch (error) {
      console.error('Error fetching CV sourcing roles:', error)
      setError(error.message)
    } finally {
      setIsLoading(false)
    }
  }

  // Load data on component mount, ProtectedRoute ensures authentication
  useEffect(() => {
    if (user && !authLoading) {
      fetchCvSourcingRoles()
    } else if (!authLoading) {
      // If no user after auth loading is complete, set loading to false
      setIsLoading(false)
    }
  }, [user, authLoading])

  // Handle form success (create/update)
  const handleFormSuccess = (message) => {
    setSuccessMessage(message)
    setIsSheetOpen(false)
    setEditingRole(null)
    
    // Refresh data
    fetchCvSourcingRoles()
    
    // Clear success message after 3 seconds
    setTimeout(() => setSuccessMessage(""), 3000)
  }

  // Handle edit role
  const handleEditRole = (role) => {
    setEditingRole(role)
    setIsSheetOpen(true)
  }

  // Handle delete role
  const handleDeleteRole = async (role) => {
    if (!confirm('Are you sure you want to delete this role?')) {
      return
    }

    try {
      const response = await fetch(`https://8w2mk49p-3001.inc1.devtunnels.ms/cv-sourcing/${role.id}`, {
        method: 'DELETE'
      })
      
      const result = await response.json()
      
      if (result.success) {
        setSuccessMessage('Role deleted successfully!')
        fetchCvSourcingRoles()
        setTimeout(() => setSuccessMessage(""), 3000)
      } else {
        throw new Error(result.message || 'Failed to delete role')
      }
    } catch (error) {
      console.error('Error deleting role:', error)
      alert('Error deleting role: ' + error.message)
    }
  }

  // Make edit and delete functions available globally for the columns
  useEffect(() => {
    window.handleEditRole = handleEditRole
    window.handleDeleteRole = handleDeleteRole
    
    return () => {
      delete window.handleEditRole
      delete window.handleDeleteRole
    }
  }, [])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        <span className="ml-3 text-lg">Loading CV sourcing roles...</span>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <div className="text-red-600 text-lg mb-4">Error: {error}</div>
        <button 
          onClick={fetchCvSourcingRoles}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Retry
        </button>
      </div>
    )
  }

  return (
    <ProtectedRoute>
      <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">CV Sourcing Roles</h1>
          <p className="text-gray-600">Manage your CV sourcing roles and track candidates</p>
        </div>

        <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
          <SheetTrigger asChild>
            <button 
              className="rounded bg-blue-600 px-4 py-2 text-white transition-colors hover:bg-blue-700"
              onClick={() => {
                setEditingRole(null)
                setIsSheetOpen(true)
              }}
            >
              Add New Role
            </button>
          </SheetTrigger>
          <SheetContent className="w-[600px] max-h-screen overflow-y-auto">
            <SheetHeader>
              <SheetTitle>
                {editingRole ? 'Edit Role' : 'Add New Role'}
              </SheetTitle>
            </SheetHeader>
            <AddRoleForm 
              onSuccess={handleFormSuccess} 
              editingRole={editingRole}
            />
          </SheetContent>
        </Sheet>
      </div>

      {/* Success Message */}
      {successMessage && (
        <div className="mb-4 p-4 bg-green-100 border border-green-400 text-green-700 rounded">
          <div className="flex items-center justify-between">
            <span>{successMessage}</span>
            <button 
              onClick={() => setSuccessMessage("")}
              className="text-green-700 hover:text-green-900"
            >
              ×
            </button>
          </div>
        </div>
      )}

      <DataTable columns={columns} data={data} />
      </div>
    </ProtectedRoute>
  )
}
