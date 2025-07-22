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

  // Set cookie helper
  setCookie: (name, value, days = 7) => {
    if (typeof window !== 'undefined') {
      const expires = new Date();
      expires.setTime(expires.getTime() + (days * 24 * 60 * 60 * 1000));
      document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/;SameSite=Strict`;
    }
  },

  // Get cookie helper
  getCookie: (name) => {
    if (typeof window !== 'undefined') {
      const nameEQ = name + "=";
      const ca = document.cookie.split(';');
      for (let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) === ' ') c = c.substring(1, c.length);
        if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
      }
    }
    return null;
  },

  // Delete cookie helper
  deleteCookie: (name) => {
    if (typeof window !== 'undefined') {
      document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/;`;
    }
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
        // Set cookie for middleware
        authUtils.setCookie('auth_token', token, 7);
      } else {
        sessionStorage.setItem('authToken', token);
        sessionStorage.setItem('userData', JSON.stringify(user));
        // Clear localStorage if we're using sessionStorage
        localStorage.removeItem('authToken');
        localStorage.removeItem('userData');
        // Set cookie for middleware (session cookie)
        authUtils.setCookie('auth_token', token, 1);
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
      // Clear cookie
      authUtils.deleteCookie('auth_token');
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
