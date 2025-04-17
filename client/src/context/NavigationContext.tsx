import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useLocation } from 'wouter';

interface NavHistoryEntry {
  path: string;
  title: string;
  timestamp: number;
}

interface NavigationContextType {
  history: NavHistoryEntry[];
  currentPath: string;
  goBack: () => void;
  goForward: () => void;
  canGoBack: boolean;
  canGoForward: boolean;
  addToHistory: (path: string, title: string) => void;
  clearHistory: () => void;
}

const NavigationContext = createContext<NavigationContextType | undefined>(undefined);

const MAX_HISTORY_LENGTH = 50; // Maximum number of history items to store

/**
 * Navigation history provider that tracks user's page visits
 * and provides functionality for back/forward navigation
 */
export const NavigationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [history, setHistory] = useState<NavHistoryEntry[]>(() => {
    // Load history from sessionStorage on init
    const saved = sessionStorage.getItem('navigation_history');
    return saved ? JSON.parse(saved) : [];
  });
  
  const [currentIndex, setCurrentIndex] = useState<number>(() => {
    const saved = sessionStorage.getItem('navigation_index');
    return saved ? parseInt(saved, 10) : -1;
  });
  
  const [location, setLocation] = useLocation();
  
  // Save history to sessionStorage when it changes
  useEffect(() => {
    sessionStorage.setItem('navigation_history', JSON.stringify(history));
    sessionStorage.setItem('navigation_index', currentIndex.toString());
  }, [history, currentIndex]);
  
  // Get current page title
  const getPageTitle = () => {
    // Try to get title from document, or use URL path as fallback
    return document.title || location.split('/').pop() || 'Page';
  };
  
  // Add current path to history on location change
  useEffect(() => {
    // Skip the initial render
    if (history.length === 0 || history[history.length - 1]?.path !== location) {
      addToHistory(location, getPageTitle());
    }
  }, [location]);
  
  // Add a new entry to navigation history
  const addToHistory = (path: string, title: string) => {
    // If we're not at the end of history (user has gone back), truncate forward history
    const newHistory = history.slice(0, currentIndex + 1);
    
    // Add new entry
    const newEntry: NavHistoryEntry = {
      path,
      title,
      timestamp: Date.now(),
    };
    
    // Create new history array with length limit
    const updatedHistory = [...newHistory, newEntry].slice(-MAX_HISTORY_LENGTH);
    
    setHistory(updatedHistory);
    setCurrentIndex(updatedHistory.length - 1);
  };
  
  // Go back in history
  const goBack = () => {
    if (currentIndex > 0) {
      const newIndex = currentIndex - 1;
      setCurrentIndex(newIndex);
      setLocation(history[newIndex].path);
    }
  };
  
  // Go forward in history
  const goForward = () => {
    if (currentIndex < history.length - 1) {
      const newIndex = currentIndex + 1;
      setCurrentIndex(newIndex);
      setLocation(history[newIndex].path);
    }
  };
  
  // Clear history
  const clearHistory = () => {
    setHistory([]);
    setCurrentIndex(-1);
    sessionStorage.removeItem('navigation_history');
    sessionStorage.removeItem('navigation_index');
  };
  
  // Determine if we can go back or forward
  const canGoBack = currentIndex > 0;
  const canGoForward = currentIndex < history.length - 1;
  
  const currentPath = location;
  
  return (
    <NavigationContext.Provider
      value={{
        history,
        currentPath,
        goBack,
        goForward,
        canGoBack,
        canGoForward,
        addToHistory,
        clearHistory,
      }}
    >
      {children}
    </NavigationContext.Provider>
  );
};

// Custom hook to use navigation history
export const useNavigation = () => {
  const context = useContext(NavigationContext);
  if (!context) {
    throw new Error('useNavigation must be used within NavigationProvider');
  }
  return context;
};

// Hook specifically for back button functionality
export const useBackButton = (customGoBackAction?: () => void) => {
  const { goBack, canGoBack } = useNavigation();
  
  const handleGoBack = () => {
    if (customGoBackAction) {
      customGoBackAction();
    } else if (canGoBack) {
      goBack();
    } else {
      // Fallback to browser history if no custom action and no internal history
      window.history.back();
    }
  };
  
  return { handleGoBack, canGoBack };
};