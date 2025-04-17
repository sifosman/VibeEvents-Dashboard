import React from "react";
import { Link } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { Check, ChevronRight, ExternalLink, Hourglass, Trash2 } from "lucide-react";

// Simple version of PlannerScreens that doesn't require auth
function SimplePlannerScreens() {
  // Note: This component shows a preview of planner features without requiring auth
  const isAuthenticated = false; // Always show logged-out state

  return (
    <section className="py-16 bg-accent bg-opacity-30">
      <div className="container-custom">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-display font-bold mb-4">Your Event Planning Dashboard</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">Organize every aspect of your special event in one convenient place</p>
        </div>
        
        <div className="flex flex-col lg:flex-row space-y-8 lg:space-y-0 lg:space-x-8">
          {/* Cards with non-authenticated state */}
          <Card className="lg:w-1/3">
            <CardHeader className="pb-3 border-b">
              <CardTitle className="font-display text-xl">My Shortlist</CardTitle>
              <p className="text-muted-foreground text-sm">Your favorite vendors in one place</p>
            </CardHeader>
            <CardContent className="p-5 space-y-4">
              <div className="text-center py-8">
                <h4 className="font-medium text-lg mb-2">Sign in to manage your shortlist</h4>
                <p className="text-sm text-muted-foreground mb-4">Keep track of vendors you're interested in</p>
                <Link href="/login">
                  <button className="text-primary font-medium hover:underline">
                    Log in to View
                  </button>
                </Link>
              </div>
              
              <Separator className="my-4" />
              <Link href="/login" className="text-primary font-medium hover:underline text-sm flex items-center">
                View All Shortlisted Vendors
                <ChevronRight className="ml-1 h-4 w-4" />
              </Link>
            </CardContent>
          </Card>
          
          <Card className="lg:w-1/3">
            <CardHeader className="pb-3 border-b">
              <CardTitle className="font-display text-xl">Team Tasks</CardTitle>
              <p className="text-muted-foreground text-sm">Assign and track event planning tasks</p>
            </CardHeader>
            <CardContent className="p-5 space-y-4">
              <div className="text-center py-8">
                <h4 className="font-medium text-lg mb-2">Sign in to manage tasks</h4>
                <p className="text-sm text-muted-foreground mb-4">Assign tasks to your event team</p>
                <Link href="/login">
                  <button className="text-primary font-medium hover:underline">
                    Log in to View
                  </button>
                </Link>
              </div>
              
              <Separator className="my-4" />
              <div className="flex justify-between items-center">
                <Link href="/login" className="text-primary font-medium hover:underline text-sm flex items-center">
                  View All Tasks
                  <ChevronRight className="ml-1 h-4 w-4" />
                </Link>
              </div>
            </CardContent>
          </Card>
          
          <Card className="lg:w-1/3">
            <CardHeader className="pb-3 border-b">
              <CardTitle className="font-display text-xl">Event Timeline</CardTitle>
              <p className="text-muted-foreground text-sm">Track your progress and upcoming events</p>
            </CardHeader>
            <CardContent className="p-5">
              <div className="text-center py-8">
                <h4 className="font-medium text-lg mb-2">Sign in to view timeline</h4>
                <p className="text-sm text-muted-foreground mb-4">Plan your event journey with milestones</p>
                <Link href="/login">
                  <button className="text-primary font-medium hover:underline">
                    Log in to View
                  </button>
                </Link>
              </div>
              
              <Separator className="my-4" />
              <Link href="/login" className="text-primary font-medium hover:underline text-sm flex items-center">
                View Full Event Timeline
                <ChevronRight className="ml-1 h-4 w-4" />
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}

// Component that tries to use auth but falls back to simple version if it fails
export default function PlannerScreens() {
  try {
    // Try to use auth context
    const { useAuth } = require("@/context/AuthContext");
    const { isAuthenticated } = useAuth();

    // Note: This component shows a preview of planner features - actual functionality would be in the planner dashboard page
    return (
      <section className="py-16 bg-accent bg-opacity-30">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-display font-bold mb-4">Your Event Planning Dashboard</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">Organize every aspect of your special event in one convenient place</p>
          </div>
          
          <div className="flex flex-col lg:flex-row space-y-8 lg:space-y-0 lg:space-x-8">
            {/* Shortlist Preview Card */}
            <Card className="lg:w-1/3">
              <CardHeader className="pb-3 border-b">
                <CardTitle className="font-display text-xl">My Shortlist</CardTitle>
                <p className="text-muted-foreground text-sm">Your favorite vendors in one place</p>
              </CardHeader>
              <CardContent className="p-5 space-y-4">
                {isAuthenticated ? (
                  <>
                    <div className="flex items-center space-x-3 p-3 rounded hover:bg-accent hover:bg-opacity-30 transition">
                      <img src="https://images.unsplash.com/photo-1519225421980-715cb0215aed?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100&q=80" className="w-16 h-16 object-cover rounded" alt="Highland Manor" />
                      <div className="flex-grow">
                        <h4 className="font-medium text-base">Highland Manor</h4>
                        <span className="text-xs text-muted-foreground">Venue • $$$</span>
                      </div>
                      <div className="flex flex-col space-y-2">
                        <button className="text-primary hover:text-opacity-80 transition">
                          <ExternalLink className="h-4 w-4" />
                        </button>
                        <button className="text-destructive hover:text-opacity-80 transition">
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-3 p-3 rounded hover:bg-accent hover:bg-opacity-30 transition">
                      <img src="https://images.unsplash.com/photo-1547059470-3b0c7cd958a4?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100&q=80" className="w-16 h-16 object-cover rounded" alt="Sweet Delights Bakery" />
                      <div className="flex-grow">
                        <h4 className="font-medium text-base">Sweet Delights Bakery</h4>
                        <span className="text-xs text-muted-foreground">Baker • $$</span>
                      </div>
                      <div className="flex flex-col space-y-2">
                        <button className="text-primary hover:text-opacity-80 transition">
                          <ExternalLink className="h-4 w-4" />
                        </button>
                        <button className="text-destructive hover:text-opacity-80 transition">
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-3 p-3 rounded hover:bg-accent hover:bg-opacity-30 transition">
                      <img src="https://images.unsplash.com/photo-1603049489988-53ebe4cd1c38?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100&q=80" className="w-16 h-16 object-cover rounded" alt="Classic Captures" />
                      <div className="flex-grow">
                        <h4 className="font-medium text-base">Classic Captures</h4>
                        <span className="text-xs text-muted-foreground">Photography • $$$</span>
                      </div>
                      <div className="flex flex-col space-y-2">
                        <button className="text-primary hover:text-opacity-80 transition">
                          <ExternalLink className="h-4 w-4" />
                        </button>
                        <button className="text-destructive hover:text-opacity-80 transition">
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="text-center py-8">
                    <h4 className="font-medium text-lg mb-2">Sign in to manage your shortlist</h4>
                    <p className="text-sm text-muted-foreground mb-4">Keep track of vendors you're interested in</p>
                    <Link href="/login">
                      <button className="text-primary font-medium hover:underline">
                        Log in to View
                      </button>
                    </Link>
                  </div>
                )}
                
                <Separator className="my-4" />
                <Link href={isAuthenticated ? "/planner" : "/login"} className="text-primary font-medium hover:underline text-sm flex items-center">
                  View All Shortlisted Vendors
                  <ChevronRight className="ml-1 h-4 w-4" />
                </Link>
              </CardContent>
            </Card>
            
            {/* Task Manager Preview Card */}
            <Card className="lg:w-1/3">
              <CardHeader className="pb-3 border-b">
                <CardTitle className="font-display text-xl">Team Tasks</CardTitle>
                <p className="text-muted-foreground text-sm">Assign and track event planning tasks</p>
              </CardHeader>
              <CardContent className="p-5 space-y-4">
                {isAuthenticated ? (
                  <>
                    <div className="p-3 border border-gray-200 rounded">
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex items-center">
                          <Checkbox id="task-1" className="mr-3 h-4 w-4 text-primary border-gray-300 rounded" />
                          <label htmlFor="task-1" className="font-medium">Finalize venue contract</label>
                        </div>
                        <span className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded">Urgent</span>
                      </div>
                      <div className="pl-7">
                        <p className="text-sm text-muted-foreground mb-2">Review payment schedule and confirm all details before signing</p>
                        <div className="flex justify-between items-center mt-2">
                          <div className="flex items-center">
                            <img src="https://randomuser.me/api/portraits/women/44.jpg" className="w-6 h-6 rounded-full" alt="Assigned to Emma" />
                            <span className="text-xs text-muted-foreground ml-2">Emma (Event Coordinator)</span>
                          </div>
                          <span className="text-xs text-muted-foreground">Due in 3 days</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="p-3 border border-gray-200 rounded">
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex items-center">
                          <Checkbox id="task-2" className="mr-3 h-4 w-4 text-primary border-gray-300 rounded" />
                          <label htmlFor="task-2" className="font-medium">Book catering service</label>
                        </div>
                        <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-1 rounded">Medium</span>
                      </div>
                      <div className="pl-7">
                        <p className="text-sm text-muted-foreground mb-2">Schedule tasting and finalize menu options</p>
                        <div className="flex justify-between items-center mt-2">
                          <div className="flex items-center">
                            <div className="w-6 h-6 rounded-full bg-primary text-white flex items-center justify-center text-xs">JL</div>
                            <span className="text-xs text-muted-foreground ml-2">Jessica (Host)</span>
                          </div>
                          <span className="text-xs text-muted-foreground">Due in 2 weeks</span>
                        </div>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="text-center py-8">
                    <h4 className="font-medium text-lg mb-2">Sign in to manage tasks</h4>
                    <p className="text-sm text-muted-foreground mb-4">Assign tasks to your event team</p>
                    <Link href="/login">
                      <button className="text-primary font-medium hover:underline">
                        Log in to View
                      </button>
                    </Link>
                  </div>
                )}
                
                <Separator className="my-4" />
                <div className="flex justify-between items-center">
                  <Link href={isAuthenticated ? "/planner" : "/login"} className="text-primary font-medium hover:underline text-sm flex items-center">
                    View All Tasks
                    <ChevronRight className="ml-1 h-4 w-4" />
                  </Link>
                  {isAuthenticated && (
                    <button className="px-3 py-1 bg-primary text-white text-sm rounded hover:bg-primary/90 transition flex items-center">
                      <span className="mr-1">+</span>
                      Add Task
                    </button>
                  )}
                </div>
              </CardContent>
            </Card>
            
            {/* Timeline Preview Card */}
            <Card className="lg:w-1/3">
              <CardHeader className="pb-3 border-b">
                <CardTitle className="font-display text-xl">Event Timeline</CardTitle>
                <p className="text-muted-foreground text-sm">Track your progress and upcoming events</p>
              </CardHeader>
              <CardContent className="p-5">
                {isAuthenticated ? (
                  <div className="relative">
                    <div className="absolute inset-y-0 left-4 w-0.5 bg-gray-200" aria-hidden="true"></div>
                    
                    <div className="relative mb-6">
                      <div className="flex items-start">
                        <div className="flex flex-col items-center">
                          <div className="flex z-10 justify-center items-center bg-primary w-8 h-8 rounded-full">
                            <Check className="h-4 w-4 text-white" />
                          </div>
                          <div className="ml-4 mt-1">
                            <span className="text-xs text-muted-foreground">2 weeks ago</span>
                          </div>
                        </div>
                        <div className="ml-4 mt-1">
                          <h4 className="font-medium">Initial Planning</h4>
                          <p className="text-sm text-muted-foreground">Determined event scope and budget</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="relative mb-6">
                      <div className="flex items-start">
                        <div className="flex flex-col items-center">
                          <div className="flex z-10 justify-center items-center bg-primary w-8 h-8 rounded-full">
                            <Check className="h-4 w-4 text-white" />
                          </div>
                          <div className="ml-4 mt-1">
                            <span className="text-xs text-muted-foreground">1 week ago</span>
                          </div>
                        </div>
                        <div className="ml-4 mt-1">
                          <h4 className="font-medium">Set Event Date</h4>
                          <p className="text-sm text-muted-foreground">June 15, 2024 confirmed</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="relative mb-6">
                      <div className="flex items-start">
                        <div className="flex flex-col items-center">
                          <div className="flex z-10 justify-center items-center bg-[#6A8C7D] w-8 h-8 rounded-full">
                            <Hourglass className="h-4 w-4 text-white" />
                          </div>
                          <div className="ml-4 mt-1">
                            <span className="text-xs text-muted-foreground">Now</span>
                          </div>
                        </div>
                        <div className="ml-4 mt-1">
                          <h4 className="font-medium">Venue Selection</h4>
                          <p className="text-sm text-muted-foreground">Touring options and negotiating contracts</p>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <h4 className="font-medium text-lg mb-2">Sign in to view timeline</h4>
                    <p className="text-sm text-muted-foreground mb-4">Plan your event journey with milestones</p>
                    <Link href="/login">
                      <button className="text-primary font-medium hover:underline">
                        Log in to View
                      </button>
                    </Link>
                  </div>
                )}
                
                <Separator className="my-4" />
                <Link href={isAuthenticated ? "/planner" : "/login"} className="text-primary font-medium hover:underline text-sm flex items-center">
                  View Full Event Timeline
                  <ChevronRight className="ml-1 h-4 w-4" />
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    );
  } catch (error) {
    // Fall back to simpler version if auth context is not available
    return <SimplePlannerScreens />;
  }
}