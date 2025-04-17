import React from "react";
import { Helmet } from "react-helmet";
import { useLocation } from "wouter";
import { useAuth } from "@/context/AuthContext";
import AuthForm from "@/components/auth/AuthForm";

export default function Register() {
  const { register, isLoading, isAuthenticated } = useAuth();
  const [, setLocation] = useLocation();

  // Redirect if already logged in
  React.useEffect(() => {
    if (isAuthenticated) {
      setLocation("/planner");
    }
  }, [isAuthenticated, setLocation]);

  const handleRegister = async (data: any) => {
    try {
      // Remove the confirmPassword field before sending to API
      const { confirmPassword, ...userData } = data;
      await register(userData);
      setLocation("/planner");
    } catch (error) {
      console.error("Registration error:", error);
    }
  };

  return (
    <>
      <Helmet>
        <title>Create Account - HowzEvent</title>
        <meta name="description" content="Create a HowzEvent account to start planning your perfect event." />
      </Helmet>
      
      <div className="bg-neutral min-h-[calc(100vh-64px)] flex items-center">
        <div className="container-custom py-10">
          <div className="max-w-md mx-auto">
            <h1 className="text-3xl font-display font-bold text-center mb-6">Create Your Account</h1>
            <p className="text-center text-muted-foreground mb-8">
              Join thousands of couples planning their perfect day
            </p>
            <AuthForm 
              type="register" 
              onSubmit={handleRegister} 
              isLoading={isLoading} 
            />
          </div>
        </div>
      </div>
    </>
  );
}
