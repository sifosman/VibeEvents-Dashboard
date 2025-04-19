import React from "react";
import { Helmet } from "react-helmet";
import { useAuth } from "@/context/AuthContext";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { CalendarDays, ChevronLeft, Plus } from "lucide-react";

export default function EventsDiary() {
  const [, setLocation] = useLocation();
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="container-custom py-10 flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!user) {
    setLocation("/login");
    return null;
  }

  return (
    <>
      <Helmet>
        <title>Events Diary | HowzEventz</title>
        <meta name="description" content="Track your event timeline and key dates" />
      </Helmet>

      <div className="container-custom py-8">
        <div className="mb-6">
          <Button 
            variant="ghost" 
            className="mb-4" 
            onClick={() => setLocation("/planner")}
          >
            <ChevronLeft className="h-4 w-4 mr-2" /> Back to My Planning
          </Button>

          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-display font-bold flex items-center">
                <CalendarDays className="h-7 w-7 mr-3 text-primary" />
                Events Diary
              </h1>
              <p className="text-muted-foreground mt-1">Manage your event timeline and key dates</p>
            </div>
            <Button className="bg-primary text-white">
              <Plus className="h-4 w-4 mr-2" /> Add Event
            </Button>
          </div>
        </div>

        {/* Calendar view placeholder */}
        <div className="border rounded-lg p-8 bg-background">
          <div className="text-center py-16">
            <h2 className="text-xl font-medium mb-2">Your Events Calendar</h2>
            <p className="text-muted-foreground mb-6">Track all your important event dates in one place</p>
            <Button>
              <Plus className="h-4 w-4 mr-2" /> Create Your First Event
            </Button>
          </div>
        </div>

        {/* Tips for event planning */}
        <div className="mt-8 bg-accent/20 rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-2">Event Diary Tips</h2>
          <p className="text-muted-foreground mb-4">Making the most of your event planning</p>
          <ul className="space-y-2">
            <li className="flex items-start">
              <span className="text-primary font-bold mr-2">•</span>
              <span>Start by creating a main event and setting your event date</span>
            </li>
            <li className="flex items-start">
              <span className="text-primary font-bold mr-2">•</span>
              <span>Add pre-event milestones like vendor meetings and deadlines</span>
            </li>
            <li className="flex items-start">
              <span className="text-primary font-bold mr-2">•</span>
              <span>Set reminders for important tasks and payments</span>
            </li>
            <li className="flex items-start">
              <span className="text-primary font-bold mr-2">•</span>
              <span>Invite team members to view and collaborate on your event timeline</span>
            </li>
          </ul>
        </div>
      </div>
    </>
  );
}