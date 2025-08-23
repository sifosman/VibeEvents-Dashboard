import React from "react";
import { Helmet } from "react-helmet";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
// import { useAuth } from "@/hooks/use-auth";
import { 
  Search, 
  MapPin, 
  Users, 
  Calendar, 
  Heart, 
  User,
  Building2,
  Sparkles,
  ArrowRight
} from "lucide-react";

export default function UserDashboard() {
  // const { user } = useAuth();

  const navigationOptions = [
    {
      title: "Search Vendors",
      description: "Find the perfect vendors for your event",
      icon: <Users className="h-8 w-8 text-blue-600" />,
      href: "/vendors",
      color: "border-blue-200 hover:border-blue-300 hover:bg-blue-50"
    },
    {
      title: "Search Venues",
      description: "Discover amazing venues for any occasion",
      icon: <Building2 className="h-8 w-8 text-green-600" />,
      href: "/venues",
      color: "border-green-200 hover:border-green-300 hover:bg-green-50"
    },
    {
      title: "Search Service Providers",
      description: "Browse all types of event services",
      icon: <Sparkles className="h-8 w-8 text-purple-600" />,
      href: "/services",
      color: "border-purple-200 hover:border-purple-300 hover:bg-purple-50"
    },
    {
      title: "My Event Dashboard",
      description: "Manage your events and planning tools",
      icon: <Calendar className="h-8 w-8 text-orange-600" />,
      href: "/planner",
      color: "border-orange-200 hover:border-orange-300 hover:bg-orange-50"
    },
    {
      title: "My Favourites",
      description: "View your saved vendors and venues",
      icon: <Heart className="h-8 w-8 text-red-600" />,
      href: "/likes",
      color: "border-red-200 hover:border-red-300 hover:bg-red-50"
    },
    {
      title: "My Profile",
      description: "Set up your event planning details and preferences",
      icon: <User className="h-8 w-8 text-gray-600" />,
      href: "/profile",
      color: "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
    }
  ];

  return (
    <>
      <Helmet>
        <title>Welcome to HowzEventz - User Dashboard</title>
        <meta name="description" content="Your personal event planning dashboard with access to vendors, venues, and planning tools." />
      </Helmet>
      
      <div className="min-h-[calc(100vh-64px)] bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <div className="container-custom py-8">
          {/* Welcome Header */}
          <div className="text-center mb-10">
            <h1 className="text-4xl font-display font-bold text-gray-900 mb-4">
              Welcome to HowzEventz! 🎉
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Your event planning journey starts here. Choose what you'd like to explore first.
            </p>
          </div>

          {/* Quick Start Banner */}
          <div className="bg-gradient-to-r from-primary to-purple-600 rounded-xl p-6 mb-8 text-white">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold mb-2">Ready to Plan Your Perfect Event?</h2>
                <p className="text-blue-100">Get started by exploring vendors, venues, or jump into your planning dashboard</p>
              </div>
              <Search className="h-16 w-16 text-blue-200" />
            </div>
          </div>

          {/* Navigation Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {navigationOptions.map((option, index) => (
              <Link key={index} href={option.href}>
                <Card className={`h-full transition-all duration-200 cursor-pointer transform hover:scale-105 hover:shadow-lg ${option.color}`}>
                  <CardHeader className="pb-3">
                    <div className="flex items-center space-x-3">
                      {option.icon}
                      <CardTitle className="text-lg">{option.title}</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-gray-600 mb-4">
                      {option.description}
                    </CardDescription>
                    <div className="flex items-center text-primary font-medium text-sm">
                      Get Started <ArrowRight className="h-4 w-4 ml-1" />
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>

          {/* Additional Quick Actions */}
          <div className="mt-12 text-center">
            <h3 className="text-2xl font-display font-semibold text-gray-900 mb-6">
              Quick Actions
            </h3>
            <div className="flex flex-wrap justify-center gap-4">
              <Link href="/vendor-registration">
                <Button variant="outline" className="flex items-center space-x-2">
                  <Users className="h-4 w-4" />
                  <span>Become a Vendor</span>
                </Button>
              </Link>
              <Link href="/vendors?featured=true">
                <Button variant="outline" className="flex items-center space-x-2">
                  <Sparkles className="h-4 w-4" />
                  <span>Browse Featured</span>
                </Button>
              </Link>
              <Link href="/vendors?location=near-me">
                <Button variant="outline" className="flex items-center space-x-2">
                  <MapPin className="h-4 w-4" />
                  <span>Find Near Me</span>
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}