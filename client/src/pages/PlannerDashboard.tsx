import React, { useState } from "react";
import { Helmet } from "react-helmet";
import { useAuth } from "@/context/AuthContext";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ShortlistView from "@/components/planner/ShortlistView";
import TaskManager from "@/components/planner/TaskManager";
import Timeline from "@/components/planner/Timeline";

export default function PlannerDashboard() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("shortlist");

  return (
    <>
      <Helmet>
        <title>Wedding Planner Dashboard - WeddingPro</title>
        <meta 
          name="description" 
          content="Manage your wedding planning with shortlists, tasks, and timeline."
        />
      </Helmet>
      
      <div className="bg-neutral py-10">
        <div className="container-custom">
          <div className="mb-8">
            <h1 className="text-3xl font-display font-bold mb-2">
              {user?.fullName ? `${user.fullName}'s Wedding Plan` : "My Wedding Plan"}
            </h1>
            <p className="text-muted-foreground">
              Keep track of your wedding planning journey in one place
            </p>
          </div>
          
          <Tabs
            defaultValue="shortlist"
            value={activeTab}
            onValueChange={setActiveTab}
            className="space-y-6"
          >
            <TabsList className="grid grid-cols-3 w-full md:w-auto bg-neutral">
              <TabsTrigger value="shortlist" className="font-medium">Shortlisted Vendors</TabsTrigger>
              <TabsTrigger value="tasks" className="font-medium">Team Tasks</TabsTrigger>
              <TabsTrigger value="timeline" className="font-medium">Timeline</TabsTrigger>
            </TabsList>
            
            <TabsContent value="shortlist">
              <ShortlistView />
            </TabsContent>
            
            <TabsContent value="tasks">
              <TaskManager />
            </TabsContent>
            
            <TabsContent value="timeline">
              <Timeline />
            </TabsContent>
          </Tabs>
          
          <div className="mt-12 bg-accent/50 rounded-lg p-6">
            <h2 className="text-xl font-display font-semibold mb-4">Wedding Planning Tips</h2>
            <div className="grid md:grid-cols-3 gap-6">
              <div>
                <h3 className="font-medium mb-2">12-16 Months Before</h3>
                <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                  <li>Set a budget and guest count</li>
                  <li>Choose venue and set date</li>
                  <li>Start researching major vendors</li>
                  <li>Create wedding website</li>
                </ul>
              </div>
              
              <div>
                <h3 className="font-medium mb-2">6-8 Months Before</h3>
                <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                  <li>Order wedding attire</li>
                  <li>Book photographer and videographer</li>
                  <li>Plan honeymoon</li>
                  <li>Choose wedding party</li>
                </ul>
              </div>
              
              <div>
                <h3 className="font-medium mb-2">2-3 Months Before</h3>
                <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                  <li>Send invitations</li>
                  <li>Finalize menu and cake</li>
                  <li>Schedule hair and makeup trials</li>
                  <li>Create day-of timeline</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
