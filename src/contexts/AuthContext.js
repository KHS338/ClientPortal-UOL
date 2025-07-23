"use client";

import { createContext, useContext, useReducer, useEffect } from 'react';
import { authUtils } from '@/lib/auth';
import { jwtDecode } from 'jwt-decode';

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

// Helper function to decode JWT and extract user data
const getUserFromToken = (token) => {
  if (!token) return null;
  
  try {
    const decoded = jwtDecode(token);
    return {
      id: decoded.sub,
      email: decoded.email,
      firstName: decoded.firstName,
      lastName: decoded.lastName
    };
  } catch (error) {
    console.error('Error decoding JWT:', error);
    return null;
  }
};

// Auth Provider component
export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Initialize auth state on mount
  useEffect(() => {
    const initializeAuth = async () => {
      const token = authUtils.getToken();
      
      if (token) {
        // Get user data from JWT token
        const user = getUserFromToken(token);
        
        if (user) {
          dispatch({
            type: AUTH_ACTIONS.LOGIN_SUCCESS,
            payload: { token, user }
          });
          
          // Optionally fetch additional user details from profile endpoint
          try {
            const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL;
            const response = await authUtils.fetchWithAuth(`${apiBaseUrl}/auth/profile`);
            const result = await response.json();
            
            if (result.success) {
              // Merge JWT user data with profile data
              const fullUser = { ...user, ...result.user };
              dispatch({
                type: AUTH_ACTIONS.UPDATE_USER,
                payload: fullUser
              });
            }
          } catch (error) {
            console.error('Error fetching profile:', error);
            // Continue with JWT user data if profile fetch fails
          }
        } else {
          // Invalid token, clear auth
          authUtils.clearAuth();
          dispatch({ type: AUTH_ACTIONS.SET_LOADING, payload: false });
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
      const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL;

      // First check credentials and 2FA with users/login
      const userLoginResponse = await fetch(`${apiBaseUrl}/users/login`, {
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

      const userResult = await userLoginResponse.json();

      if (userResult.success) {
        // Now get JWT token from auth/login
        const authResponse = await fetch(`${apiBaseUrl}/auth/login`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email, password })
        });

        const authResult = await authResponse.json();

        if (authResult.success && authResult.access_token) {
          // Get user data from JWT token
          const user = getUserFromToken(authResult.access_token);
          
          if (user) {
            // Store JWT token only
            authUtils.setAuth(authResult.access_token, user, rememberMe);
            
            dispatch({
              type: AUTH_ACTIONS.LOGIN_SUCCESS,
              payload: {
                token: authResult.access_token,
                user: user
              }
            });

            return { success: true, user: user };
          }
        }
      } else if (userResult.requiresTwoFactor) {
        // Return 2FA requirement
        dispatch({ type: AUTH_ACTIONS.SET_LOADING, payload: false });
        return { 
          success: false, 
          requiresTwoFactor: true, 
          userId: userResult.userId,
          message: userResult.message 
        };
      } else {
        dispatch({
          type: AUTH_ACTIONS.SET_ERROR,
          payload: userResult.message || 'Login failed'
        });
        return { success: false, message: userResult.message };
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
      const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL;
      await authUtils.fetchWithAuth(`${apiBaseUrl}/auth/logout`, {
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
      const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL;
      const response = await authUtils.fetchWithAuth(`${apiBaseUrl}/auth/profile`);
      const result = await response.json();
      
      if (result.success) {
        // Merge JWT user data with profile data
        const token = authUtils.getToken();
        const jwtUser = getUserFromToken(token);
        const fullUser = { ...jwtUser, ...result.user };
        
        dispatch({
          type: AUTH_ACTIONS.UPDATE_USER,
          payload: fullUser
        });
        return fullUser;
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
