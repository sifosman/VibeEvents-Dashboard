import React from "react";
import { Helmet } from "react-helmet";
import { useLocation } from "wouter";
import AuthForm from "@/components/auth/AuthForm";

export default function Register() {
  const [, setLocation] = useLocation();

  const handleRegister = async (data: any) => {
    try {
      console.log("Mock registration:", data);
      // Mock successful registration and redirect
      setLocation("/dashboard");
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
              Join thousands of event hosts planning their perfect occasions
            </p>
            <AuthForm 
              type="register" 
              onSubmit={handleRegister} 
              isLoading={false} 
            />
          </div>
        </div>
      </div>
    </>
  );
}
