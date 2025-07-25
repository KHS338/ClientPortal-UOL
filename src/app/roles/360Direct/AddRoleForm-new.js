"use client"

import { useState, useEffect } from "react"

export default function AddRoleForm({ onSuccess, editingRole = null }) {
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
    directApproachMethod: '',
    targetCompanies: '',
    contactStrategy: '',
    approachDeadline: '',
    directApproachBudget: '',
    targetSeniority: '',
    companySizePreference: '',
    industryFocus: '',
    geographicScope: ''
  })

  // Populate form when editing
  useEffect(() => {
    if (editingRole) {
      setRoleData({
        roleTitle: editingRole.roleTitle || '',
        rolePriority: editingRole.rolePriority || '',
        location: editingRole.location || '',
        postalCode: editingRole.postalCode || '',
        country: editingRole.country || '',
        salaryFrom: editingRole.salaryFrom || '',
        salaryTo: editingRole.salaryTo || '',
        salaryCurrency: editingRole.salaryCurrency || '',
        salaryType: editingRole.salaryType || '',
        industry: editingRole.industry || '',
        experienceRequired: editingRole.experienceRequired || '',
        directApproachMethod: editingRole.directApproachMethod || '',
        targetCompanies: editingRole.targetCompanies || '',
        contactStrategy: editingRole.contactStrategy || '',
        approachDeadline: editingRole.approachDeadline || '',
        directApproachBudget: editingRole.directApproachBudget || '',
        targetSeniority: editingRole.targetSeniority || '',
        companySizePreference: editingRole.companySizePreference || '',
        industryFocus: editingRole.industryFocus || '',
        geographicScope: editingRole.geographicScope || ''
      })
      
      // Set salary not defined if no salary values
      setSalaryNotDefined(!editingRole.salaryFrom && !editingRole.salaryTo)
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
      // Get user data from localStorage
      const userData = localStorage.getItem('user')
      if (!userData) {
        throw new Error('User not authenticated')
      }
      
      const user = JSON.parse(userData)
      
      // Prepare API data with proper type conversions
      const apiData = {
        roleTitle: roleData.roleTitle,
        rolePriority: roleData.rolePriority,
        location: roleData.location,
        postalCode: roleData.postalCode || null,
        country: roleData.country || null,
        salaryFrom: roleData.salaryFrom ? parseFloat(roleData.salaryFrom) : null,
        salaryTo: roleData.salaryTo ? parseFloat(roleData.salaryTo) : null,
        salaryCurrency: roleData.salaryCurrency || null,
        salaryType: roleData.salaryType || null,
        salaryNotDefined: salaryNotDefined,
        industry: roleData.industry,
        experienceRequired: roleData.experienceRequired || null,
        directApproachMethod: roleData.directApproachMethod || null,
        targetCompanies: roleData.targetCompanies || null,
        contactStrategy: roleData.contactStrategy || null,
        approachDeadline: roleData.approachDeadline || null,
        directApproachBudget: roleData.directApproachBudget ? parseFloat(roleData.directApproachBudget) : null,
        targetSeniority: roleData.targetSeniority || null,
        companySizePreference: roleData.companySizePreference || null,
        industryFocus: roleData.industryFocus || null,
        geographicScope: roleData.geographicScope || null,
        userId: parseInt(user.id)
      }
      
      // If editing, use PUT request
      let response
      if (editingRole) {
        response = await fetch(`https://8w2mk49p-3001.inc1.devtunnels.ms//direct/${editingRole.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(apiData)
        })
      } else {
        // Creating new role, use POST request
        response = await fetch('https://8w2mk49p-3001.inc1.devtunnels.ms//direct', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(apiData)
        })
      }
      
      const result = await response.json()
      
      if (result.success) {
        // Call success callback to close sheet and show message
        if (onSuccess) {
          const message = editingRole 
            ? '360 Direct Role Updated Successfully! 🎉' 
            : '360 Direct Role Created Successfully! 🎉'
          onSuccess(message)
        }
        
        // Reset form only if creating new role
        if (!editingRole) {
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
            directApproachMethod: '',
            targetCompanies: '',
            contactStrategy: '',
            approachDeadline: '',
            directApproachBudget: '',
            targetSeniority: '',
            companySizePreference: '',
            industryFocus: '',
            geographicScope: ''
          })
          setSalaryNotDefined(false)
        }
      } else {
        throw new Error(result.message || 'Failed to save 360 direct role')
      }
      
    } catch (error) {
      console.error('Error saving 360 direct role:', error)
      if (onSuccess) {
        onSuccess(`Error ${editingRole ? 'updating' : 'creating'} 360 direct role: ${error.message}`, 'error')
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="h-full flex flex-col">
      <div className="flex-shrink-0 bg-white border-b p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          {editingRole ? 'Edit 360 Direct Role' : 'Create New 360 Direct Role'}
        </h2>
        <p className="text-gray-600 text-sm">
          {editingRole 
            ? 'Update the 360 direct role information below.' 
            : 'Fill out the form below to add a new 360 direct role to the system.'
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
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                placeholder="e.g., Senior Software Engineer"
              />
            </div>

            {/* Role Priority */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Priority <span className="text-red-500">*</span>
              </label>
              <select
                required
                value={roleData.rolePriority}
                onChange={(e) => handleInputChange('rolePriority', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              >
                <option value="">Select Priority</option>
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
                <option value="Urgent">Urgent</option>
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
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                placeholder="e.g., London, Manchester"
              />
            </div>

            {/* Postal Code */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Postal Code
              </label>
              <input
                type="text"
                value={roleData.postalCode}
                onChange={(e) => handleInputChange('postalCode', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                placeholder="e.g., SW1A 1AA"
              />
            </div>

            {/* Country */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Country
              </label>
              <input
                type="text"
                value={roleData.country}
                onChange={(e) => handleInputChange('country', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                placeholder="e.g., United Kingdom"
              />
            </div>

            {/* Industry */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Industry <span className="text-red-500">*</span>
              </label>
              <select
                required
                value={roleData.industry}
                onChange={(e) => handleInputChange('industry', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              >
                <option value="">Select Industry</option>
                <option value="Technology">Technology</option>
                <option value="Finance">Finance</option>
                <option value="Healthcare">Healthcare</option>
                <option value="Manufacturing">Manufacturing</option>
                <option value="Retail">Retail</option>
                <option value="Education">Education</option>
                <option value="Construction">Construction</option>
                <option value="Legal">Legal</option>
                <option value="Marketing">Marketing</option>
                <option value="Other">Other</option>
              </select>
            </div>

            {/* Experience Required */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Experience Required
              </label>
              <select
                value={roleData.experienceRequired}
                onChange={(e) => handleInputChange('experienceRequired', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              >
                <option value="">Select Experience</option>
                <option value="Entry Level">Entry Level (0-2 years)</option>
                <option value="Mid Level">Mid Level (3-5 years)</option>
                <option value="Senior Level">Senior Level (6-10 years)</option>
                <option value="Executive Level">Executive Level (10+ years)</option>
              </select>
            </div>

            {/* Direct Approach Method */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Direct Approach Method
              </label>
              <select
                value={roleData.directApproachMethod}
                onChange={(e) => handleInputChange('directApproachMethod', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              >
                <option value="">Select Method</option>
                <option value="LinkedIn Outreach">LinkedIn Outreach</option>
                <option value="Email Campaign">Email Campaign</option>
                <option value="Phone Calls">Phone Calls</option>
                <option value="Networking Events">Networking Events</option>
                <option value="Referral Network">Referral Network</option>
                <option value="Multi-Channel">Multi-Channel Approach</option>
                <option value="Executive Search">Executive Search</option>
              </select>
            </div>

            {/* Target Seniority */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Target Seniority
              </label>
              <select
                value={roleData.targetSeniority}
                onChange={(e) => handleInputChange('targetSeniority', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              >
                <option value="">Select Seniority</option>
                <option value="Individual Contributor">Individual Contributor</option>
                <option value="Team Lead">Team Lead</option>
                <option value="Manager">Manager</option>
                <option value="Senior Manager">Senior Manager</option>
                <option value="Director">Director</option>
                <option value="VP">VP</option>
                <option value="C-Level">C-Level</option>
              </select>
            </div>

            {/* Company Size Preference */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Company Size Preference
              </label>
              <select
                value={roleData.companySizePreference}
                onChange={(e) => handleInputChange('companySizePreference', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              >
                <option value="">Select Company Size</option>
                <option value="Startup (1-50)">Startup (1-50)</option>
                <option value="Small (51-200)">Small (51-200)</option>
                <option value="Medium (201-1000)">Medium (201-1000)</option>
                <option value="Large (1001-5000)">Large (1001-5000)</option>
                <option value="Enterprise (5000+)">Enterprise (5000+)</option>
                <option value="No Preference">No Preference</option>
              </select>
            </div>

            {/* Direct Approach Budget */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Approach Budget
              </label>
              <input
                type="number"
                value={roleData.directApproachBudget}
                onChange={(e) => handleInputChange('directApproachBudget', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                placeholder="Budget for direct approach activities"
                min="0"
                step="0.01"
              />
            </div>

            {/* Approach Deadline */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Approach Deadline
              </label>
              <input
                type="date"
                value={roleData.approachDeadline}
                onChange={(e) => handleInputChange('approachDeadline', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              />
            </div>
          </div>

          {/* Salary Section */}
          <div className="border-t pt-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Salary Information</h3>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={salaryNotDefined}
                  onChange={(e) => setSalaryNotDefined(e.target.checked)}
                  className="mr-2 rounded"
                />
                <span className="text-sm text-gray-600">Salary not defined</span>
              </label>
            </div>

            {!salaryNotDefined && (
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Salary From
                  </label>
                  <input
                    type="number"
                    value={roleData.salaryFrom}
                    onChange={(e) => handleInputChange('salaryFrom', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    placeholder="25000"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Salary To
                  </label>
                  <input
                    type="number"
                    value={roleData.salaryTo}
                    onChange={(e) => handleInputChange('salaryTo', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    placeholder="35000"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Currency
                  </label>
                  <select
                    value={roleData.salaryCurrency}
                    onChange={(e) => handleInputChange('salaryCurrency', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  >
                    <option value="">Select Currency</option>
                    <option value="GBP">GBP (£)</option>
                    <option value="USD">USD ($)</option>
                    <option value="EUR">EUR (€)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Salary Type
                  </label>
                  <select
                    value={roleData.salaryType}
                    onChange={(e) => handleInputChange('salaryType', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  >
                    <option value="">Select Type</option>
                    <option value="Annual">Annual</option>
                    <option value="Monthly">Monthly</option>
                    <option value="Daily">Daily</option>
                    <option value="Hourly">Hourly</option>
                  </select>
                </div>
              </div>
            )}
          </div>

          {/* Text Areas */}
          <div className="border-t pt-6 space-y-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Target Companies
              </label>
              <textarea
                value={roleData.targetCompanies}
                onChange={(e) => handleInputChange('targetCompanies', e.target.value)}
                rows={4}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                placeholder="List specific companies or types of companies to target..."
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Contact Strategy
              </label>
              <textarea
                value={roleData.contactStrategy}
                onChange={(e) => handleInputChange('contactStrategy', e.target.value)}
                rows={4}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                placeholder="Describe the strategy for approaching and contacting potential candidates..."
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Industry Focus
              </label>
              <textarea
                value={roleData.industryFocus}
                onChange={(e) => handleInputChange('industryFocus', e.target.value)}
                rows={3}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                placeholder="Specific industry sectors or niches to focus on..."
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Geographic Scope
              </label>
              <textarea
                value={roleData.geographicScope}
                onChange={(e) => handleInputChange('geographicScope', e.target.value)}
                rows={3}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                placeholder="Geographic areas to include in the direct approach..."
              />
            </div>
          </div>

          {/* Submit Button */}
          <div className="border-t pt-6">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-semibold py-4 px-6 rounded-lg transition-colors duration-200 focus:ring-4 focus:ring-blue-300"
            >
              {isSubmitting 
                ? (editingRole ? 'Updating...' : 'Creating...') 
                : (editingRole ? 'Update 360 Direct Role' : 'Create 360 Direct Role')
              }
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
