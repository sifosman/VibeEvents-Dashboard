import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { User } from '@shared/schema';

// Type for session storage
interface StoredAuth {
  user: User;
  rememberMe: boolean;
  expiresAt: number; // Timestamp when session expires
}

/**
 * Enhanced authentication hook that persists login state
 * and supports "remember me" functionality
 */
export function usePersistedAuth() {
  const auth = useAuth();
  // Initialize autologin state
  const [autoLoginComplete, setAutoLoginComplete] = useState(false);
  // Add remember me state
  const [rememberMe, setRememberMe] = useState(false);
  
  // Initialize from stored auth on component mount
  useEffect(() => {
    const attemptAutoLogin = async () => {
      // First check localStorage (long-lived auth)
      const storedAuthStr = localStorage.getItem('auth');
      
      // If not in localStorage, check sessionStorage (session-only auth)
      const sessionAuthStr = !storedAuthStr 
        ? sessionStorage.getItem('auth') 
        : null;
      
      const authStr = storedAuthStr || sessionAuthStr;
      
      if (authStr) {
        try {
          const storedAuth: StoredAuth = JSON.parse(authStr);
          
          // Check if stored auth is expired
          if (storedAuth.expiresAt && storedAuth.expiresAt < Date.now()) {
            // Clear expired auth
            if (storedAuthStr) localStorage.removeItem('auth');
            if (sessionAuthStr) sessionStorage.removeItem('auth');
            setAutoLoginComplete(true);
            return;
          }
          
          // Set remember me state from stored value
          setRememberMe(storedAuth.rememberMe);
          
          // If we have a stored user but no current user, attempt silent login
          if (storedAuth.user && !auth.user) {
            // Fetch current user to validate session
            try {
              // Silent revalidation from server
              await auth.revalidateSession();
            } catch (error) {
              // If revalidation fails, clear stored auth
              if (storedAuthStr) localStorage.removeItem('auth');
              if (sessionAuthStr) sessionStorage.removeItem('auth');
              console.log("Stored session expired or invalid");
            }
          }
        } catch (error) {
          console.error("Error parsing stored auth:", error);
        }
      }
      
      setAutoLoginComplete(true);
    };
    
    attemptAutoLogin();
  }, []);
  
  // Update stored auth when auth changes
  useEffect(() => {
    if (!autoLoginComplete) return;
    
    if (auth.user) {
      const authData: StoredAuth = {
        user: auth.user,
        rememberMe,
        // Set expiration - 30 days for remember me, 2 hours for session
        expiresAt: Date.now() + (rememberMe ? 30 * 24 * 60 * 60 * 1000 : 2 * 60 * 60 * 1000),
      };
      
      // Store in appropriate storage based on remember me setting
      if (rememberMe) {
        localStorage.setItem('auth', JSON.stringify(authData));
        sessionStorage.removeItem('auth');
      } else {
        sessionStorage.setItem('auth', JSON.stringify(authData));
        localStorage.removeItem('auth');
      }
    } else {
      // Clear stored auth on logout
      localStorage.removeItem('auth');
      sessionStorage.removeItem('auth');
    }
  }, [auth.user, rememberMe, autoLoginComplete]);
  
  // Enhanced login function that accepts rememberMe flag
  const login = async (credentials: { username: string; password: string; rememberMe: boolean }) => {
    // Update rememberMe state before login
    setRememberMe(credentials.rememberMe);
    
    // Call the original login method
    return auth.loginMutation.mutateAsync({
      username: credentials.username,
      password: credentials.password,
    });
  };
  
  // Override logout to also clear stored auth
  const logout = async () => {
    // Clear stored auth
    localStorage.removeItem('auth');
    sessionStorage.removeItem('auth');
    
    // Call original logout
    return auth.logoutMutation.mutateAsync();
  };
  
  return {
    ...auth,
    login,
    logout,
    rememberMe,
    setRememberMe,
    isLoading: auth.isLoading || !autoLoginComplete,
    loginMutation: {
      ...auth.loginMutation,
      mutateAsync: login,
    },
    logoutMutation: {
      ...auth.logoutMutation,
      mutateAsync: logout,
    },
  };
}