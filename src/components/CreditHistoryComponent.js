import React, { useState, useEffect } from 'react';
import { FiCreditCard, FiMinus, FiPlus, FiInfo, FiClock } from 'react-icons/fi';

const CreditHistoryComponent = ({ userId, serviceType = null, className = "", limit = 50, showLatest = false }) => {
  const [creditHistory, setCreditHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchCreditHistory = async () => {
    if (!userId) return;

    try {
      setLoading(true);
      setError(null);

      // For small limits with showLatest, fetch more data to ensure we get the latest entries
      const fetchLimit = showLatest && limit < 50 ? Math.max(50, limit) : limit;
      
      // Use the API endpoint that forwards to backend
      let url = `/api/users/credits/${userId}/history?limit=${fetchLimit}`;
      if (serviceType) {
        url += `&serviceType=${serviceType}`;
      }

      const response = await fetch(url);
      const result = await response.json();

      if (result.success) {
        // The backend returns data.data, but we want to maintain compatibility
        setCreditHistory(result.creditHistory || result.data || []);
      } else {
        setError(result.message);
      }
    } catch (err) {
      setError('Failed to fetch credit history');
      console.error('Error fetching credit history:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCreditHistory();
  }, [userId, serviceType, limit, showLatest]);

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
        <p className="text-sm">No credit transactions found for this account.</p>
      </div>
    );
  }

  return (
    <div className={`bg-white ${className}`}>
      {limit >= 50 && (
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
      )}

      <div className="space-y-3">
        {(showLatest && limit < 50 ? creditHistory.slice(-limit) : creditHistory.slice(0, limit)).map((transaction, index) => (
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

      {creditHistory.length > limit && (
        <div className="mt-4 text-center">
          <p className="text-sm text-gray-500">
            Showing {showLatest && limit < 50 ? 'latest' : 'first'} {Math.min(limit, creditHistory.length)} of {creditHistory.length} transactions
          </p>
        </div>
      )}
    </div>
  );
};

export default CreditHistoryComponent;
