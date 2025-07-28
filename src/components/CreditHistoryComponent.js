import React, { useState, useEffect } from 'react';
import { FiCreditCard, FiShoppingCart, FiUser, FiBriefcase, FiFileText, FiTarget, FiMinus, FiPlus, FiInfo, FiClock } from 'react-icons/fi';
import { authUtils } from '../lib/auth';

function CreditHistoryComponent({ userId, limit = 50, serviceType = null, className = '' }) {
  const [creditHistory, setCreditHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchCreditHistory = async () => {
    if (!userId) return;

    try {
      setLoading(true);
      setError(null);

      let url = `/api/users/credits/${userId}/history?limit=50`;
      if (serviceType) {
        url += `&serviceType=${serviceType}`;
      }

      console.log('Fetching credit history from:', url);
      const response = await authUtils.fetchWithAuth(url);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const result = await response.json();
      console.log('Credit history response:', result);

      // Handle different response structures
      if (result.success === true) {
        // API route success response
        setCreditHistory(result.creditHistory || []);
      } else if (result.success === false) {
        // API route error response
        if (result.error && result.error.includes('Backend URL not configured')) {
          setError('Backend service not configured. Please ensure NEXT_PUBLIC_API_URL is set.');
        } else {
          setError(result.message || 'Failed to fetch credit history');
        }
        console.error('Credit history error:', result);
      } else if (Array.isArray(result)) {
        // Direct array response from backend
        setCreditHistory(result);
      } else if (result.data && Array.isArray(result.data)) {
        // Backend response with data array
        setCreditHistory(result.data);
      } else {
        // Unknown response structure - show mock data for testing
        console.warn('Unknown response structure, using mock data:', result);
        setCreditHistory([
          {
            id: 1,
            actionType: 'usage',
            creditAmount: 1,
            serviceType: 'cv-sourcing',
            roleTitle: 'Software Engineer Position',
            createdAt: new Date().toISOString(),
            remainingCreditsAfter: 24
          },
          {
            id: 2,
            actionType: 'usage',
            creditAmount: 1,
            serviceType: 'prequalification',
            roleTitle: 'Marketing Manager',
            createdAt: new Date(Date.now() - 3600000).toISOString(),
            remainingCreditsAfter: 25
          },
          {
            id: 3,
            actionType: 'purchase',
            creditAmount: 25,
            serviceType: null,
            roleTitle: null,
            createdAt: new Date(Date.now() - 86400000).toISOString(),
            remainingCreditsAfter: 26
          }
        ]);
        setError('Note: Showing sample data - backend may not be configured');
      }
    } catch (err) {
      console.error('Error fetching credit history:', err);
      
      // If fetch fails completely, show mock data for testing
      if (err.message.includes('fetch') || err.message.includes('HTTP error')) {
        console.log('Backend not available, showing mock data for testing');
        setCreditHistory([
          {
            id: 1,
            actionType: 'usage',
            creditAmount: 1,
            serviceType: 'cv-sourcing',
            roleTitle: 'Software Engineer Position',
            createdAt: new Date().toISOString(),
            remainingCreditsAfter: 24
          },
          {
            id: 2,
            actionType: 'usage',
            creditAmount: 1,
            serviceType: 'prequalification',
            roleTitle: 'Marketing Manager',
            createdAt: new Date(Date.now() - 3600000).toISOString(),
            remainingCreditsAfter: 25
          },
          {
            id: 3,
            actionType: 'purchase',
            creditAmount: 25,
            serviceType: null,
            roleTitle: null,
            createdAt: new Date(Date.now() - 86400000).toISOString(),
            remainingCreditsAfter: 26
          }
        ]);
        setError('Note: Backend not available, showing sample data');
      } else {
        setError('Failed to fetch credit history: ' + err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCreditHistory();
  }, [userId, serviceType]);

  const getActionIcon = (actionType) => {
    switch (actionType) {
      case 'used':
        return <FiMinus className="text-red-500" size={16} />;
      case 'purchased':
        return <FiPlus className="text-green-500" size={16} />;
      case 'refunded':
        return <FiPlus className="text-blue-500" size={16} />;
      case 'expired':
        return <FiClock className="text-gray-500" size={16} />;
      default:
        return <FiInfo className="text-gray-500" size={16} />;
    }
  };

  const getActionColor = (actionType) => {
    switch (actionType) {
      case 'used':
        return 'text-red-600';
      case 'purchased':
        return 'text-green-600';
      case 'refunded':
        return 'text-blue-600';
      case 'expired':
        return 'text-gray-600';
      default:
        return 'text-gray-600';
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatCreditAmount = (amount) => {
    return amount > 0 ? `+${amount}` : amount.toString();
  };

  if (loading) {
    return (
      <div className={`flex items-center justify-center p-8 ${className}`}>
        <div className="flex items-center gap-2 text-gray-500">
          <FiCreditCard className="animate-spin" size={20} />
          <span>Loading credit history...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`p-4 bg-red-50 border border-red-200 rounded-lg ${className}`}>
        <div className="flex items-center gap-2 text-red-600">
          <FiInfo size={16} />
          <span className="text-sm font-medium">Error loading credit history</span>
        </div>
        <p className="text-red-500 text-sm mt-1">{error}</p>
      </div>
    );
  }

  if (creditHistory.length === 0) {
    return (
      <div className={`p-8 text-center text-gray-500 ${className}`}>
        <FiCreditCard size={48} className="mx-auto mb-4 text-gray-300" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">No Credit History</h3>
        <p className="text-sm">
          {error ? 
            'Unable to load credit history. This feature requires the backend server to be running.' : 
            'No credit transactions found for this account.'
          }
        </p>
        {error && (
          <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-blue-800 text-sm">
              <strong>Note:</strong> The credit history feature tracks when credits are used for creating roles. 
              Once you start creating roles, your transaction history will appear here.
            </p>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className={`bg-white ${className}`}>
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
          <FiCreditCard size={20} />
          Credit History
          {serviceType && (
            <span className="text-sm font-normal text-gray-500">
              • {serviceType}
            </span>
          )}
        </h3>
        <p className="text-sm text-gray-600 mt-1">
          Recent credit transactions and usage history
        </p>
      </div>

      <div className="space-y-3">
        {creditHistory.map((transaction, index) => (
          <div
            key={transaction.id || index}
            className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200 hover:bg-gray-100 transition-colors"
          >
            <div className="flex items-start gap-3 flex-1">
              <div className="flex-shrink-0 mt-0.5">
                {getActionIcon(transaction.actionType)}
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-sm font-medium text-gray-900">
                    {transaction.serviceTitle}
                  </span>
                  <span className="text-xs px-2 py-1 bg-white rounded-full border border-gray-200">
                    {transaction.actionType}
                  </span>
                </div>
                
                <p className="text-sm text-gray-600 mb-1">
                  {transaction.description}
                </p>
                
                {transaction.roleTitle && (
                  <p className="text-xs text-gray-500">
                    Role: {transaction.roleTitle}
                  </p>
                )}
                
                <p className="text-xs text-gray-400 mt-1">
                  {formatDate(transaction.createdAt)}
                </p>
              </div>
            </div>

            <div className="flex-shrink-0 text-right">
              <div className={`text-sm font-semibold ${getActionColor(transaction.actionType)}`}>
                {formatCreditAmount(transaction.creditAmount)} credit{Math.abs(transaction.creditAmount) !== 1 ? 's' : ''}
              </div>
              <div className="text-xs text-gray-500 mt-1">
                {transaction.remainingCreditsAfter} remaining
              </div>
            </div>
          </div>
        ))}
      </div>

      {creditHistory.length >= 50 && (
        <div className="mt-4 text-center">
          <p className="text-sm text-gray-500">
            Showing latest 50 transactions
          </p>
        </div>
      )}
    </div>
  );
};

export default CreditHistoryComponent;
