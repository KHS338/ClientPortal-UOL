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
    qualificationCriteria: '',
    assessmentType: '',
    qualificationDeadline: '',
    targetCandidates: '',
    minimumExperience: '',
    requiredSkills: '',
    preferredQualifications: '',
    clientRequirements: ''
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
        qualificationCriteria: editingRole.qualificationCriteria || '',
        assessmentType: editingRole.assessmentType || '',
        qualificationDeadline: editingRole.qualificationDeadline || '',
        targetCandidates: editingRole.targetCandidates || '',
        minimumExperience: editingRole.minimumExperience || '',
        requiredSkills: editingRole.requiredSkills || '',
        preferredQualifications: editingRole.preferredQualifications || '',
        clientRequirements: editingRole.clientRequirements || ''
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
        qualificationCriteria: roleData.qualificationCriteria || null,
        assessmentType: roleData.assessmentType || null,
        qualificationDeadline: roleData.qualificationDeadline || null,
        targetCandidates: roleData.targetCandidates ? parseInt(roleData.targetCandidates) : null,
        minimumExperience: roleData.minimumExperience || null,
        requiredSkills: roleData.requiredSkills || null,
        preferredQualifications: roleData.preferredQualifications || null,
        clientRequirements: roleData.clientRequirements || null,
        userId: parseInt(user.id)
      }
      
      // If editing, use PUT request
      let response
      if (editingRole) {
        response = await fetch(`https://8w2mk49p-3001.inc1.devtunnels.ms//prequalification/${editingRole.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(apiData)
        })
      } else {
        // Creating new role, use POST request
        response = await fetch('https://8w2mk49p-3001.inc1.devtunnels.ms//prequalification', {
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
            ? 'Prequalification Role Updated Successfully! 🎉' 
            : 'Prequalification Role Created Successfully! 🎉'
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
            qualificationCriteria: '',
            assessmentType: '',
            qualificationDeadline: '',
            targetCandidates: '',
            minimumExperience: '',
            requiredSkills: '',
            preferredQualifications: '',
            clientRequirements: ''
          })
          setSalaryNotDefined(false)
        }
      } else {
        throw new Error(result.message || 'Failed to save prequalification role')
      }
      
    } catch (error) {
      console.error('Error saving prequalification role:', error)
      if (onSuccess) {
        onSuccess(`Error ${editingRole ? 'updating' : 'creating'} prequalification role: ${error.message}`, 'error')
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="h-full flex flex-col">
      <div className="flex-shrink-0 bg-white border-b p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          {editingRole ? 'Edit Prequalification Role' : 'Create New Prequalification Role'}
        </h2>
        <p className="text-gray-600 text-sm">
          {editingRole 
            ? 'Update the prequalification role information below.' 
            : 'Fill out the form below to add a new prequalification role to the system.'
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

            {/* Assessment Type */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Assessment Type
              </label>
              <select
                value={roleData.assessmentType}
                onChange={(e) => handleInputChange('assessmentType', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              >
                <option value="">Select Assessment Type</option>
                <option value="Technical Assessment">Technical Assessment</option>
                <option value="Competency Based">Competency Based</option>
                <option value="Psychometric Testing">Psychometric Testing</option>
                <option value="Portfolio Review">Portfolio Review</option>
                <option value="Case Study">Case Study</option>
                <option value="Multiple Stage">Multiple Stage</option>
                <option value="Custom Assessment">Custom Assessment</option>
              </select>
            </div>

            {/* Target Candidates */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Target Candidates
              </label>
              <input
                type="number"
                value={roleData.targetCandidates}
                onChange={(e) => handleInputChange('targetCandidates', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                placeholder="Number of candidates to qualify"
                min="1"
              />
            </div>

            {/* Minimum Experience */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Minimum Experience
              </label>
              <input
                type="text"
                value={roleData.minimumExperience}
                onChange={(e) => handleInputChange('minimumExperience', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                placeholder="e.g., 3 years in similar role"
              />
            </div>

            {/* Qualification Deadline */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Qualification Deadline
              </label>
              <input
                type="date"
                value={roleData.qualificationDeadline}
                onChange={(e) => handleInputChange('qualificationDeadline', e.target.value)}
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
                Qualification Criteria
              </label>
              <textarea
                value={roleData.qualificationCriteria}
                onChange={(e) => handleInputChange('qualificationCriteria', e.target.value)}
                rows={4}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                placeholder="Describe the specific criteria used to qualify candidates..."
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Required Skills
              </label>
              <textarea
                value={roleData.requiredSkills}
                onChange={(e) => handleInputChange('requiredSkills', e.target.value)}
                rows={3}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                placeholder="List the essential skills required for this role..."
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Preferred Qualifications
              </label>
              <textarea
                value={roleData.preferredQualifications}
                onChange={(e) => handleInputChange('preferredQualifications', e.target.value)}
                rows={3}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                placeholder="List preferred qualifications, certifications, or experience..."
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Client Requirements
              </label>
              <textarea
                value={roleData.clientRequirements}
                onChange={(e) => handleInputChange('clientRequirements', e.target.value)}
                rows={4}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                placeholder="Specific requirements from the client..."
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
                : (editingRole ? 'Update Prequalification Role' : 'Create Prequalification Role')
              }
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
