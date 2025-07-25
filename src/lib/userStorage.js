/**
 * Utilities for user-specific localStorage operations
 */

/**
 * Get a user-specific localStorage key
 * @param {string} key - The base key
 * @param {string|number} userId - The user ID
 * @returns {string} The user-specific key
 */
const getUserKey = (key, userId) => {
  return `user_${userId}_${key}`;
};

/**
 * Set a value in localStorage with user-specific key
 * @param {string} key - The base key
 * @param {string|number} userId - The user ID
 * @param {any} value - The value to store (will be JSON stringified)
 */
export const setUserItem = (key, userId, value) => {
  if (!userId) {
    console.warn('No userId provided for setUserItem');
    return;
  }
  
  try {
    const userKey = getUserKey(key, userId);
    localStorage.setItem(userKey, JSON.stringify(value));
  } catch (error) {
    console.error('Error setting user-specific localStorage item:', error);
  }
};

/**
 * Get a value from localStorage with user-specific key
 * @param {string} key - The base key
 * @param {string|number} userId - The user ID
 * @param {any} defaultValue - Default value if not found
 * @returns {any} The parsed value or default
 */
export const getUserItem = (key, userId, defaultValue = null) => {
  if (!userId) {
    console.warn('No userId provided for getUserItem');
    return defaultValue;
  }
  
  try {
    const userKey = getUserKey(key, userId);
    const item = localStorage.getItem(userKey);
    return item ? JSON.parse(item) : defaultValue;
  } catch (error) {
    console.error('Error getting user-specific localStorage item:', error);
    return defaultValue;
  }
};

/**
 * Remove a value from localStorage with user-specific key
 * @param {string} key - The base key
 * @param {string|number} userId - The user ID
 */
export const removeUserItem = (key, userId) => {
  if (!userId) {
    console.warn('No userId provided for removeUserItem');
    return;
  }
  
  try {
    const userKey = getUserKey(key, userId);
    localStorage.removeItem(userKey);
  } catch (error) {
    console.error('Error removing user-specific localStorage item:', error);
  }
};

/**
 * Clear all user-specific data for a given user
 * @param {string|number} userId - The user ID
 */
export const clearUserData = (userId) => {
  if (!userId) {
    console.warn('No userId provided for clearUserData');
    return;
  }
  
  try {
    const prefix = `user_${userId}_`;
    const keysToRemove = [];
    
    // Find all keys that belong to this user
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith(prefix)) {
        keysToRemove.push(key);
      }
    }
    
    // Remove all user-specific keys
    keysToRemove.forEach(key => localStorage.removeItem(key));
    
    console.log(`Cleared ${keysToRemove.length} user-specific localStorage items for user ${userId}`);
  } catch (error) {
    console.error('Error clearing user-specific localStorage data:', error);
  }
};

/**
 * Clear all user data for all users (useful for complete logout cleanup)
 */
export const clearAllUserData = () => {
  try {
    const keysToRemove = [];
    
    // Find all keys that are user-specific
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith('user_')) {
        keysToRemove.push(key);
      }
    }
    
    // Remove all user-specific keys
    keysToRemove.forEach(key => localStorage.removeItem(key));
    
    console.log(`Cleared ${keysToRemove.length} total user-specific localStorage items`);
  } catch (error) {
    console.error('Error clearing all user-specific localStorage data:', error);
  }
};

export default {
  setUserItem,
  getUserItem,
  removeUserItem,
  clearUserData,
  clearAllUserData
};
