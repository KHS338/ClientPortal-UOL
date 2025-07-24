// src/hooks/useCredits.js
import { useState, useEffect } from 'react';
import { getUserCredits } from '@/lib/credits';

/**
 * Custom hook for managing user credits
 * @param {number} userId - The user ID
 * @param {number} refreshInterval - Auto refresh interval in milliseconds (default: 30 seconds)
 * @returns {Object} Credits data and refresh function
 */
export function useCredits(userId, refreshInterval = 30000) {
  const [credits, setCredits] = useState([]);
  const [totalRemainingCredits, setTotalRemainingCredits] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchCredits = async () => {
    if (!userId) return;
    
    try {
      setError(null);
      const result = await getUserCredits(userId);
      
      if (result.success) {
        setCredits(result.credits);
        setTotalRemainingCredits(result.totalRemainingCredits);
      } else {
        setError(result.message);
        setCredits([]);
        setTotalRemainingCredits(0);
      }
    } catch (err) {
      setError('Failed to fetch credits');
      setCredits([]);
      setTotalRemainingCredits(0);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCredits();

    // Set up auto-refresh
    const interval = setInterval(fetchCredits, refreshInterval);

    // Listen for manual refresh events
    const handleCreditsRefresh = () => {
      fetchCredits();
    };

    window.addEventListener('creditsUpdated', handleCreditsRefresh);

    return () => {
      clearInterval(interval);
      window.removeEventListener('creditsUpdated', handleCreditsRefresh);
    };
  }, [userId, refreshInterval]);

  return {
    credits,
    totalRemainingCredits,
    loading,
    error,
    refresh: fetchCredits
  };
}
