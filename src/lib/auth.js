// Authentication utilities
export const authUtils = {
  // Get token from storage
  getToken: () => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('authToken') || sessionStorage.getItem('authToken');
    }
    return null;
  },

  // Get user data from storage
  getUserData: () => {
    if (typeof window !== 'undefined') {
      const userData = localStorage.getItem('userData') || sessionStorage.getItem('userData');
      return userData ? JSON.parse(userData) : null;
    }
    return null;
  },

  // Set authentication data
  setAuth: (token, user, remember = false) => {
    if (typeof window !== 'undefined') {
      // Check if data is already in localStorage or sessionStorage
      const existingToken = localStorage.getItem('authToken') || sessionStorage.getItem('authToken');
      const useLocalStorage = remember || !!localStorage.getItem('authToken');
      
      if (useLocalStorage) {
        localStorage.setItem('authToken', token);
        localStorage.setItem('userData', JSON.stringify(user));
        // Clear sessionStorage if we're using localStorage
        sessionStorage.removeItem('authToken');
        sessionStorage.removeItem('userData');
      } else {
        sessionStorage.setItem('authToken', token);
        sessionStorage.setItem('userData', JSON.stringify(user));
        // Clear localStorage if we're using sessionStorage
        localStorage.removeItem('authToken');
        localStorage.removeItem('userData');
      }
    }
  },

  // Clear authentication data
  clearAuth: () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('authToken');
      localStorage.removeItem('userData');
      sessionStorage.removeItem('authToken');
      sessionStorage.removeItem('userData');
    }
  },

  // Check if user is authenticated
  isAuthenticated: () => {
    return !!authUtils.getToken();
  },

  // Make authenticated API calls
  fetchWithAuth: async (url, options = {}) => {
    const token = authUtils.getToken();
    const headers = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    const response = await fetch(url, {
      ...options,
      headers,
    });

    // If unauthorized, clear auth and redirect to login
    if (response.status === 401) {
      authUtils.clearAuth();
      if (typeof window !== 'undefined') {
        window.location.href = '/login';
      }
      throw new Error('Authentication expired');
    }

    return response;
  }
};
