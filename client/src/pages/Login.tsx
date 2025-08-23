import React from "react";
import { Helmet } from "react-helmet";
import { useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import AuthForm from "@/components/auth/AuthForm";

export default function Login() {
  const { user, isLoading, loginMutation } = useAuth();
  const [, setLocation] = useLocation();
  const isAuthenticated = !!user;

  // Redirect if already logged in
  React.useEffect(() => {
    if (isAuthenticated) {
      setLocation("/dashboard");
    }
  }, [isAuthenticated, setLocation]);

  const handleLogin = async (data: { username: string; password: string }) => {
    try {
      await loginMutation.mutateAsync(data);
      setLocation("/dashboard");
    } catch (error) {
      console.error("Login error:", error);
    }
  };

  return (
    <>
      <Helmet>
        <title>Login - HowzEvent</title>
        <meta name="description" content="Log in to your HowzEvent account to access your event planning tools." />
      </Helmet>
      
      <div className="bg-neutral min-h-[calc(100vh-64px)] flex items-center">
        <div className="container-custom py-10">
          <div className="max-w-md mx-auto">
            <h1 className="text-3xl font-display font-bold text-center mb-6">Welcome Back</h1>
            <AuthForm 
              type="login" 
              onSubmit={handleLogin} 
              isLoading={isLoading} 
            />
          </div>
        </div>
      </div>
    </>
  );
}
