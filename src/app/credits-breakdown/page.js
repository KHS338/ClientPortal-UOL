"use client";

import { useState, useEffect } from "react";
import { FiCreditCard, FiArrowLeft, FiCalendar, FiUser, FiFilter } from "react-icons/fi";
import ProtectedRoute from "@/components/ProtectedRoute";
import { useAuth } from "@/contexts/AuthContext";
import { getCurrentSubscription } from "@/lib/subscription";
import Link from 'next/link';

export default function CreditsBreakdownPage() {
  const { user, isAuthenticated } = useAuth();
  const [userCredits, setUserCredits] = useState([]);
  const [totalRemainingCredits, setTotalRemainingCredits] = useState(0);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('');

  const statusOptions = [
    { value: '', label: 'All Statuses' },
    { value: 'active', label: 'Active' },
    { value: 'expired', label: 'Expired' },
    { value: 'cancelled', label: 'Cancelled' },
  ];

  useEffect(() => {
    const loadData = async () => {
      try {
        if (!isAuthenticated || !user?.id) {
          setUserCredits([]);
          setTotalRemainingCredits(0);
          return;
        }
        
        const userId = parseInt(user.id);
        const subscriptionData = await getCurrentSubscription(userId);
        
        if (subscriptionData) {
          setUserCredits(subscriptionData.credits.history);
          setTotalRemainingCredits(subscriptionData.credits.total);
        } else {
          setUserCredits([]);
          setTotalRemainingCredits(0);
        }
      } catch (error) {
        console.error('Error loading user subscription data:', error);
        setUserCredits([]);
        setTotalRemainingCredits(0);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [user, isAuthenticated]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'expired':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'cancelled':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      default:
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    }
  };

  const getBillingCycleColor = (cycle) => {
    switch (cycle) {
      case 'monthly':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'annual':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'adhoc':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  // Filter credits based on status
  const filteredCredits = filterStatus ? 
    userCredits.filter(credit => credit.status === filterStatus) : 
    userCredits;

  if (!isAuthenticated || !user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Authentication Required</h2>
          <p className="text-gray-600 mb-4">Please log in to view your credits breakdown.</p>
          <Link href="/login" className="text-blue-600 hover:text-blue-700 font-medium">
            Go to Login
          </Link>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen bg-gray-50">
          <div className="flex justify-center items-center py-20">
            <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <div className="flex items-center gap-4">
                <Link 
                  href="/subscription-info" 
                  className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
                >
                  <FiArrowLeft size={20} />
                  <span className="text-sm font-medium">Back to Subscription</span>
                </Link>
                <div className="h-6 w-px bg-gray-300"></div>
                <h1 className="text-xl font-semibold text-gray-900">Credits Breakdown</h1>
              </div>
              
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <p className="text-sm text-gray-600">Total Credits</p>
                  <p className="text-lg font-semibold text-blue-600">{totalRemainingCredits}</p>
                </div>
                <div className="flex items-center gap-2">
                  <FiFilter size={16} className="text-gray-400" />
                  <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="text-sm border border-gray-300 rounded-lg px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    {statusOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="max-w-6xl mx-auto">
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

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex items-center gap-3 mb-2">
                  <FiCreditCard size={20} className="text-blue-600" />
                  <h3 className="text-sm font-medium text-gray-900">Total Subscriptions</h3>
                </div>
                <p className="text-2xl font-bold text-gray-900">{userCredits.length}</p>
                <p className="text-sm text-gray-600">All time subscriptions</p>
              </div>

              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex items-center gap-3 mb-2">
                  <FiUser size={20} className="text-green-600" />
                  <h3 className="text-sm font-medium text-gray-900">Active Subscriptions</h3>
                </div>
                <p className="text-2xl font-bold text-gray-900">
                  {userCredits.filter(sub => sub.status === 'active').length}
                </p>
                <p className="text-sm text-gray-600">Currently active</p>
              </div>

              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex items-center gap-3 mb-2">
                  <FiCalendar size={20} className="text-purple-600" />
                  <h3 className="text-sm font-medium text-gray-900">This Month</h3>
                </div>
                <p className="text-2xl font-bold text-gray-900">
                  {userCredits.filter(sub => {
                    const subDate = new Date(sub.startDate);
                    const now = new Date();
                    return subDate.getMonth() === now.getMonth() && subDate.getFullYear() === now.getFullYear();
                  }).length}
                </p>
                <p className="text-sm text-gray-600">New subscriptions</p>
              </div>
            </div>

            {/* Credits Breakdown */}
            {filteredCredits.length === 0 ? (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
                <div className="text-center">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
                    <FiCreditCard className="text-gray-400" size={32} />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {filterStatus ? `No ${filterStatus} subscriptions found` : 'No Subscriptions Found'}
                  </h3>
                  <p className="text-gray-600 mb-4">
                    {filterStatus ? 
                      `You don't have any ${filterStatus} subscription credits.` :
                      "You don't have any subscription credits yet. Visit the subscription page to get started!"
                    }
                  </p>
                  {!filterStatus && (
                    <Link
                      href="/subscription-info"
                      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      View Subscription Plans
                    </Link>
                  )}
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                    <FiCreditCard size={20} />
                    {filterStatus ? `${filterStatus.charAt(0).toUpperCase() + filterStatus.slice(1)} Credits` : 'All Credits'} 
                    ({filteredCredits.length})
                  </h3>
                </div>
                
                <div className="space-y-4">
                  {filteredCredits.map((subscription, index) => (
                    <div key={subscription.id || index} className="border border-gray-200 rounded-lg p-6 hover:border-gray-300 transition-colors">
                      <div className="flex justify-between items-start mb-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-3">
                            <h4 className="text-lg font-medium text-gray-900">
                              {subscription.subscription?.title || 'Unknown Service'}
                            </h4>
                            <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(subscription.status)}`}>
                              {subscription.status}
                            </span>
                            <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getBillingCycleColor(subscription.billingCycle)}`}>
                              {subscription.billingCycle}
                            </span>
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                            <div>
                              <span className="font-medium text-gray-900">Start Date:</span>
                              <p className="text-gray-600">{new Date(subscription.startDate).toLocaleDateString()}</p>
                            </div>
                            {subscription.endDate && (
                              <div>
                                <span className="font-medium text-gray-900">End Date:</span>
                                <p className="text-gray-600">{new Date(subscription.endDate).toLocaleDateString()}</p>
                              </div>
                            )}
                            <div>
                              <span className="font-medium text-gray-900">Paid Amount:</span>
                              <p className="text-gray-600">£{subscription.paidAmount}</p>
                            </div>
                            <div>
                              <span className="font-medium text-gray-900">Currency:</span>
                              <p className="text-gray-600">{subscription.currency}</p>
                            </div>
                          </div>
                        </div>
                        
                        <div className="text-right ml-6">
                          <div className="text-2xl font-bold text-gray-900 mb-1">
                            {subscription.remainingCredits} / {subscription.totalCredits}
                          </div>
                          <div className="text-sm text-gray-600 mb-2">Credits</div>
                          <div className="w-24 bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                              style={{ 
                                width: `${(subscription.remainingCredits / subscription.totalCredits) * 100}%` 
                              }}
                            ></div>
                          </div>
                          <div className="text-xs text-gray-500 mt-1">
                            {Math.round((subscription.remainingCredits / subscription.totalCredits) * 100)}% remaining
                          </div>
                        </div>
                      </div>
                      
                      {subscription.paymentIntentId && (
                        <div className="mt-4 pt-4 border-t border-gray-200">
                          <div className="text-xs text-gray-500">
                            <span className="font-medium">Payment ID:</span> {subscription.paymentIntentId}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
