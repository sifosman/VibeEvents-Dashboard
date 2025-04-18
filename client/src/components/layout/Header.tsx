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
  Filter
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

// Simple header that doesn't require auth
function SimpleHeader() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
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

  // Footer navigation links moved to header dropdown
  const eventHostsLinks = [
    { name: "How It Works", href: "#", icon: <Info className="h-4 w-4 mr-2" /> },
    { name: "Browse Vendors", href: "/vendors", icon: <Building className="h-4 w-4 mr-2" /> },
    { name: "Event Planner Tools", href: "/planner", icon: <Sparkles className="h-4 w-4 mr-2" /> },
    { name: "Event Inspiration", href: "#", icon: <Globe className="h-4 w-4 mr-2" /> },
    { name: "Success Stories", href: "#", icon: <Users className="h-4 w-4 mr-2" /> },
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
    { name: "Terms of Service", href: "#", icon: <Info className="h-4 w-4 mr-2" /> },
    { name: "Privacy Policy", href: "#", icon: <Info className="h-4 w-4 mr-2" /> },
    { name: "About Us", href: "#", icon: <Users className="h-4 w-4 mr-2" /> },
  ];

  return (
    <header className="bg-white shadow-sm">
      <div className="container-custom">
        <div className="flex justify-between items-center py-3">
          <div className="flex items-center">
            {/* Top-left dropdown navigation menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="text-primary flex items-center mr-2 p-1">
                  <Menu className="h-5 w-5 mr-1" />
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-64">
                <DropdownMenuLabel>Site Navigation</DropdownMenuLabel>
                <DropdownMenuSeparator />
                
                {/* Main Navigation */}
                <DropdownMenuGroup>
                  {navLinks.map((link) => (
                    <Link key={link.name} href={link.href}>
                      <DropdownMenuItem className="cursor-pointer">
                        {link.name}
                      </DropdownMenuItem>
                    </Link>
                  ))}
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                
                {/* For Event Hosts Section */}
                <DropdownMenuSub>
                  <DropdownMenuSubTrigger>
                    <Users className="h-4 w-4 mr-2" />
                    <span>For Event Hosts</span>
                  </DropdownMenuSubTrigger>
                  <DropdownMenuPortal>
                    <DropdownMenuSubContent>
                      {eventHostsLinks.map((link) => (
                        <Link key={link.name} href={link.href}>
                          <DropdownMenuItem className="cursor-pointer">
                            {link.icon}
                            {link.name}
                          </DropdownMenuItem>
                        </Link>
                      ))}
                    </DropdownMenuSubContent>
                  </DropdownMenuPortal>
                </DropdownMenuSub>
                
                {/* For Vendors Section */}
                <DropdownMenuSub>
                  <DropdownMenuSubTrigger>
                    <Building className="h-4 w-4 mr-2" />
                    <span>For Vendors</span>
                  </DropdownMenuSubTrigger>
                  <DropdownMenuPortal>
                    <DropdownMenuSubContent>
                      {vendorLinks.map((link) => (
                        <Link key={link.name} href={link.href}>
                          <DropdownMenuItem className="cursor-pointer">
                            {link.icon}
                            {link.name}
                          </DropdownMenuItem>
                        </Link>
                      ))}
                    </DropdownMenuSubContent>
                  </DropdownMenuPortal>
                </DropdownMenuSub>
                
                {/* Support Section */}
                <DropdownMenuSub>
                  <DropdownMenuSubTrigger>
                    <HelpCircle className="h-4 w-4 mr-2" />
                    <span>Support</span>
                  </DropdownMenuSubTrigger>
                  <DropdownMenuPortal>
                    <DropdownMenuSubContent>
                      {supportLinks.map((link) => (
                        <Link key={link.name} href={link.href}>
                          <DropdownMenuItem className="cursor-pointer">
                            {link.icon}
                            {link.name}
                          </DropdownMenuItem>
                        </Link>
                      ))}
                    </DropdownMenuSubContent>
                  </DropdownMenuPortal>
                </DropdownMenuSub>
              </DropdownMenuContent>
            </DropdownMenu>
            
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
      
      {/* Mobile Menu with expanded navigation */}
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
            
            {/* Event Type Selector for mobile */}
            <div className="py-2">
              <h4 className="font-display font-bold text-md mb-2">Event Type</h4>
              <div className="pl-2 mb-4">
                <EventTypeSelector 
                  value={selectedEventType}
                  onChange={setSelectedEventType}
                  className="w-full"
                />
              </div>
            </div>
            
            {/* Mobile dropdown sections */}
            <div className="py-2">
              <h4 className="font-display font-bold text-md mb-2">For Event Hosts</h4>
              <div className="pl-2 flex flex-col space-y-2">
                {eventHostsLinks.map((link) => (
                  <Link 
                    key={link.name} 
                    href={link.href}
                    className="text-muted-foreground hover:text-primary transition flex items-center"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {link.icon}
                    {link.name}
                  </Link>
                ))}
              </div>
            </div>
            
            <div className="py-2">
              <h4 className="font-display font-bold text-md mb-2">For Vendors</h4>
              <div className="pl-2 flex flex-col space-y-2">
                {vendorLinks.map((link) => (
                  <Link 
                    key={link.name} 
                    href={link.href}
                    className="text-muted-foreground hover:text-primary transition flex items-center"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {link.icon}
                    {link.name}
                  </Link>
                ))}
              </div>
            </div>
            
            <div className="py-2">
              <h4 className="font-display font-bold text-md mb-2">Support</h4>
              <div className="pl-2 flex flex-col space-y-2">
                {supportLinks.map((link) => (
                  <Link 
                    key={link.name} 
                    href={link.href}
                    className="text-muted-foreground hover:text-primary transition flex items-center"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {link.icon}
                    {link.name}
                  </Link>
                ))}
              </div>
            </div>
            
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
    const { user, isAuthenticated, logout } = useAuth();

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

    const toggleMobileMenu = () => {
      setMobileMenuOpen(!mobileMenuOpen);
    };

    return (
      <header className="bg-white shadow-sm">
        <div className="container-custom">
          <div className="flex justify-between items-center py-3">
            <div className="flex items-center">
              {/* Top-left dropdown navigation menu */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="text-primary flex items-center mr-2 p-1">
                    <Menu className="h-5 w-5 mr-1" />
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="w-64">
                  <DropdownMenuLabel>Site Navigation</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  
                  {/* Main Navigation */}
                  <DropdownMenuGroup>
                    {navLinks.map((link) => (
                      <Link key={link.name} href={link.href}>
                        <DropdownMenuItem className="cursor-pointer">
                          {link.name}
                        </DropdownMenuItem>
                      </Link>
                    ))}
                  </DropdownMenuGroup>
                  <DropdownMenuSeparator />
                  
                  {/* For Event Hosts Section */}
                  <DropdownMenuSub>
                    <DropdownMenuSubTrigger>
                      <Users className="h-4 w-4 mr-2" />
                      <span>For Event Hosts</span>
                    </DropdownMenuSubTrigger>
                    <DropdownMenuPortal>
                      <DropdownMenuSubContent>
                        {eventHostsLinks.map((link) => (
                          <Link key={link.name} href={link.href}>
                            <DropdownMenuItem className="cursor-pointer">
                              {link.icon}
                              {link.name}
                            </DropdownMenuItem>
                          </Link>
                        ))}
                      </DropdownMenuSubContent>
                    </DropdownMenuPortal>
                  </DropdownMenuSub>
                  
                  {/* For Vendors Section */}
                  <DropdownMenuSub>
                    <DropdownMenuSubTrigger>
                      <Building className="h-4 w-4 mr-2" />
                      <span>For Vendors</span>
                    </DropdownMenuSubTrigger>
                    <DropdownMenuPortal>
                      <DropdownMenuSubContent>
                        {vendorLinks.map((link) => (
                          <Link key={link.name} href={link.href}>
                            <DropdownMenuItem className="cursor-pointer">
                              {link.icon}
                              {link.name}
                            </DropdownMenuItem>
                          </Link>
                        ))}
                      </DropdownMenuSubContent>
                    </DropdownMenuPortal>
                  </DropdownMenuSub>
                  
                  {/* Support Section */}
                  <DropdownMenuSub>
                    <DropdownMenuSubTrigger>
                      <HelpCircle className="h-4 w-4 mr-2" />
                      <span>Support</span>
                    </DropdownMenuSubTrigger>
                    <DropdownMenuPortal>
                      <DropdownMenuSubContent>
                        {supportLinks.map((link) => (
                          <Link key={link.name} href={link.href}>
                            <DropdownMenuItem className="cursor-pointer">
                              {link.icon}
                              {link.name}
                            </DropdownMenuItem>
                          </Link>
                        ))}
                      </DropdownMenuSubContent>
                    </DropdownMenuPortal>
                  </DropdownMenuSub>
                </DropdownMenuContent>
              </DropdownMenu>
              
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
        
        {/* Mobile Menu with expanded navigation */}
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
              
              {/* Event Type Selector for mobile */}
              <div className="py-2">
                <h4 className="font-display font-bold text-md mb-2">Event Type</h4>
                <div className="pl-2 mb-4">
                  <EventTypeSelector 
                    value={selectedEventType}
                    onChange={setSelectedEventType}
                    className="w-full"
                  />
                </div>
              </div>
              
              {/* Mobile dropdown sections */}
              <div className="py-2">
                <h4 className="font-display font-bold text-md mb-2">For Event Hosts</h4>
                <div className="pl-2 flex flex-col space-y-2">
                  {eventHostsLinks.map((link) => (
                    <Link 
                      key={link.name} 
                      href={link.href}
                      className="text-muted-foreground hover:text-primary transition flex items-center"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      {link.icon}
                      {link.name}
                    </Link>
                  ))}
                </div>
              </div>
              
              <div className="py-2">
                <h4 className="font-display font-bold text-md mb-2">For Vendors</h4>
                <div className="pl-2 flex flex-col space-y-2">
                  {vendorLinks.map((link) => (
                    <Link 
                      key={link.name} 
                      href={link.href}
                      className="text-muted-foreground hover:text-primary transition flex items-center"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      {link.icon}
                      {link.name}
                    </Link>
                  ))}
                </div>
              </div>
              
              <div className="py-2">
                <h4 className="font-display font-bold text-md mb-2">Support</h4>
                <div className="pl-2 flex flex-col space-y-2">
                  {supportLinks.map((link) => (
                    <Link 
                      key={link.name} 
                      href={link.href}
                      className="text-muted-foreground hover:text-primary transition flex items-center"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      {link.icon}
                      {link.name}
                    </Link>
                  ))}
                </div>
              </div>
              
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
