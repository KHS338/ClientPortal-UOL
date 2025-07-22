"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, isLoading, user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    console.log('ProtectedRoute - Auth state:', { isAuthenticated, isLoading, hasUser: !!user });
    
    if (!isLoading && !isAuthenticated) {
      console.log('ProtectedRoute - User not authenticated, redirecting to login');
      // Clear any existing user data from localStorage
      localStorage.removeItem('user');
      localStorage.removeItem('userSubscription');
      
      // Redirect to login page
      router.replace('/login');
    }
  }, [isAuthenticated, isLoading, router, user]);

  // NEVER render children if not authenticated, regardless of loading state
  if (!isAuthenticated) {
    const message = isLoading ? 'Verifying authentication...' : 'Redirecting to login...';
    const borderColor = isLoading ? 'border-green-500' : 'border-red-500';
    
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className={`w-16 h-16 border-4 ${borderColor} border-t-transparent rounded-full animate-spin mx-auto mb-4`}></div>
          <p className="text-gray-600">{message}</p>
        </div>
      </div>
    );
  }

  // Additional check for user data
  if (!user) {
    console.log('ProtectedRoute - No user data found, showing loading');
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-yellow-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading user data...</p>
        </div>
      </div>
    );
  }

  // Render children only if fully authenticated with user data
  console.log('ProtectedRoute - Rendering protected content');
  return children;
};

export default ProtectedRoute;