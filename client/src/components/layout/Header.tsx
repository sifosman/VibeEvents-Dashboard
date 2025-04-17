import React, { useState } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Heart, Menu } from "lucide-react";

// Simple header that doesn't require auth
function SimpleHeader() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [location] = useLocation();

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "Browse Vendors", href: "/vendors" },
  ];

  return (
    <header className="bg-white shadow-sm">
      <div className="container-custom">
        <div className="flex justify-between items-center py-3">
          <div className="flex items-center">
            <Link href="/" className="flex items-center">
              <Heart className="text-primary mr-2" />
              <h1 className="text-primary font-display font-bold text-2xl">WeddingPro</h1>
            </Link>
          </div>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            {navLinks.map((link) => (
              <Link 
                key={link.name} 
                href={link.href}
                className={`transition hover:text-primary font-medium ${
                  location === link.href ? 'text-primary' : 'text-foreground'
                }`}
              >
                {link.name}
              </Link>
            ))}
          </nav>
          
          <div className="flex items-center space-x-4">
            <div className="hidden md:flex items-center space-x-4">
              <Link href="/login">
                <Button variant="outline" className="border-primary text-primary hover:bg-primary hover:text-white">
                  Log In
                </Button>
              </Link>
              <Link href="/register">
                <Button className="bg-primary text-white hover:bg-primary/90">
                  Sign Up
                </Button>
              </Link>
            </div>
            <Button 
              variant="ghost" 
              className="md:hidden text-primary"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Menu"
            >
              <Menu />
            </Button>
          </div>
        </div>
      </div>
      
      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white px-4 py-3 shadow-inner">
          <nav className="flex flex-col space-y-3">
            {navLinks.map((link) => (
              <Link 
                key={link.name} 
                href={link.href}
                className={`py-2 transition hover:text-primary font-medium ${
                  location === link.href ? 'text-primary' : 'text-foreground'
                }`}
                onClick={() => setMobileMenuOpen(false)}
              >
                {link.name}
              </Link>
            ))}
            <hr className="border-gray-200" />
            <div className="flex flex-col space-y-2 pt-2">
              <Link href="/login" onClick={() => setMobileMenuOpen(false)}>
                <Button variant="outline" className="w-full border-primary text-primary hover:bg-primary hover:text-white">
                  Log In
                </Button>
              </Link>
              <Link href="/register" onClick={() => setMobileMenuOpen(false)}>
                <Button className="w-full bg-primary text-white hover:bg-primary/90">
                  Sign Up
                </Button>
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}

export default function Header() {
  try {
    // We're using a dynamic import with require to avoid the React hook error on initial render
    const { useAuth } = require("@/context/AuthContext");
    
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [location] = useLocation();
    
    // If we get here, AuthContext is available
    const { user, isAuthenticated, logout } = useAuth();

    const navLinks = [
      { name: "Home", href: "/" },
      { name: "Browse Vendors", href: "/vendors" },
      { name: "My Planner", href: "/planner" },
      { name: "Help", href: "/help" },
    ];

    const toggleMobileMenu = () => {
      setMobileMenuOpen(!mobileMenuOpen);
    };

    return (
      <header className="bg-white shadow-sm">
        <div className="container-custom">
          <div className="flex justify-between items-center py-3">
            <div className="flex items-center">
              <Link href="/" className="flex items-center">
                <Heart className="text-primary mr-2" />
                <h1 className="text-primary font-display font-bold text-2xl">WeddingPro</h1>
              </Link>
            </div>
            
            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-6">
              {navLinks.map((link) => (
                <Link 
                  key={link.name} 
                  href={link.href}
                  className={`transition hover:text-primary font-medium ${
                    location === link.href ? 'text-primary' : 'text-foreground'
                  }`}
                >
                  {link.name}
                </Link>
              ))}
            </nav>
            
            <div className="flex items-center space-x-4">
              {isAuthenticated ? (
                <div className="hidden md:flex items-center space-x-4">
                  <span className="text-sm">Hi, {user?.fullName?.split(' ')[0] || user?.username}</span>
                  <Button variant="outline" className="border-primary text-primary hover:bg-primary hover:text-white" onClick={logout}>
                    Log Out
                  </Button>
                </div>
              ) : (
                <div className="hidden md:flex items-center space-x-4">
                  <Link href="/login">
                    <Button variant="outline" className="border-primary text-primary hover:bg-primary hover:text-white">
                      Log In
                    </Button>
                  </Link>
                  <Link href="/register">
                    <Button className="bg-primary text-white hover:bg-primary/90">
                      Sign Up
                    </Button>
                  </Link>
                </div>
              )}
              <Button 
                variant="ghost" 
                className="md:hidden text-primary"
                onClick={toggleMobileMenu}
                aria-label="Menu"
              >
                <Menu />
              </Button>
            </div>
          </div>
        </div>
        
        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-white px-4 py-3 shadow-inner">
            <nav className="flex flex-col space-y-3">
              {navLinks.map((link) => (
                <Link 
                  key={link.name} 
                  href={link.href}
                  className={`py-2 transition hover:text-primary font-medium ${
                    location === link.href ? 'text-primary' : 'text-foreground'
                  }`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {link.name}
                </Link>
              ))}
              <hr className="border-gray-200" />
              <div className="flex flex-col space-y-2 pt-2">
                {isAuthenticated ? (
                  <>
                    <div className="text-sm py-2">Hi, {user?.fullName?.split(' ')[0] || user?.username}</div>
                    <Button 
                      variant="outline" 
                      className="w-full border-primary text-primary hover:bg-primary hover:text-white"
                      onClick={() => {
                        logout();
                        setMobileMenuOpen(false);
                      }}
                    >
                      Log Out
                    </Button>
                  </>
                ) : (
                  <>
                    <Link href="/login" onClick={() => setMobileMenuOpen(false)}>
                      <Button variant="outline" className="w-full border-primary text-primary hover:bg-primary hover:text-white">
                        Log In
                      </Button>
                    </Link>
                    <Link href="/register" onClick={() => setMobileMenuOpen(false)}>
                      <Button className="w-full bg-primary text-white hover:bg-primary/90">
                        Sign Up
                      </Button>
                    </Link>
                  </>
                )}
              </div>
            </nav>
          </div>
        )}
      </header>
    );
  } catch (error) {
    // If Auth context is not available, render a simpler header
    return <SimpleHeader />;
  }
}
