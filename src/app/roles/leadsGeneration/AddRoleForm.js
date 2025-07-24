"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/contexts/AuthContext"

export default function AddRoleForm({ onSuccess, editingRole = null }) {
  const { user, isAuthenticated } = useAuth()
  const [salaryNotDefined, setSalaryNotDefined] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  
  const [roleData, setRoleData] = useState({
    roleTitle: '',
    rolePriority: '',
    location: '',
    postalCode: '',
    country: '',
    salaryFrom: '',
    salaryTo: '',
    salaryCurrency: '',
    salaryType: '',
    industry: '',
    experienceRequired: '',
    searchRadius: '',
    acmCategory: ''
  })

  // Populate form when editing
  useEffect(() => {
    if (editingRole) {
      // Handle salary - could be number or string
      let salaryFrom = ''
      let salaryTo = ''
      
      if (editingRole.salary) {
        if (typeof editingRole.salary === 'string' && editingRole.salary.includes('-')) {
          const salaryParts = editingRole.salary.split('-')
          salaryFrom = salaryParts[0] || ''
          salaryTo = salaryParts[1] || ''
        } else {
          // If it's a number or string without dash, put it in salaryFrom
          salaryFrom = editingRole.salary.toString()
        }
      }
      
      setRoleData({
        roleTitle: editingRole.role || '',
        rolePriority: editingRole.stages || '',
        location: editingRole.focusPoint || '',
        postalCode: '',
        country: '',
        salaryFrom,
        salaryTo,
        salaryCurrency: '',
        salaryType: '',
        industry: editingRole.industry || '',
        experienceRequired: '',
        searchRadius: editingRole.miles?.toString() || '',
        acmCategory: ''
      })
    }
  }, [editingRole])

  
  const handleInputChange = (field, value) => {
    setRoleData(prev => ({
      ...prev,
      [field]: value
    }))
  }


  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    try {
      const completeRoleData = {
        ...roleData,
        salaryNotDefined,
        createdAt: new Date().toISOString(),
        id: Date.now() // Temporary ID
      }
      
      console.log('Role Data:', completeRoleData)
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Call success callback to close sheet and show message
      if (onSuccess) {
        const message = editingRole 
          ? 'Role Updated Successfully! 🎉' 
          : 'Role Created Successfully! 🎉'
        onSuccess(message)
      }
      
      // Dispatch role activity event for dashboard update
      window.dispatchEvent(new CustomEvent(editingRole ? 'roleUpdated' : 'roleCreated', {
        detail: {
          service: 'Lead Generation',
          roleTitle: roleData.roleTitle,
          action: editingRole ? 'updated' : 'created'
        }
      }));

      // Store activity in localStorage for dashboard
      try {
        const activity = {
          id: `lead-${Date.now()}`,
          action: editingRole ? "Lead updated" : "Lead created",
          service: "Lead Generation",
          role: roleData.roleTitle,
          time: "Just now",
          status: "active",
          createdAt: new Date()
        };

        const existingActivities = JSON.parse(localStorage.getItem('recentRoleActivity') || '[]');
        const updatedActivities = [activity, ...existingActivities].slice(0, 10);
        localStorage.setItem('recentRoleActivity', JSON.stringify(updatedActivities));
        console.log('Lead Generation - Stored activity in localStorage:', activity);
      } catch (error) {
        console.log('Lead Generation - Error storing activity in localStorage:', error);
      }
      
      // Reset form
      setRoleData({
        roleTitle: '',
        rolePriority: '',
        location: '',
        postalCode: '',
        country: '',
        salaryFrom: '',
        salaryTo: '',
        salaryCurrency: '',
        salaryType: '',
        industry: '',
        experienceRequired: '',
        searchRadius: '',
        acmCategory: ''
      })
      setSalaryNotDefined(false)
      
    } catch (error) {
      console.error('Error creating role:', error)
      if (onSuccess) {
        onSuccess('Error creating role. Please try again.', 'error')
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="h-full flex flex-col">
      <div className="flex-shrink-0 bg-white border-b p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          {editingRole ? 'Edit Role' : 'Create New Role'}
        </h2>
        <p className="text-gray-600 text-sm">
          {editingRole 
            ? 'Update the role information below.' 
            : 'Fill out the form below to add a new role to the system.'
          }
        </p>
      </div>

      <div className="flex-1 overflow-y-auto p-6 bg-white">
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Role Title */}
          <div className="md:col-span-2">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Role Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              value={roleData.roleTitle}
              onChange={(e) => handleInputChange('roleTitle', e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              placeholder="e.g., Senior Frontend Developer"
            />
          </div>

          {/* Role Priority */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Role Priority <span className="text-red-500">*</span>
            </label>
            <select 
              value={roleData.rolePriority}
              onChange={(e) => handleInputChange('rolePriority', e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            >
              <option value="">..</option>
              <option value="low">🟢 Low</option>
              <option value="medium">🟡 Medium</option>
              <option value="high">🟠 High</option>
              <option value="critical">🔴 Critical</option>
            </select>
          </div>

          {/* Location */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Location <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              value={roleData.location}
              onChange={(e) => handleInputChange('location', e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              placeholder="e.g., London, New York"
            />
          </div>

          {/* Postal Code */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Postal Code</label>
            <input
              type="text"
              value={roleData.postalCode}
              onChange={(e) => handleInputChange('postalCode', e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              placeholder="e.g., SW1A 1AA"
            />
          </div>

          {/* Country */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Country <span className="text-red-500">*</span>
            </label>
            <select 
              value={roleData.country}
              onChange={(e) => handleInputChange('country', e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            >
              <option value="">..</option>
              <option value="us">🇺🇸 United States</option>
              <option value="uk">🇬🇧 United Kingdom</option>
              <option value="ca">🇨🇦 Canada</option>
              <option value="au">🇦🇺 Australia</option>
              <option value="de">🇩🇪 Germany</option>
              <option value="fr">🇫🇷 France</option>
            </select>
          </div>
        </div>

        {/* Salary Section */}
        <div className="bg-gray-50 rounded-lg p-6 space-y-4">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">💰 Salary Information</h3>
          
          <div className="flex items-center mb-4">
            <input
              type="checkbox"
              id="salaryNotDefined"
              checked={salaryNotDefined}
              onChange={(e) => setSalaryNotDefined(e.target.checked)}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label htmlFor="salaryNotDefined" className="ml-2 text-sm font-medium text-gray-700">
              Salary Not Defined
            </label>
          </div>

          {!salaryNotDefined && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Salary Range From */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">From</label>
                <input
                  type="number"
                  value={roleData.salaryFrom}
                  onChange={(e) => handleInputChange('salaryFrom', e.target.value)}
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  placeholder="50,000"
                  min="0"
                />
              </div>

              {/* Salary Range To */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">To</label>
                <input
                  type="number"
                  value={roleData.salaryTo}
                  onChange={(e) => handleInputChange('salaryTo', e.target.value)}
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  placeholder="80,000"
                  min="0"
                />
              </div>

              {/* Salary Currency */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Currency</label>
                <select 
                  value={roleData.salaryCurrency}
                  onChange={(e) => handleInputChange('salaryCurrency', e.target.value)}
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                >
                  <option value="">..</option>
                  <option value="usd">💵 USD - US Dollar</option>
                  <option value="gbp">💷 GBP - British Pound</option>
                  <option value="eur">💶 EUR - Euro</option>
                  <option value="cad">🍁 CAD - Canadian Dollar</option>
                </select>
              </div>

              {/* Salary Type */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Type</label>
                <select 
                  value={roleData.salaryType}
                  onChange={(e) => handleInputChange('salaryType', e.target.value)}
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                >
                  <option value="">..</option>
                  <option value="annual">📅 Annual</option>
                  <option value="monthly">📆 Monthly</option>
                  <option value="weekly">🗓️ Weekly</option>
                  <option value="hourly">⏰ Hourly</option>
                </select>
              </div>
            </div>
          )}
        </div>

        {/* Additional Information */}
        <div className="bg-blue-50 rounded-lg p-6 space-y-4">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">📋 Additional Information</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Industry */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Industry</label>
              <input
                type="text"
                value={roleData.industry}
                onChange={(e) => handleInputChange('industry', e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                placeholder="e.g., Technology, Healthcare"
              />
            </div>

            {/* Months Back */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Required EXP</label>
              <select 
                value={roleData.experienceRequired}
                onChange={(e) => handleInputChange('experienceRequired', e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              >
                <option value="">..</option>
                <option value="1">1+ Years</option>
                <option value="3">3+ Years</option>
                <option value="5">5+ Years</option>
                <option value="10">10+ Years</option>
              </select>
            </div>

            {/* Radius Miles */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Search Radius</label>
              <select 
                value={roleData.searchRadius}
                onChange={(e) => handleInputChange('searchRadius', e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              >
                <option value="">..</option>
                <option value="5">📍 5 Miles</option>
                <option value="10">📍 10 Miles</option>
                <option value="25">📍 25 Miles</option>
                <option value="50">📍 50 Miles</option>
                <option value="100">📍 100 Miles</option>
                <option value="remote">🌐 Remote</option>
              </select>
            </div>

            {/* ACM */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">ACM Category</label>
              <select 
                value={roleData.acmCategory}
                onChange={(e) => handleInputChange('acmCategory', e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              >
                <option value="">..</option>
                <option value="technical">Technical</option>
                <option value="management">Management</option>
                <option value="creative">Creative</option>
                <option value="sales">Sales</option>
              </select>
            </div>

            {/* File Upload */}
            {/* <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-gray-700 mb-2">Job Description File</label>
              <div className="relative">
                <input
                  type="file"
                  accept=".pdf,.doc,.docx,.txt"
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                />
              </div>
              <p className="text-xs text-gray-500 mt-1">Accepted formats: PDF, DOC, DOCX, TXT (Max 5MB)</p>
            </div> */}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 pt-6 border-t border-gray-200">
          <button
            type="submit"
            disabled={isSubmitting}
            className={`flex-1 font-semibold py-3 px-6 rounded-lg transition-all duration-200 transform focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
              isSubmitting
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-[#0958d9]  hover:bg-[#24AC4A] hover:scale-[1.02] text-white'
            }`}
          >
            {isSubmitting ? (
              <span className="flex items-center justify-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                {editingRole ? 'Updating Role...' : 'Creating Role...'}
              </span>
            ) : (
              editingRole ? '✏️ Update Role' : '🚀 Create Role'
            )}
          </button>
         
        </div>
      </form>
      </div>
    </div>
  )
}
