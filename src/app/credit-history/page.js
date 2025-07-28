'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import CreditHistoryComponent from '../../components/CreditHistoryComponent';
import { FiArrowLeft, FiFilter } from 'react-icons/fi';
import Link from 'next/link';

export default function CreditHistoryPage() {
  const { user, isAuthenticated } = useAuth();
  const [selectedService, setSelectedService] = useState('');

  const serviceOptions = [
    { value: '', label: 'All Services' },
    { value: 'cv-sourcing', label: 'CV Sourcing' },
    { value: 'prequalification', label: 'Prequalification' },
    { value: 'direct', label: '360/Direct' },
    { value: 'lead-generation-job', label: 'Lead Generation' },
  ];

  if (!isAuthenticated || !user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Authentication Required</h2>
          <p className="text-gray-600 mb-4">Please log in to view your credit history.</p>
          <Link href="/login" className="text-blue-600 hover:text-blue-700 font-medium">
            Go to Login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <Link 
                href="/dashboard" 
                className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
              >
                <FiArrowLeft size={20} />
                <span className="text-sm font-medium">Back to Dashboard</span>
              </Link>
              <div className="h-6 w-px bg-gray-300"></div>
              <h1 className="text-xl font-semibold text-gray-900">Credit History</h1>
            </div>
            
            <div className="flex items-center gap-2">
              <FiFilter size={16} className="text-gray-400" />
              <select
                value={selectedService}
                onChange={(e) => setSelectedService(e.target.value)}
                className="text-sm border border-gray-300 rounded-lg px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                {serviceOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-4xl mx-auto">
          {/* User Info */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold text-gray-900">
                  {user.firstName} {user.lastName}
                </h2>
                <p className="text-sm text-gray-600">{user.email}</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-600">Account ID</p>
                <p className="text-lg font-mono text-gray-900">#{user.id}</p>
              </div>
            </div>
          </div>

          {/* Credit History */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <CreditHistoryComponent 
              userId={user.id} 
              serviceType={selectedService || null}
              className=""
            />
          </div>
        </div>
      </div>
    </div>
  );
}
