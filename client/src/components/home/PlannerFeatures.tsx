import React from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Calendar, Heart, ListTodo } from "lucide-react";

export default function PlannerFeatures() {
  return (
    <section className="py-16 bg-secondary bg-opacity-20">
      <div className="container-custom">
        <div className="flex flex-col lg:flex-row gap-12 items-center">
          <div className="lg:w-1/2">
            <h2 className="text-3xl md:text-4xl font-display font-bold mb-6">Organize Any Event With Our Smart Planner</h2>
            <p className="text-muted-foreground mb-8">
              Keep all your event planning in one place with our innovative planner tools. 
              Whether it's a corporate conference, cultural festival, market day, or sports tournament - 
              shortlist vendors, assign tasks to your team, and track every detail with ease.
            </p>
            
            <div className="space-y-4">
              <div className="flex items-start space-x-4">
                <div className="bg-primary rounded-full p-2 mt-1">
                  <Heart className="h-4 w-4 text-white" />
                </div>
                <div>
                  <h3 className="font-display font-medium text-lg mb-1">Shortlist Favorites</h3>
                  <p className="text-muted-foreground text-sm">Save vendors you love across all categories and compare them later.</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4">
                <div className="bg-primary rounded-full p-2 mt-1">
                  <ListTodo className="h-4 w-4 text-white" />
                </div>
                <div>
                  <h3 className="font-display font-medium text-lg mb-1">Task Management</h3>
                  <p className="text-muted-foreground text-sm">Assign tasks to team members, friends and family helping with your event.</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4">
                <div className="bg-primary rounded-full p-2 mt-1">
                  <Calendar className="h-4 w-4 text-white" />
                </div>
                <div>
                  <h3 className="font-display font-medium text-lg mb-1">Timeline Builder</h3>
                  <p className="text-muted-foreground text-sm">Create a detailed timeline for your wedding day with automated reminders.</p>
                </div>
              </div>
            </div>
            
            <div className="mt-8">
              <Link href="/planner">
                <Button className="bg-primary text-white rounded-lg hover:bg-primary/90 px-6 py-3">
                  Get Started with Planner
                </Button>
              </Link>
            </div>
          </div>
          
          <div className="lg:w-1/2">
            <div className="relative">
              <div className="absolute -top-6 -left-6 w-64 h-64 bg-[#6A8C7D] bg-opacity-20 rounded-lg"></div>
              <div className="relative z-10">
                <img 
                  src="https://images.unsplash.com/photo-1511795409834-ef04bbd61622?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" 
                  alt="Wedding Planner App" 
                  className="rounded-lg shadow-xl" 
                  width="600" 
                  height="400"
                />
              </div>
              <div className="absolute -bottom-6 -right-6 w-64 h-64 bg-primary bg-opacity-10 rounded-lg"></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
