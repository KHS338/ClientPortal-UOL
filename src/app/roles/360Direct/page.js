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

export default function DirectPage() {
  const { user, isAuthenticated, isLoading: authLoading } = useAuth()
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
    fetchCredits();
  }, [user, isAuthenticated]);

  const countries = [
    "Afghanistan", "Albania", "Algeria", "Andorra", "Angola", "Argentina", "Armenia",
    "Australia", "Austria", "Azerbaijan", "Bahamas", "Bahrain", "Bangladesh", "Barbados",
    "Belarus", "Belgium", "Belize", "Benin", "Bhutan", "Bolivia", "Bosnia and Herzegovina",
    "Botswana", "Brazil", "Brunei", "Bulgaria", "Burkina Faso", "Burundi", "Cambodia",
    "Cameroon", "Canada", "Cape Verde", "Central African Republic", "Chad", "Chile", "China",
    "Colombia", "Comoros", "Congo", "Costa Rica", "Croatia", "Cuba", "Cyprus", "Czech Republic",
    "Denmark", "Djibouti", "Dominica", "Dominican Republic", "Ecuador", "Egypt", "El Salvador",
    "Equatorial Guinea", "Eritrea", "Estonia", "Eswatini", "Ethiopia", "Fiji", "Finland",
    "France", "Gabon", "Gambia", "Georgia", "Germany", "Ghana", "Greece", "Grenada",
    "Guatemala", "Guinea", "Guinea-Bissau", "Guyana", "Haiti", "Honduras", "Hungary",
    "Iceland", "India", "Indonesia", "Iran", "Iraq", "Ireland", "Israel", "Italy", "Jamaica",
    "Japan", "Jordan", "Kazakhstan", "Kenya", "Kiribati", "Korea North", "Korea South",
    "Kuwait", "Kyrgyzstan", "Laos", "Latvia", "Lebanon", "Lesotho", "Liberia", "Libya",
    "Liechtenstein", "Lithuania", "Luxembourg", "Madagascar", "Malawi", "Malaysia", "Maldives",
    "Mali", "Malta", "Marshall Islands", "Mauritania", "Mauritius", "Mexico", "Micronesia",
    "Moldova", "Monaco", "Mongolia", "Montenegro", "Morocco", "Mozambique", "Myanmar", "Namibia",
    "Nauru", "Nepal", "Netherlands", "New Zealand", "Nicaragua", "Niger", "Nigeria", "North Macedonia",
    "Norway", "Oman", "Pakistan", "Palau", "Panama", "Papua New Guinea", "Paraguay", "Peru",
    "Philippines", "Poland", "Portugal", "Qatar", "Romania", "Russia", "Rwanda", "Saint Kitts and Nevis",
    "Saint Lucia", "Saint Vincent and the Grenadines", "Samoa", "San Marino", "Sao Tome and Principe",
    "Saudi Arabia", "Senegal", "Serbia", "Seychelles", "Sierra Leone", "Singapore", "Slovakia",
    "Slovenia", "Solomon Islands", "Somalia", "South Africa", "Spain", "Sri Lanka", "Sudan",
    "Suriname", "Sweden", "Switzerland", "Syria", "Taiwan", "Tajikistan", "Tanzania", "Thailand",
    "Togo", "Tonga", "Trinidad and Tobago", "Tunisia", "Turkey", "Turkmenistan", "Tuvalu", "Uganda",
    "Ukraine", "United Arab Emirates", "United Kingdom", "United States", "Uruguay", "Uzbekistan",
    "Vanuatu", "Vatican City", "Venezuela", "Vietnam", "Yemen", "Zambia", "Zimbabwe"
  ];

  const fetchData = async () => {
    if (!user || !isAuthenticated) {
      setLoading(false)
      return
    }

    try {
      setLoading(true)

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
    if (isAuthenticated && user && !authLoading) {
      fetchData()
    }
  }, [isAuthenticated, user, authLoading])

  const handleSuccess = (successMsg, msgType = 'success') => {
    setMessage(successMsg)
    setMessageType(msgType)
    setIsSheetOpen(false)
    setEditingRole(null)
    fetchData()
    setTimeout(() => {
      setMessage('')
    }, 5000)
  }

  const handleEdit = (role) => {
    setEditingRole(role)
    setIsSheetOpen(true)
  }

  const closeMessage = () => {
    setMessage('')
  }

  useEffect(() => {
    window.handleEditRole = handleEdit

    return () => {
      delete window.handleEditRole
    }
  }, [handleEdit])

  return (
    <ProtectedRoute>
      <>
        {message && (
          <div className={`fixed top-4 right-4 z-50 max-w-md rounded-lg border p-4 shadow-lg transition-all duration-300 ${messageType === 'success'
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
            Manage Your 360 Direct Roles
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

              {/* ✅ Pass countries array here */}
              <AddRoleForm
                onSuccess={handleSuccess}
                editingRole={editingRole}
                countries={countries}
              />

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
    </ProtectedRoute>
  )
}
