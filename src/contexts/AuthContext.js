"use client";

import { createContext, useContext, useReducer, useEffect } from 'react';
import { authUtils } from '@/lib/auth';

// Initial state
const initialState = {
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: true,
  error: null
};

// Action types
const AUTH_ACTIONS = {
  SET_LOADING: 'SET_LOADING',
  LOGIN_SUCCESS: 'LOGIN_SUCCESS',
  LOGOUT: 'LOGOUT',
  SET_ERROR: 'SET_ERROR',
  CLEAR_ERROR: 'CLEAR_ERROR',
  UPDATE_USER: 'UPDATE_USER'
};

// Reducer
const authReducer = (state, action) => {
  switch (action.type) {
    case AUTH_ACTIONS.SET_LOADING:
      return {
        ...state,
        isLoading: action.payload
      };
    
    case AUTH_ACTIONS.LOGIN_SUCCESS:
      return {
        ...state,
        user: action.payload.user,
        token: action.payload.token,
        isAuthenticated: true,
        isLoading: false,
        error: null
      };
    
    case AUTH_ACTIONS.LOGOUT:
      return {
        ...state,
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: false,
        error: null
      };
    
    case AUTH_ACTIONS.SET_ERROR:
      return {
        ...state,
        error: action.payload,
        isLoading: false
      };
    
    case AUTH_ACTIONS.CLEAR_ERROR:
      return {
        ...state,
        error: null
      };
    
    case AUTH_ACTIONS.UPDATE_USER:
      return {
        ...state,
        user: { ...state.user, ...action.payload }
      };
    
    default:
      return state;
  }
};

// Create context
const AuthContext = createContext(null);

// Auth Provider component
export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Initialize auth state on mount
  useEffect(() => {
    const initializeAuth = async () => {
      const token = authUtils.getToken();
      const user = authUtils.getUserData();
      
      if (token && user) {
        // First set the user from storage
        dispatch({
          type: AUTH_ACTIONS.LOGIN_SUCCESS,
          payload: { token, user }
        });
        
        // Then fetch fresh user data to get updated 2FA status
        try {
          const response = await authUtils.fetchWithAuth('http://localhost:3001/auth/profile');
          const result = await response.json();
          
          if (result.success) {
            // Update user data with fresh info from server
            authUtils.setAuth(token, result.user, true); // Update storage
            dispatch({
              type: AUTH_ACTIONS.UPDATE_USER,
              payload: result.user
            });
          }
        } catch (error) {
          console.error('Error fetching fresh user data:', error);
          // Continue with cached user data if API call fails
        }
      } else {
        dispatch({ type: AUTH_ACTIONS.SET_LOADING, payload: false });
      }
    };

    initializeAuth();
  }, []);

  // Login function
  const login = async (email, password, rememberMe = false, twoFactorToken = null) => {
    try {
      dispatch({ type: AUTH_ACTIONS.SET_LOADING, payload: true });
      dispatch({ type: AUTH_ACTIONS.CLEAR_ERROR });

      // Use the users/login endpoint that properly handles 2FA
      const response = await fetch('http://localhost:3001/users/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          email, 
          password,
          ...(twoFactorToken && { twoFactorToken })
        })
      });

      const result = await response.json();

      if (result.success && !result.requiresTwoFactor) {
        // Login successful - now get JWT token
        const tokenResponse = await fetch('http://localhost:3001/auth/generate-token', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ userId: result.user.id })
        });

        let access_token = null;
        if (tokenResponse.ok) {
          const tokenResult = await tokenResponse.json();
          access_token = tokenResult.access_token;
        }

        // If token generation fails, still proceed with login (fallback)
        if (!access_token) {
          access_token = 'temp_token_' + Date.now(); // Temporary fallback
        }

        // Store auth data
        authUtils.setAuth(access_token, result.user, rememberMe);
        
        dispatch({
          type: AUTH_ACTIONS.LOGIN_SUCCESS,
          payload: {
            token: access_token,
            user: result.user
          }
        });

        return { success: true, user: result.user };
      } else if (result.requiresTwoFactor) {
        // Return 2FA requirement
        dispatch({ type: AUTH_ACTIONS.SET_LOADING, payload: false });
        return { 
          success: false, 
          requiresTwoFactor: true, 
          userId: result.userId,
          message: result.message 
        };
      } else {
        dispatch({
          type: AUTH_ACTIONS.SET_ERROR,
          payload: result.message || 'Login failed'
        });
        return { success: false, message: result.message };
      }
    } catch (error) {
      dispatch({
        type: AUTH_ACTIONS.SET_ERROR,
        payload: 'Network error. Please try again.'
      });
      return { success: false, message: 'Network error' };
    }
  };

  // Logout function
  const logout = async () => {
    try {
      // Call backend logout endpoint (optional)
      await authUtils.fetchWithAuth('http://localhost:3001/auth/logout', {
        method: 'POST'
      });
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // Clear local storage and state
      authUtils.clearAuth();
      dispatch({ type: AUTH_ACTIONS.LOGOUT });
    }
  };

  // Get user profile from backend
  const fetchProfile = async () => {
    try {
      const response = await authUtils.fetchWithAuth('http://localhost:3001/auth/profile');
      const result = await response.json();
      
      if (result.success) {
        // Update storage with fresh user data
        const token = authUtils.getToken();
        authUtils.setAuth(token, result.user, false); // Will preserve existing storage location
        
        dispatch({
          type: AUTH_ACTIONS.UPDATE_USER,
          payload: result.user
        });
        return result.user;
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
      // If profile fetch fails due to invalid token, logout
      if (error.message === 'Authentication expired') {
        logout();
      }
    }
  };

  // Clear error
  const clearError = () => {
    dispatch({ type: AUTH_ACTIONS.CLEAR_ERROR });
  };

  // Update user data (useful for 2FA completion)
  const updateUser = (userData) => {
    authUtils.setAuth(state.token, userData, true);
    dispatch({
      type: AUTH_ACTIONS.UPDATE_USER,
      payload: userData
    });
  };

  const value = {
    ...state,
    login,
    logout,
    fetchProfile,
    clearError,
    updateUser
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook to use auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
