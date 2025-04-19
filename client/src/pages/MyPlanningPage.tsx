import React, { useState } from "react";
import { Helmet } from "react-helmet";
import { useAuth } from "@/context/AuthContext";
import { Link, useLocation } from "wouter";
import { 
  CalendarDays, 
  FileText, 
  CheckSquare, 
  Wallet, 
  ChevronRight,
  Plus 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const planningLinks = [
  {
    id: "events-diary",
    name: "Events Diary",
    description: "Manage your event timeline and key dates",
    icon: <CalendarDays className="h-5 w-5 mr-2 text-primary" />,
    href: "/planner/events-diary"
  },
  {
    id: "quotes",
    name: "Quotes",
    description: "Track and compare vendor quotes",
    icon: <FileText className="h-5 w-5 mr-2 text-primary" />,
    href: "/planner/quotes"
  },
  {
    id: "booking-confirmations",
    name: "Booking Confirmations",
    description: "Manage confirmed bookings and contracts",
    icon: <CheckSquare className="h-5 w-5 mr-2 text-primary" />,
    href: "/planner/bookings"
  },
  {
    id: "budget-tracker",
    name: "Budget Tracker",
    description: "Track expenses and stay on budget",
    icon: <Wallet className="h-5 w-5 mr-2 text-primary" />,
    href: "/planner/budget"
  }
];

export default function MyPlanningPage() {
  const [, setLocation] = useLocation();
  const { user, isLoading } = useAuth();
  const [activeTab, setActiveTab] = useState("events-diary");

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
        <title>My Planning | HowzEventz</title>
        <meta name="description" content="Manage your event planning tools and resources" />
      </Helmet>

      <div className="container-custom py-8">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h1 className="text-3xl font-display font-bold">My Planning</h1>
            <p className="text-muted-foreground mt-1">Organize your event planning journey</p>
          </div>
          <Button className="bg-primary text-white">
            <Plus className="h-4 w-4 mr-2" /> New Event
          </Button>
        </div>

        {/* Mobile planning navigation tabs */}
        <div className="block md:hidden mb-6">
          <Tabs defaultValue={activeTab} value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="w-full overflow-auto">
              {planningLinks.map((item) => (
                <TabsTrigger key={item.id} value={item.id} className="flex-1">
                  {item.name}
                </TabsTrigger>
              ))}
            </TabsList>

            {planningLinks.map((item) => (
              <TabsContent key={item.id} value={item.id}>
                <div className="text-center py-4">
                  <div className="flex justify-center mb-2">
                    {item.icon}
                  </div>
                  <h2 className="text-xl font-semibold mb-2">{item.name}</h2>
                  <p className="text-muted-foreground mb-4">{item.description}</p>
                  <Link href={item.href}>
                    <Button>
                      Go to {item.name} <ChevronRight className="h-4 w-4 ml-1" />
                    </Button>
                  </Link>
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </div>

        {/* Planning tools grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {planningLinks.map((item) => (
            <Link
              key={item.id}
              href={item.href}
              className="block"
            >
              <div className="border rounded-lg p-5 hover:shadow-md transition-shadow h-full bg-background">
                <div className="flex items-center mb-3">
                  {item.icon}
                  <h3 className="font-semibold text-lg">{item.name}</h3>
                </div>
                <p className="text-muted-foreground text-sm mb-4">{item.description}</p>
                <div className="flex justify-end">
                  <ChevronRight className="h-5 w-5 text-muted-foreground" />
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Recent activity section */}
        <div className="mt-10">
          <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
          <div className="border rounded-lg overflow-hidden">
            <div className="p-5 flex items-center border-b">
              <CalendarDays className="h-10 w-10 p-2 bg-primary/10 rounded-full text-primary mr-3" />
              <div>
                <h3 className="font-medium">Added new event: Summer Wedding</h3>
                <p className="text-sm text-muted-foreground">2 days ago</p>
              </div>
            </div>
            <div className="p-5 flex items-center border-b">
              <FileText className="h-10 w-10 p-2 bg-primary/10 rounded-full text-primary mr-3" />
              <div>
                <h3 className="font-medium">Received quote from Sunset Venue</h3>
                <p className="text-sm text-muted-foreground">3 days ago</p>
              </div>
            </div>
            <div className="p-5 flex items-center">
              <Wallet className="h-10 w-10 p-2 bg-primary/10 rounded-full text-primary mr-3" />
              <div>
                <h3 className="font-medium">Updated budget for catering services</h3>
                <p className="text-sm text-muted-foreground">1 week ago</p>
              </div>
            </div>
          </div>
        </div>

        {/* Quick tips section */}
        <div className="mt-8 bg-accent/20 rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-2">Planning Tips</h2>
          <p className="text-muted-foreground mb-4">Make the most of your event planning journey</p>
          <ul className="space-y-2">
            <li className="flex items-start">
              <span className="text-primary font-bold mr-2">•</span>
              <span>Use the Events Diary to track important dates and deadlines</span>
            </li>
            <li className="flex items-start">
              <span className="text-primary font-bold mr-2">•</span>
              <span>Compare quotes from multiple vendors before making decisions</span>
            </li>
            <li className="flex items-start">
              <span className="text-primary font-bold mr-2">•</span>
              <span>Keep all your booking confirmations in one place for easy reference</span>
            </li>
            <li className="flex items-start">
              <span className="text-primary font-bold mr-2">•</span>
              <span>Regularly update your budget tracker to avoid overspending</span>
            </li>
          </ul>
        </div>
      </div>
    </>
  );
}