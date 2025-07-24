// src/lib/credits.js
/**
 * Utility functions for handling user credits
 */

/**
 * Fetches user credits from the API
 * @param {number} userId - The user ID
 * @returns {Promise<Object>} Credits data
 */
export async function getUserCredits(userId) {
  try {
    const response = await fetch(`/api/users/credits/${userId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    
    if (result.success) {
      return {
        success: true,
        credits: result.credits,
        totalRemainingCredits: result.totalRemainingCredits,
        activeSubscription: result.activeSubscription
      };
    } else {
      return {
        success: false,
        message: result.message,
        credits: [],
        totalRemainingCredits: 0
      };
    }
  } catch (error) {
    console.error('Error fetching user credits:', error);
    return {
      success: false,
      message: 'Failed to fetch credits',
      credits: [],
      totalRemainingCredits: 0
    };
  }
}

/**
 * Gets remaining credits for a specific service type
 * @param {Array} userCredits - User's credit subscriptions
 * @param {string} serviceTitle - The service title to check
 * @returns {number} Remaining credits for the service
 */
export function getRemainingCreditsForService(userCredits, serviceTitle) {
  if (!userCredits || userCredits.length === 0) {
    return 0;
  }

  const matchingSubscription = userCredits.find(sub => 
    sub.subscription?.title === serviceTitle && 
    sub.status === 'active'
  );

  return matchingSubscription ? matchingSubscription.remainingCredits : 0;
}

/**
 * Maps service endpoints to subscription titles
 * @param {string} serviceType - The service type
 * @returns {string} The subscription title
 */
export function getSubscriptionTitle(serviceType) {
  const serviceMapping = {
    'cv-sourcing': 'CV Sourcing',
    'prequalification': 'Prequalification', 
    'direct': '360/Direct',
    'lead-generation-job': 'Lead Generation',
    'lead-generation-industry': 'Lead Generation'
  };

  return serviceMapping[serviceType] || serviceType;
}
