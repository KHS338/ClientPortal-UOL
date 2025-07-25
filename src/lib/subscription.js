import { authUtils } from './auth';
import { clearAllUserData } from './userStorage';

/**
 * Subscription utility functions for managing subscription state
 */

/**
 * Get current user subscription from backend (prioritizes backend over localStorage)
 * @param {number} userId - The user ID
 * @returns {Promise<Object|null>} The subscription data or null if none found
 */
export const getCurrentSubscription = async (userId) => {
  try {
    const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL || 'https://8w2mk49p-3001.inc1.devtunnels.ms/';
    const response = await authUtils.fetchWithAuth(`${apiBaseUrl}/user-subscriptions/user/${userId}/summary`);
    const result = await response.json();
    
    if (result && result.activeSubscription) {
      const activeSubscription = result.activeSubscription;
      const serviceName = activeSubscription.subscription?.title;
      
      // Calculate next payment date
      const getNextPaymentDate = (billingCycle) => {
        const now = new Date();
        if (billingCycle === 'monthly') {
          now.setMonth(now.getMonth() + 1);
        } else if (billingCycle === 'annual') {
          now.setFullYear(now.getFullYear() + 1);
        } else {
          now.setMonth(now.getMonth() + 1);
        }
        return now.toLocaleDateString('en-US', { 
          year: 'numeric', 
          month: 'short', 
          day: 'numeric' 
        });
      };

      const subscriptionData = {
        service: serviceName,
        billingCycle: activeSubscription.billingCycle,
        price: activeSubscription.billingCycle === 'monthly' ? 
               `$${activeSubscription.subscription?.monthlyPrice || 0}/mo` :
               activeSubscription.billingCycle === 'annual' ?
               `$${activeSubscription.subscription?.annualPrice || 0}/yr` :
               'Custom',
        subscribedDate: activeSubscription.startDate,
        nextPayment: getNextPaymentDate(activeSubscription.billingCycle),
        planKey: `${serviceName.toLowerCase().replace(/[^a-z0-9]/g, '-')}-${activeSubscription.billingCycle}`,
        paymentInfo: {
          paymentIntentId: activeSubscription.paymentIntentId,
          status: activeSubscription.status
        },
        credits: {
          total: result.totalRemainingCredits || 0,
          history: result.subscriptionHistory || []
        }
      };

      // Update localStorage with backend data for consistency
      localStorage.setItem('userSubscription', JSON.stringify(subscriptionData));
      
      return subscriptionData;
    } else {
      // No active subscription found
      localStorage.removeItem('userSubscription');
      return null;
    }
  } catch (error) {
    console.error('Error fetching subscription from backend:', error);
    
    // Fallback to localStorage only if backend fails
    const savedSubscription = localStorage.getItem('userSubscription');
    if (savedSubscription) {
      try {
        return JSON.parse(savedSubscription);
      } catch (parseError) {
        console.error('Error parsing localStorage subscription:', parseError);
        localStorage.removeItem('userSubscription');
        return null;
      }
    }
    
    return null;
  }
};

/**
 * Check if user has access to a specific service/role
 * @param {string} serviceName - The service name to check access for
 * @param {string} userSubscription - Current user subscription
 * @returns {boolean} Whether user has access
 */
export const hasServiceAccess = (serviceName, userSubscription) => {
  if (!userSubscription) {
    return false;
  }
  
  // Map service names to subscription requirements
  const serviceToSubscription = {
    "CV Sourcing": ["CV Sourcing", "Free Trial"],
    "PreQualification": ["Prequalification"], 
    "360/Direct": ["360/Direct"],
    "Lead Generation": ["Lead Generation"],
    "Leads Generation": ["Lead Generation"], // Alternative naming
    "VA": ["VA"]
  };
  
  const requiredSubscriptions = serviceToSubscription[serviceName];
  if (!requiredSubscriptions) {
    return false;
  }
  
  return requiredSubscriptions.includes(userSubscription);
};

/**
 * Clear subscription data (for logout)
 */
export const clearSubscriptionData = () => {
  // Clear all user-specific localStorage data
  localStorage.removeItem('userSubscription');
  localStorage.removeItem('userData');
  localStorage.removeItem('userEmail');
  localStorage.removeItem('recentRoleActivity');
  localStorage.removeItem('registeredUser');
  
  // Clear any cached credit data (if any)
  localStorage.removeItem('userCredits');
  localStorage.removeItem('totalRemainingCredits');
  
  // Clear all user-specific data from all users
  clearAllUserData();
  
  // Dispatch event to notify components
  window.dispatchEvent(new CustomEvent('subscriptionCleared'));
};

/**
 * Update subscription data and notify components
 * @param {Object} subscriptionData - The subscription data to store
 */
export const updateSubscriptionData = (subscriptionData) => {
  localStorage.setItem('userSubscription', JSON.stringify(subscriptionData));
  
  // Dispatch event to notify components
  window.dispatchEvent(new CustomEvent('subscriptionUpdated', { 
    detail: subscriptionData 
  }));
};

const subscriptionUtils = {
  getCurrentSubscription,
  hasServiceAccess,
  clearSubscriptionData,
  updateSubscriptionData
};

export default subscriptionUtils;
