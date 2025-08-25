import React, { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { 
  Heart, 
  Menu, 
  ChevronDown, 
  Globe, 
  Users, 
  Building, 
  Sparkles, 
  HelpCircle, 
  Info, 
  MessageCircle,
  Filter,
  User
} from "lucide-react";
import SouthAfricanBadge from "../shared/SouthAfricanBadge";
import { EventTypeSelector } from "@/components/ui/event-type-selector";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuGroup,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuPortal
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/context/AuthContext";

// Simple header that doesn't require auth
function SimpleHeader() {
  const [location] = useLocation();
  const [selectedEventType, setSelectedEventType] = useState<string>("");
  
  // Handle event type changes
  useEffect(() => {
    if (selectedEventType) {
      // Store the selected event type in session storage
      sessionStorage.setItem('selectedEventType', selectedEventType);
      
      // If on vendors page, append query parameter
      if (location.startsWith('/vendors')) {
        const url = new URL(window.location.href);
        url.searchParams.set('eventType', selectedEventType);
        window.history.replaceState({}, '', url.toString());
      }
    } else {
      // Remove from session storage if no selection
      sessionStorage.removeItem('selectedEventType');
      
      // Remove from URL if on vendors page
      if (location.startsWith('/vendors')) {
        const url = new URL(window.location.href);
        url.searchParams.delete('eventType');
        window.history.replaceState({}, '', url.toString());
      }
    }
  }, [selectedEventType, location]);
  
  // Load saved event type on mount
  useEffect(() => {
    const savedEventType = sessionStorage.getItem('selectedEventType');
    if (savedEventType) {
      setSelectedEventType(savedEventType);
    } else if (location.startsWith('/vendors')) {
      // Check URL for event type parameter
      const url = new URL(window.location.href);
      const eventTypeParam = url.searchParams.get('eventType');
      if (eventTypeParam) {
        setSelectedEventType(eventTypeParam);
      }
    }
  }, []);

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "Browse Vendors", href: "/vendors" },
  ];
  
  // Service provider links
  const serviceProviderLinks = [
    { name: "List Your Services", href: "#", icon: <Building className="h-4 w-4 mr-2" /> },
    { name: "Service Provider Benefits", href: "#", icon: <Sparkles className="h-4 w-4 mr-2" /> },
    { name: "Provider Dashboard", href: "#", icon: <Globe className="h-4 w-4 mr-2" /> },
    { name: "Marketing Tips", href: "#", icon: <Users className="h-4 w-4 mr-2" /> },
    { name: "Advertising Packages", href: "#", icon: <MessageCircle className="h-4 w-4 mr-2" /> },
  ];

  // Footer navigation links moved to header dropdown
  const eventHostsLinks = [
    { name: "How It Works", href: "#", icon: <Info className="h-4 w-4 mr-2" /> },
    { name: "Browse Vendors", href: "/vendors", icon: <Building className="h-4 w-4 mr-2" /> },
    { name: "Service Categories", href: "/ServiceCategories", icon: <Filter className="h-4 w-4 mr-2" /> },
    { name: "Browse by Category", href: "/BrowseByCategory", icon: <Building className="h-4 w-4 mr-2" /> },
    { name: "Event Planner Tools", href: "/planner", icon: <Sparkles className="h-4 w-4 mr-2" /> },
    { name: "Event Inspiration", href: "#", icon: <Globe className="h-4 w-4 mr-2" /> },
    { name: "Success Stories", href: "#", icon: <Users className="h-4 w-4 mr-2" /> },
  ];

  const supportLinks = [
    { name: "Contact Us", href: "#", icon: <MessageCircle className="h-4 w-4 mr-2" /> },
    { name: "FAQs", href: "#", icon: <HelpCircle className="h-4 w-4 mr-2" /> },
    { name: "Terms of Service", href: "#", icon: <Info className="h-4 w-4 mr-2" /> },
    { name: "Privacy Policy", href: "#", icon: <Info className="h-4 w-4 mr-2" /> },
    { name: "About Us", href: "#", icon: <Users className="h-4 w-4 mr-2" /> },
  ];

  return (
    <header className="bg-white shadow-sm">
      <div className="container-custom">
        <div className="flex justify-between items-center py-3">
          <div className="flex items-center ml-4">
            
            <Link href="/" className="flex items-center">
              <Heart className="text-primary mr-2" />
              <h1 className="text-primary font-display font-bold text-2xl">HowzEvent</h1>
            </Link>
            <SouthAfricanBadge className="ml-2" />
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
            
            {/* Service Providers Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center transition hover:text-primary font-medium">
                  For Service Providers <ChevronDown className="ml-1 h-4 w-4" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                {serviceProviderLinks.map((link) => (
                  <Link key={link.name} href={link.href}>
                    <DropdownMenuItem className="cursor-pointer">
                      {link.icon}
                      {link.name}
                    </DropdownMenuItem>
                  </Link>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
            
            {/* Event Type Selector */}
            <div className="flex items-center">
              <EventTypeSelector 
                value={selectedEventType}
                onChange={setSelectedEventType}
                className="w-[180px] border-none shadow-sm"
                buttonVariant="ghost"
              />
            </div>
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
          </div>
        </div>
      </div>
    </header>
  );
}

export default function Header() {
  try {
    // We're using the auth context hook
    const { user, isAuthenticated, logout } = useAuth();
    
    const [location] = useLocation();
    const [selectedEventType, setSelectedEventType] = useState<string>("");
    
    // Handle event type changes
    useEffect(() => {
      if (selectedEventType) {
        // Store the selected event type in session storage
        sessionStorage.setItem('selectedEventType', selectedEventType);
        
        // If on vendors page, append query parameter
        if (location.startsWith('/vendors')) {
          const url = new URL(window.location.href);
          url.searchParams.set('eventType', selectedEventType);
          window.history.replaceState({}, '', url.toString());
        }
      } else {
        // Remove from session storage if no selection
        sessionStorage.removeItem('selectedEventType');
        
        // Remove from URL if on vendors page
        if (location.startsWith('/vendors')) {
          const url = new URL(window.location.href);
          url.searchParams.delete('eventType');
          window.history.replaceState({}, '', url.toString());
        }
      }
    }, [selectedEventType, location]);
    
    // Load saved event type on mount
    useEffect(() => {
      const savedEventType = sessionStorage.getItem('selectedEventType');
      if (savedEventType) {
        setSelectedEventType(savedEventType);
      } else if (location.startsWith('/vendors')) {
        // Check URL for event type parameter
        const url = new URL(window.location.href);
        const eventTypeParam = url.searchParams.get('eventType');
        if (eventTypeParam) {
          setSelectedEventType(eventTypeParam);
        }
      }
    }, []);
    
    // If we get here, AuthContext is available

    const navLinks = [
      { name: "Home", href: "/" },
      { name: "Browse Vendors", href: "/vendors" },
      { name: "My Planner", href: "/planner" },
      { name: "Gift Registry", href: "/gift-registry" },
      { name: "Help", href: "/help" },
    ];
    
    // Footer navigation links moved to header dropdown
    const eventHostsLinks = [
      { name: "How It Works", href: "#", icon: <Info className="h-4 w-4 mr-2" /> },
      { name: "Browse Vendors", href: "/vendors", icon: <Building className="h-4 w-4 mr-2" /> },
      { name: "Event Planner Tools", href: "/planner", icon: <Sparkles className="h-4 w-4 mr-2" /> },
      { name: "Event Inspiration", href: "#", icon: <Globe className="h-4 w-4 mr-2" /> },
      { name: "Success Stories", href: "#", icon: <Users className="h-4 w-4 mr-2" /> },
      { name: "Vendor Tracking", href: "/vendor-tracking", icon: <Building className="h-4 w-4 mr-2" /> },
    ];

    const vendorLinks = [
      { name: "Join as Vendor", href: "#", icon: <Building className="h-4 w-4 mr-2" /> },
      { name: "Vendor Benefits", href: "#", icon: <Sparkles className="h-4 w-4 mr-2" /> },
      { name: "Vendor Dashboard", href: "#", icon: <Globe className="h-4 w-4 mr-2" /> },
      { name: "Success Stories", href: "#", icon: <Users className="h-4 w-4 mr-2" /> },
      { name: "Advertising Options", href: "#", icon: <MessageCircle className="h-4 w-4 mr-2" /> },
    ];

    const supportLinks = [
      { name: "Contact Us", href: "#", icon: <MessageCircle className="h-4 w-4 mr-2" /> },
      { name: "FAQs", href: "#", icon: <HelpCircle className="h-4 w-4 mr-2" /> },
      { name: "Terms of Service", href: "/terms", icon: <Info className="h-4 w-4 mr-2" /> },
      { name: "Privacy Policy", href: "#", icon: <Info className="h-4 w-4 mr-2" /> },
      { name: "About Us", href: "#", icon: <Users className="h-4 w-4 mr-2" /> },
    ];


    return (
      <header className="bg-white shadow-sm">
        <div className="container-custom">
          <div className="flex justify-between items-center py-3">
            <div className="flex items-center">
              <Link href="/" className="flex items-center">
                <Heart className="text-primary mr-2" />
                <h1 className="text-primary font-display font-bold text-2xl">HowzEvent</h1>
              </Link>
              <SouthAfricanBadge className="ml-2" />
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
              
              {/* Event Type Selector */}
              <div className="flex items-center">
                <EventTypeSelector 
                  value={selectedEventType}
                  onChange={setSelectedEventType}
                  className="w-[180px] border-none shadow-sm"
                  buttonVariant="ghost"
                />
              </div>
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
            </div>
          </div>
        </div>
        
      </header>
    );
  } catch (error) {
    // If Auth context is not available, render a simpler header
    return <SimpleHeader />;
  }
}
