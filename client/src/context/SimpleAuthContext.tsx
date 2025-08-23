import React, { createContext, useContext, useState, ReactNode } from "react";

interface SimpleAuthContextType {
  user: any | null;
  isLoading: boolean;
  registerMutation: {
    mutateAsync: (data: any) => Promise<any>;
  };
  loginMutation: {
    mutateAsync: (data: any) => Promise<any>;
  };
}

const SimpleAuthContext = createContext<SimpleAuthContextType | undefined>(undefined);

export function SimpleAuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const registerMutation = {
    mutateAsync: async (data: any) => {
      setIsLoading(true);
      try {
        // Mock registration - replace with actual API call
        console.log("Registering user:", data);
        const newUser = { id: 1, username: data.username, email: data.email };
        setUser(newUser);
        return newUser;
      } finally {
        setIsLoading(false);
      }
    }
  };

  const loginMutation = {
    mutateAsync: async (data: any) => {
      setIsLoading(true);
      try {
        // Mock login - replace with actual API call
        console.log("Logging in user:", data);
        const loggedInUser = { id: 1, username: data.username };
        setUser(loggedInUser);
        return loggedInUser;
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <SimpleAuthContext.Provider value={{
      user,
      isLoading,
      registerMutation,
      loginMutation
    }}>
      {children}
    </SimpleAuthContext.Provider>
  );
}

export function useSimpleAuth() {
  const context = useContext(SimpleAuthContext);
  if (context === undefined) {
    throw new Error("useSimpleAuth must be used within a SimpleAuthProvider");
  }
  return context;
}