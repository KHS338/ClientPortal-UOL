// app/roles/PreQualification/page.js
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

export default function PreQualificationPage() {
  const { isAuthenticated, isLoading: authLoading, user } = useAuth()
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)
  const [isSheetOpen, setIsSheetOpen] = useState(false)
  const [editingRole, setEditingRole] = useState(null)
  const [message, setMessage] = useState('')
  const [messageType, setMessageType] = useState('success')
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
    if (isAuthenticated && user && !authLoading) {
      fetchCredits();
    }
  }, [isAuthenticated, user, authLoading]);

  // Fetch prequalification data from API
  const fetchData = async () => {
    if (!isAuthenticated || !user) {
      return;
    }
    
    try {
      setLoading(true)
      
      // Fetch prequalification roles for this user
      const response = await fetch(`https://8w2mk49p-3001.inc1.devtunnels.ms//prequalification?userId=${user.id}`)
      const result = await response.json()
      
      if (result.success) {
        setData(result.data || [])
      } else {
        console.error('Failed to fetch prequalification roles:', result.message)
        setData([])
      }
    } catch (error) {
      console.error('Error fetching prequalification data:', error)
      setData([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (isAuthenticated && user && !authLoading) {
      fetchData()
    }
  }, [isAuthenticated, user, authLoading])

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

  const closeMessage = () => {
    setMessage('')
  }

  // Make handlers available globally for columns
  React.useEffect(() => {
    window.handleEditRole = handleEdit

    return () => {
      delete window.handleEditRole
    }
  }, [handleEdit])

  return (
    <ProtectedRoute>
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
        <div className="mb-2 text-lg font-semibold text-gray-700">
          Credits Remaining: <span className={credits === 0 ? "text-red-600" : "text-green-600"}>{credits}</span>
        </div>
        <h1 className="mb-4 text-center text-4xl font-bold text-gray-900">
          Manage Your Prequalification Roles
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
              Add Prequalification Role
            </button>
          </SheetTrigger>

          <SheetContent
            side="right"
            size="full"
            className="sm:max-w-[480px] sm:rounded-l-lg"
          >
            <SheetHeader className="sr-only">
              <SheetTitle>Add New Prequalification Role</SheetTitle>
            </SheetHeader>
            <AddRoleForm onSuccess={handleSuccess} editingRole={editingRole} />
            <SheetClose className="absolute top-4 right-4" />
          </SheetContent>
        </Sheet>
      </div>
      
      <section className="container mx-auto px-4 py-10">
        <div className="mb-6 rounded-lg bg-gray-100 px-6 py-4">
          <h2 className="text-3xl font-bold text-gray-900">PreQualification Roles</h2>
        </div>
        {loading ? (
          <div className="flex justify-center items-center py-8">
            <div className="text-lg text-gray-600">Loading prequalification roles...</div>
          </div>
        ) : (
          <DataTable columns={columns} data={data} />
        )}
      </section>
    </ProtectedRoute>
  )
}
