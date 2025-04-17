import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { User } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (username: string, password: string) => Promise<void>;
  register: (userData: any) => Promise<void>;
  logout: () => void;
  revalidateSession: () => Promise<User>;
  loginMutation: {
    mutateAsync: (credentials: { username: string; password: string }) => Promise<User>;
    isPending: boolean;
    isError: boolean;
    error: Error | null;
  };
  logoutMutation: {
    mutateAsync: () => Promise<void>;
    isPending: boolean;
  };
  registerMutation: {
    mutateAsync: (userData: any) => Promise<User>;
    isPending: boolean;
    isError: boolean;
    error: Error | null;
  };
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [loginPending, setLoginPending] = useState(false);
  const [logoutPending, setLogoutPending] = useState(false);
  const [registerPending, setRegisterPending] = useState(false);
  const [loginError, setLoginError] = useState<Error | null>(null);
  const [registerError, setRegisterError] = useState<Error | null>(null);
  const { toast } = useToast();

  // Check for existing session on load
  useEffect(() => {
    const checkSession = async () => {
      try {
        await revalidateSession();
      } catch (error) {
        // Session not valid, that's okay
      } finally {
        setIsLoading(false);
      }
    };
    
    checkSession();
  }, []);

  // Revalidate the user's session with the server
  const revalidateSession = async (): Promise<User> => {
    try {
      const response = await fetch("/api/user", {
        method: "GET",
        credentials: "include",
      });

      if (!response.ok) {
        setUser(null);
        throw new Error("Session expired");
      }

      const userData = await response.json();
      setUser(userData);
      return userData;
    } catch (error) {
      setUser(null);
      throw error;
    }
  };

  // Login functionality
  const login = async (username: string, password: string) => {
    setLoginPending(true);
    setLoginError(null);
    
    try {
      const response = await fetch("/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
        credentials: "include",
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Login failed");
      }

      const userData = await response.json();
      setUser(userData);
      
      toast({
        title: "Welcome back!",
        description: `Logged in as ${userData.fullName || userData.username}`,
      });
      
      return userData;
    } catch (error) {
      if (error instanceof Error) {
        setLoginError(error);
        toast({
          title: "Login failed",
          description: error.message,
          variant: "destructive",
        });
      }
      throw error;
    } finally {
      setLoginPending(false);
    }
  };

  // Register functionality
  const register = async (userData: any) => {
    setRegisterPending(true);
    setRegisterError(null);
    
    try {
      const response = await fetch("/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
        credentials: "include",
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Registration failed");
      }

      const newUser = await response.json();
      setUser(newUser);
      
      toast({
        title: "Registration successful",
        description: "Your account has been created",
      });
      
      return newUser;
    } catch (error) {
      if (error instanceof Error) {
        setRegisterError(error);
        toast({
          title: "Registration failed",
          description: error.message,
          variant: "destructive",
        });
      }
      throw error;
    } finally {
      setRegisterPending(false);
    }
  };

  // Logout functionality
  const logout = async () => {
    setLogoutPending(true);
    
    try {
      await fetch("/api/logout", {
        method: "POST",
        credentials: "include",
      });
      
      setUser(null);
      
      // Clear any cached user data
      queryClient.clear();
      
      toast({
        title: "Logged out",
        description: "You have been successfully logged out",
      });
    } catch (error) {
      console.error("Logout error:", error);
      // Still clear user even if server logout fails
      setUser(null);
    } finally {
      setLogoutPending(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        register,
        logout,
        revalidateSession,
        loginMutation: {
          mutateAsync: login,
          isPending: loginPending,
          isError: !!loginError,
          error: loginError,
        },
        logoutMutation: {
          mutateAsync: logout,
          isPending: logoutPending,
        },
        registerMutation: {
          mutateAsync: register,
          isPending: registerPending,
          isError: !!registerError,
          error: registerError,
        }
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
