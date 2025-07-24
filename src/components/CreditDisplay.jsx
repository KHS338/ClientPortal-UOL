// src/components/CreditDisplay.jsx
"use client";

import { useState, useEffect } from 'react';
import { FiCreditCard, FiRefreshCw } from 'react-icons/fi';
import { getRemainingCreditsForService, getSubscriptionTitle } from '@/lib/credits';

/**
 * Component to display remaining credits for a specific service
 */
export default function CreditDisplay({ userId, serviceType, className = "" }) {
  const [credits, setCredits] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchCredits = async () => {
    if (!userId || !serviceType) return;

    try {
      setLoading(true);
      setError(null);

      const response = await fetch('/api/users/credits/check', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId, serviceType })
      });

      const result = await response.json();

      if (result.success) {
        setCredits(result.remainingCredits);
      } else {
        setError(result.message);
        setCredits(0);
      }
    } catch (err) {
      setError('Failed to fetch credits');
      setCredits(0);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCredits();

    // Listen for credit updates
    const handleCreditsUpdate = () => {
      fetchCredits();
    };

    window.addEventListener('creditsUpdated', handleCreditsUpdate);

    return () => {
      window.removeEventListener('creditsUpdated', handleCreditsUpdate);
    };
  }, [userId, serviceType]);

  const subscriptionTitle = getSubscriptionTitle(serviceType);

  if (loading) {
    return (
      <div className={`flex items-center gap-2 text-gray-500 ${className}`}>
        <FiRefreshCw className="animate-spin" size={16} />
        <span className="text-sm">Loading credits...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`flex items-center gap-2 text-red-500 ${className}`}>
        <FiCreditCard size={16} />
        <span className="text-sm">Error loading credits</span>
      </div>
    );
  }

  const hasCredits = credits > 0;

  return (
    <div className={`flex items-center gap-2 ${hasCredits ? 'text-green-600' : 'text-red-500'} ${className}`}>
      <FiCreditCard size={16} />
      <span className="text-sm font-medium">
        {credits} credit{credits !== 1 ? 's' : ''} remaining for {subscriptionTitle}
      </span>
      {!hasCredits && (
        <span className="text-xs text-red-400 ml-1">
          (No credits available)
        </span>
      )}
    </div>
  );
}
