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
  const [message, setMessage] = useState("")
  const [messageType, setMessageType] = useState("success")
  const [credits, setCredits] = useState(0)

  // Fetch credits from subscription
  const fetchCredits = async () => {
    if (user && isAuthenticated) {
      try {
        const sub = await import("@/lib/subscription");
        const subData = await sub.getCurrentSubscription(user.id);
        setCredits(subData?.credits?.total || 0);
      } catch (error) {
        console.error('Error fetching credits:', error);
        setCredits(0);
      }
    }
  };

  // Listen for credits updates
  useEffect(() => {
    const handleCreditsUpdate = () => {
      fetchCredits();
    };

    window.addEventListener('creditsUpdated', handleCreditsUpdate);
    return () => {
      window.removeEventListener('creditsUpdated', handleCreditsUpdate);
    };
  }, [user, isAuthenticated]);

  // Initial credits fetch
  useEffect(() => {
    fetchCredits();
  }, [user, isAuthenticated]);

  const fetchCvSourcingRoles = async () => {

    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch(`http://localhost:3001/cv-sourcing?userId=${user.id}`)
      const result = await response.json()

      if (result.success) {
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
        throw new Error(result.message || "Failed to fetch CV sourcing roles")
      }
    } catch (error) {
      console.error("Error fetching CV sourcing roles:", error)
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

  const handleSuccess = (msg, type = 'success') => {
    setMessage(msg)
    setMessageType(type)
    setIsSheetOpen(false)
    setEditingRole(null)
    fetchCvSourcingRoles()

    setTimeout(() => {
      setMessage('')
    }, 5000)
  }

  const handleEdit = (role) => {
    setEditingRole(role)
    setIsSheetOpen(true)
  }

  useEffect(() => {
    window.handleEditRole = handleEdit
    return () => {
      delete window.handleEditRole
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
      <>
        {/* Floating Message */}
        {message && (
          <div className={`fixed top-4 right-4 z-50 max-w-md rounded-lg border p-4 shadow-lg transition-all duration-300 ${
            messageType === 'success'
              ? 'border-green-200 bg-green-50 text-green-800'
              : 'border-red-200 bg-red-50 text-red-800'
          }`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {/* Emoji Removed */}
                <span className="font-semibold capitalize">{messageType}</span>
                <span>{message}</span>
              </div>
              <button
                onClick={() => setMessage('')}
                className="ml-4 text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>
          </div>
        )}

        <div className="container mx-auto px-4 py-8 flex flex-col items-center">
          <div className="mb-2 text-lg font-semibold text-gray-700">
            Credits Remaining: <span className={credits === 0 ? "text-red-600" : "text-green-600"}>{credits}</span>
          </div>
          <h1 className="mb-4 text-center text-4xl font-bold text-gray-900">
            Manage Your CV Sourcing Roles
          </h1>

          <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
            <SheetTrigger asChild>
              <button 
                onClick={() => {
                  if (credits === 0) {
                    setMessage("You don't have enough credits to add new roles. Please purchase more credits.")
                    setMessageType('error')
                    setTimeout(() => {
                      setMessage('')
                    }, 5000)
                    return
                  }
                  setEditingRole(null) // Clear editing state when adding new role
                  setIsSheetOpen(true)
                }}
                className={`rounded-lg bg-[#0958d9] px-6 py-2 font-semibold text-white transition-colors hover:bg-[#24AC4A] ${credits === 0 ? 'opacity-50 cursor-not-allowed bg-gray-400 hover:bg-gray-400' : ''}`}
                disabled={credits === 0}
              >
                Add CV Sourcing Role
              </button>
            </SheetTrigger>

            <SheetContent
              side="right"
              size="full"
              className="sm:max-w-[480px] sm:rounded-l-lg overflow-y-auto"
            >
              <SheetHeader className="sr-only">
                <SheetTitle>{editingRole ? "Edit CV Sourcing Role" : "Add New CV Sourcing Role"}</SheetTitle>
              </SheetHeader>
              <AddRoleForm onSuccess={handleSuccess} editingRole={editingRole} />
              <SheetClose className="absolute top-4 right-4" />
            </SheetContent>
          </Sheet>
        </div>

        <section className="container mx-auto px-4 py-10">
          <div className="mb-6 rounded-lg bg-gray-100 px-6 py-4">
            <h2 className="text-3xl font-bold text-gray-900">CV Sourcing Roles</h2>
          </div>
          <DataTable columns={columns} data={data} />
        </section>
      </>
    </ProtectedRoute>
  )
}
