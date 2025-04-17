import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  CalendarDays,
  Check,
  Clipboard,
  CreditCard,
  ListChecks,
  Plus,
  Users,
  Store,
  Calendar,
  Heart,
} from 'lucide-react';
import BudgetPlanner from '@/components/planner/BudgetPlanner';
import TaskManager from '@/components/planner/TaskManager';
import GuestList from '@/components/planner/GuestList';
import Timeline from '@/components/planner/Timeline';
import VendorShortlists from '@/components/planner/VendorShortlists';

// Sample events data - would typically come from an API
const sampleEvents = [
  {
    id: 1,
    title: "Sarah & Michael's Wedding",
    date: "2025-06-15",
    type: "Wedding",
    location: "Cape Town, South Africa",
    budget: 120000,
    guests: 150,
    tasks: 24,
    completedTasks: 9,
  },
  {
    id: 2,
    title: "Corporate Annual Gala",
    date: "2025-03-22",
    type: "Corporate",
    location: "Johannesburg, South Africa",
    budget: 200000,
    guests: 350,
    tasks: 31,
    completedTasks: 4,
  },
  {
    id: 3,
    title: "Emily's 30th Birthday",
    date: "2024-09-10",
    type: "Birthday",
    location: "Durban, South Africa",
    budget: 15000,
    guests: 45,
    tasks: 15,
    completedTasks: 3,
  }
];

export default function PlannerDashboard() {
  const [activeTab, setActiveTab] = useState('overview');
  const [isCreateEventOpen, setIsCreateEventOpen] = useState(false);
  const [currentEvent, setCurrentEvent] = useState(sampleEvents[0]);
  
  // Create event form state
  const [newEvent, setNewEvent] = useState({
    title: '',
    date: '',
    type: '',
    location: '',
    budget: '',
    guests: '',
  });
  
  // Handle event selection
  const handleSelectEvent = (event: any) => {
    setCurrentEvent(event);
  };
  
  // Handle creating a new event
  const handleCreateEvent = () => {
    // Would typically submit to an API
    setIsCreateEventOpen(false);
    
    // Reset form
    setNewEvent({
      title: '',
      date: '',
      type: '',
      location: '',
      budget: '',
      guests: '',
    });
  };
  
  // Format date string to readable format
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };
  
  return (
    <div className="container-custom py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Event Planner</h1>
          <p className="text-muted-foreground">
            Organize and plan your events with budgeting, guest lists, and more
          </p>
        </div>
        <div className="mt-4 md:mt-0">
          <Button onClick={() => setIsCreateEventOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Create Event
          </Button>
        </div>
      </div>
      
      <div className="grid gap-8 grid-cols-12">
        {/* Sidebar with event selection */}
        <div className="col-span-12 md:col-span-3 space-y-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Your Events</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="space-y-1">
                {sampleEvents.map((event) => (
                  <button
                    key={event.id}
                    className={`w-full px-6 py-3 text-left cursor-pointer hover:bg-muted ${
                      currentEvent.id === event.id ? 'bg-muted font-medium' : ''
                    }`}
                    onClick={() => handleSelectEvent(event)}
                  >
                    <div className="font-medium">{event.title}</div>
                    <div className="text-xs text-muted-foreground flex items-center mt-1">
                      <CalendarDays className="h-3 w-3 mr-1" />
                      {formatDate(event.date)}
                    </div>
                    <div className="text-xs text-muted-foreground mt-1">
                      {event.type} • {event.location}
                    </div>
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>
          
          {/* Event Stats */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Event Stats</CardTitle>
              <CardDescription>
                {currentEvent.title}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                <div className="text-sm text-muted-foreground">Date</div>
                <div className="font-medium">{formatDate(currentEvent.date)}</div>
              </div>
              <div className="flex justify-between items-center">
                <div className="text-sm text-muted-foreground">Location</div>
                <div className="font-medium">{currentEvent.location}</div>
              </div>
              <div className="flex justify-between items-center">
                <div className="text-sm text-muted-foreground">Budget</div>
                <div className="font-medium">R{currentEvent.budget.toLocaleString()}</div>
              </div>
              <div className="flex justify-between items-center">
                <div className="text-sm text-muted-foreground">Guest Count</div>
                <div className="font-medium">{currentEvent.guests} people</div>
              </div>
              <div className="flex justify-between items-center">
                <div className="text-sm text-muted-foreground">Tasks</div>
                <div className="font-medium">
                  {currentEvent.completedTasks} of {currentEvent.tasks} completed
                </div>
              </div>
              
              <Separator />
              
              <div className="grid grid-cols-3 gap-2 text-center">
                <div className="space-y-1 p-2 rounded hover:bg-muted cursor-pointer" onClick={() => setActiveTab('budget')}>
                  <CreditCard className="h-4 w-4 mx-auto text-muted-foreground" />
                  <div className="text-xs">Budget</div>
                </div>
                <div className="space-y-1 p-2 rounded hover:bg-muted cursor-pointer" onClick={() => setActiveTab('tasks')}>
                  <Clipboard className="h-4 w-4 mx-auto text-muted-foreground" />
                  <div className="text-xs">Tasks</div>
                </div>
                <div className="space-y-1 p-2 rounded hover:bg-muted cursor-pointer" onClick={() => setActiveTab('guests')}>
                  <Users className="h-4 w-4 mx-auto text-muted-foreground" />
                  <div className="text-xs">Guests</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Main content area */}
        <div className="col-span-12 md:col-span-9">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid grid-cols-3 md:grid-cols-6 mb-4">
              <TabsTrigger value="overview">
                <ListChecks className="h-4 w-4 mr-2" />
                Overview
              </TabsTrigger>
              <TabsTrigger value="budget">
                <CreditCard className="h-4 w-4 mr-2" />
                Budget
              </TabsTrigger>
              <TabsTrigger value="tasks">
                <Clipboard className="h-4 w-4 mr-2" />
                Tasks
              </TabsTrigger>
              <TabsTrigger value="guests">
                <Users className="h-4 w-4 mr-2" />
                Guests
              </TabsTrigger>
              <TabsTrigger value="timeline">
                <Calendar className="h-4 w-4 mr-2" />
                Timeline
              </TabsTrigger>
              <TabsTrigger value="vendors">
                <Store className="h-4 w-4 mr-2" />
                Vendors
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="overview" className="space-y-6">
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                <Card className="col-span-1">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base flex items-center">
                      <CreditCard className="h-4 w-4 mr-2" />
                      Budget Summary
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">R{currentEvent.budget.toLocaleString()}</div>
                    <p className="text-xs text-muted-foreground">Total budget</p>
                    
                    <div className="mt-4 space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Venue & Catering</span>
                        <span className="font-medium">R{(currentEvent.budget * 0.6).toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Decor & Services</span>
                        <span className="font-medium">R{(currentEvent.budget * 0.3).toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Miscellaneous</span>
                        <span className="font-medium">R{(currentEvent.budget * 0.1).toLocaleString()}</span>
                      </div>
                    </div>
                    
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="w-full mt-4"
                      onClick={() => setActiveTab('budget')}
                    >
                      View Details
                    </Button>
                  </CardContent>
                </Card>
                
                <Card className="col-span-1">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base flex items-center">
                      <Clipboard className="h-4 w-4 mr-2" />
                      Task Progress
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{Math.round((currentEvent.completedTasks / currentEvent.tasks) * 100)}%</div>
                    <p className="text-xs text-muted-foreground">
                      {currentEvent.completedTasks} of {currentEvent.tasks} tasks completed
                    </p>
                    
                    <div className="mt-4 space-y-2">
                      <div className="w-full bg-muted rounded-full h-2.5">
                        <div 
                          className="bg-primary h-2.5 rounded-full" 
                          style={{ width: `${Math.round((currentEvent.completedTasks / currentEvent.tasks) * 100)}%` }}
                        ></div>
                      </div>
                      
                      <div className="flex justify-between text-sm">
                        <span>High Priority</span>
                        <span className="font-medium">4 pending</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Due This Week</span>
                        <span className="font-medium">2 tasks</span>
                      </div>
                    </div>
                    
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="w-full mt-4"
                      onClick={() => setActiveTab('tasks')}
                    >
                      View Tasks
                    </Button>
                  </CardContent>
                </Card>
                
                <Card className="col-span-1">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base flex items-center">
                      <Users className="h-4 w-4 mr-2" />
                      Guest List
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{currentEvent.guests}</div>
                    <p className="text-xs text-muted-foreground">Total guests</p>
                    
                    <div className="mt-4 space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Confirmed</span>
                        <span className="font-medium">{Math.round(currentEvent.guests * 0.7)}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Pending</span>
                        <span className="font-medium">{Math.round(currentEvent.guests * 0.2)}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Declined</span>
                        <span className="font-medium">{Math.round(currentEvent.guests * 0.1)}</span>
                      </div>
                    </div>
                    
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="w-full mt-4"
                      onClick={() => setActiveTab('guests')}
                    >
                      Manage Guests
                    </Button>
                  </CardContent>
                </Card>
                
                <Card className="col-span-1 md:col-span-2 lg:col-span-3">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base flex items-center">
                      <Calendar className="h-4 w-4 mr-2" />
                      Timeline
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-8">
                      <div className="flex">
                        <div className="flex flex-col items-center mr-4">
                          <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-white">
                            <Check className="h-4 w-4" />
                          </div>
                          <div className="w-px h-full bg-muted-foreground/20"></div>
                        </div>
                        <div className="pb-8">
                          <div className="text-sm font-medium">Book Venue</div>
                          <div className="text-xs text-muted-foreground">Completed on May 15</div>
                          <div className="mt-2 text-sm text-muted-foreground">
                            Venue booked at {currentEvent.location}
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex">
                        <div className="flex flex-col items-center mr-4">
                          <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-white">
                            <Check className="h-4 w-4" />
                          </div>
                          <div className="w-px h-full bg-muted-foreground/20"></div>
                        </div>
                        <div className="pb-8">
                          <div className="text-sm font-medium">Secure Catering</div>
                          <div className="text-xs text-muted-foreground">Completed on May 30</div>
                          <div className="mt-2 text-sm text-muted-foreground">
                            Catering service confirmed with menu selection
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex">
                        <div className="flex flex-col items-center mr-4">
                          <div className="flex items-center justify-center w-8 h-8 rounded-full bg-muted-foreground/20">
                            <div className="w-3 h-3 rounded-full bg-muted-foreground"></div>
                          </div>
                        </div>
                        <div>
                          <div className="text-sm font-medium">Send Invitations</div>
                          <div className="text-xs text-muted-foreground">Due by August 15</div>
                          <div className="mt-2 text-sm text-muted-foreground">
                            Pending completion
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="w-full mt-4"
                      onClick={() => setActiveTab('timeline')}
                    >
                      View Full Timeline
                    </Button>
                  </CardContent>
                </Card>
                
                <Card className="col-span-1 md:col-span-2 lg:col-span-3">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base flex items-center">
                      <Heart className="h-4 w-4 mr-2" />
                      Shortlisted Vendors
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid gap-4 grid-cols-1 md:grid-cols-3">
                      <div className="border rounded-lg p-4">
                        <div className="font-medium">Rose Garden Hall</div>
                        <div className="text-xs text-muted-foreground">Venue</div>
                        <div className="mt-2 text-sm">R25,000</div>
                        <div className="mt-2 text-xs text-muted-foreground">Notes: Beautiful venue with garden space</div>
                      </div>
                      
                      <div className="border rounded-lg p-4">
                        <div className="font-medium">Gourmet Delights</div>
                        <div className="text-xs text-muted-foreground">Catering</div>
                        <div className="mt-2 text-sm">R15,000</div>
                        <div className="mt-2 text-xs text-muted-foreground">Notes: Great menu options, good reviews</div>
                      </div>
                      
                      <div className="border rounded-lg p-4">
                        <div className="font-medium">Moments Captured</div>
                        <div className="text-xs text-muted-foreground">Photography</div>
                        <div className="mt-2 text-sm">R8,500</div>
                        <div className="mt-2 text-xs text-muted-foreground">Notes: Love their portfolio style</div>
                      </div>
                    </div>
                    
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="w-full mt-4"
                      onClick={() => setActiveTab('vendors')}
                    >
                      View All Vendors
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
            
            <TabsContent value="budget">
              <BudgetPlanner />
            </TabsContent>
            
            <TabsContent value="tasks">
              <TaskManager />
            </TabsContent>
            
            <TabsContent value="guests">
              <Card>
                <CardHeader>
                  <CardTitle>Guest List</CardTitle>
                  <CardDescription>Manage your event guests</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground text-center py-8">
                    Guest list management will be integrated soon.
                  </p>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="timeline">
              <Timeline />
            </TabsContent>
            
            <TabsContent value="vendors">
              <VendorShortlists />
            </TabsContent>
          </Tabs>
        </div>
      </div>
      
      {/* Create Event Dialog */}
      <Dialog open={isCreateEventOpen} onOpenChange={setIsCreateEventOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Create New Event</DialogTitle>
            <DialogDescription>
              Add a new event to your planner.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="event-title">Event Title</Label>
              <Input
                id="event-title"
                value={newEvent.title}
                onChange={(e) => setNewEvent({...newEvent, title: e.target.value})}
                placeholder="e.g., Wedding, Birthday Party, Corporate Event"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="event-date">Event Date</Label>
                <Input
                  id="event-date"
                  type="date"
                  value={newEvent.date}
                  onChange={(e) => setNewEvent({...newEvent, date: e.target.value})}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="event-type">Event Type</Label>
                <Input
                  id="event-type"
                  value={newEvent.type}
                  onChange={(e) => setNewEvent({...newEvent, type: e.target.value})}
                  placeholder="e.g., Wedding, Party"
                />
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="event-location">Location</Label>
              <Input
                id="event-location"
                value={newEvent.location}
                onChange={(e) => setNewEvent({...newEvent, location: e.target.value})}
                placeholder="e.g., Cape Town, South Africa"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="event-budget">Budget (R)</Label>
                <Input
                  id="event-budget"
                  value={newEvent.budget}
                  onChange={(e) => setNewEvent({...newEvent, budget: e.target.value})}
                  placeholder="e.g., 50000"
                  type="number"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="event-guests">Expected Guests</Label>
                <Input
                  id="event-guests"
                  value={newEvent.guests}
                  onChange={(e) => setNewEvent({...newEvent, guests: e.target.value})}
                  placeholder="e.g., 100"
                  type="number"
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" onClick={handleCreateEvent}>Create Event</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}