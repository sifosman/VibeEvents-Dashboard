import React, { useState } from "react";
import { Helmet } from "react-helmet";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Checkbox } from "@/components/ui/checkbox";
import { 
  User, 
  Calendar as CalendarIcon, 
  Clock, 
  CheckSquare, 
  Users, 
  Search,
  ArrowLeft,
  Save
} from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

interface UserProfileData {
  // Personal Information
  fullName: string;
  email: string;
  phone: string;
  
  // Event Details
  eventType: string;
  eventDate: Date | undefined;
  eventLocation: string;
  guestCount: string;
  budget: string;
  
  // Planning Details
  responsibilities: string[];
  timeline: string;
  priorities: string;
  
  // Lists and Organization
  todoItems: string[];
  contactList: { name: string; role: string; phone: string; email: string }[];
  searchPreferences: string[];
}

export default function UserProfile() {
  const [, setLocation] = useLocation();
  const [profileData, setProfileData] = useState<UserProfileData>({
    fullName: "",
    email: "",
    phone: "",
    eventType: "",
    eventDate: undefined,
    eventLocation: "",
    guestCount: "",
    budget: "",
    responsibilities: [],
    timeline: "",
    priorities: "",
    todoItems: [""],
    contactList: [{ name: "", role: "", phone: "", email: "" }],
    searchPreferences: []
  });

  const eventTypes = [
    "Wedding", "Birthday Party", "Corporate Event", "Baby Shower", 
    "Graduation", "Anniversary", "Holiday Party", "Conference", 
    "Workshop", "Fundraiser", "Other"
  ];

  const responsibilityOptions = [
    "Overall Event Coordination",
    "Venue Selection",
    "Catering Management", 
    "Guest Management",
    "Budget Management",
    "Vendor Coordination",
    "Timeline Management",
    "Decoration & Setup",
    "Entertainment Booking",
    "Photography/Videography"
  ];

  const searchPreferenceOptions = [
    "Venues", "Caterers", "Photographers", "Decorators", 
    "Entertainment", "Florists", "Planners", "Transportation"
  ];

  const handleSaveProfile = () => {
    console.log("Saving profile:", profileData);
    // Here you would typically save to backend
    alert("Profile saved successfully!");
  };

  const addTodoItem = () => {
    setProfileData(prev => ({
      ...prev,
      todoItems: [...prev.todoItems, ""]
    }));
  };

  const updateTodoItem = (index: number, value: string) => {
    setProfileData(prev => ({
      ...prev,
      todoItems: prev.todoItems.map((item, i) => i === index ? value : item)
    }));
  };

  const addContact = () => {
    setProfileData(prev => ({
      ...prev,
      contactList: [...prev.contactList, { name: "", role: "", phone: "", email: "" }]
    }));
  };

  const updateContact = (index: number, field: string, value: string) => {
    setProfileData(prev => ({
      ...prev,
      contactList: prev.contactList.map((contact, i) => 
        i === index ? { ...contact, [field]: value } : contact
      )
    }));
  };

  return (
    <>
      <Helmet>
        <title>My Profile - HowzEventz</title>
        <meta name="description" content="Set up and manage your event planning profile" />
      </Helmet>

      <div className="bg-neutral min-h-screen">
        <div className="container-custom py-8">
          {/* Header */}
          <div className="flex items-center gap-4 mb-8">
            <Button 
              variant="outline" 
              size="icon"
              onClick={() => setLocation("/dashboard")}
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div>
              <h1 className="text-3xl font-display font-bold">My Profile</h1>
              <p className="text-muted-foreground">Set up your event planning preferences and details</p>
            </div>
          </div>

          <div className="grid gap-6">
            {/* Personal Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Personal Information
                </CardTitle>
                <CardDescription>Your basic contact details</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="fullName">Full Name</Label>
                    <Input 
                      id="fullName"
                      value={profileData.fullName}
                      onChange={(e) => setProfileData(prev => ({ ...prev, fullName: e.target.value }))}
                      placeholder="Enter your full name"
                    />
                  </div>
                  <div>
                    <Label htmlFor="email">Email Address</Label>
                    <Input 
                      id="email"
                      type="email"
                      value={profileData.email}
                      onChange={(e) => setProfileData(prev => ({ ...prev, email: e.target.value }))}
                      placeholder="your.email@example.com"
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input 
                    id="phone"
                    value={profileData.phone}
                    onChange={(e) => setProfileData(prev => ({ ...prev, phone: e.target.value }))}
                    placeholder="(555) 123-4567"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Event Details */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CalendarIcon className="h-5 w-5" />
                  Event Details
                </CardTitle>
                <CardDescription>Tell us about the event you're planning</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="eventType">What event are you planning?</Label>
                    <Select 
                      value={profileData.eventType} 
                      onValueChange={(value) => setProfileData(prev => ({ ...prev, eventType: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select event type" />
                      </SelectTrigger>
                      <SelectContent>
                        {eventTypes.map(type => (
                          <SelectItem key={type} value={type}>{type}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Event Date</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full justify-start text-left font-normal",
                            !profileData.eventDate && "text-muted-foreground"
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {profileData.eventDate ? format(profileData.eventDate, "PPP") : "Pick a date"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={profileData.eventDate}
                          onSelect={(date) => setProfileData(prev => ({ ...prev, eventDate: date }))}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>
                <div className="grid md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="eventLocation">Event Location</Label>
                    <Input 
                      id="eventLocation"
                      value={profileData.eventLocation}
                      onChange={(e) => setProfileData(prev => ({ ...prev, eventLocation: e.target.value }))}
                      placeholder="City, State"
                    />
                  </div>
                  <div>
                    <Label htmlFor="guestCount">Expected Guests</Label>
                    <Input 
                      id="guestCount"
                      value={profileData.guestCount}
                      onChange={(e) => setProfileData(prev => ({ ...prev, guestCount: e.target.value }))}
                      placeholder="50-100"
                    />
                  </div>
                  <div>
                    <Label htmlFor="budget">Budget Range</Label>
                    <Input 
                      id="budget"
                      value={profileData.budget}
                      onChange={(e) => setProfileData(prev => ({ ...prev, budget: e.target.value }))}
                      placeholder="$5,000 - $10,000"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Responsibilities */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckSquare className="h-5 w-5" />
                  Your Responsibilities
                </CardTitle>
                <CardDescription>What aspects of the event will you be managing?</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-3">
                  {responsibilityOptions.map((responsibility) => (
                    <div key={responsibility} className="flex items-center space-x-2">
                      <Checkbox
                        id={responsibility}
                        checked={profileData.responsibilities.includes(responsibility)}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            setProfileData(prev => ({
                              ...prev,
                              responsibilities: [...prev.responsibilities, responsibility]
                            }));
                          } else {
                            setProfileData(prev => ({
                              ...prev,
                              responsibilities: prev.responsibilities.filter(r => r !== responsibility)
                            }));
                          }
                        }}
                      />
                      <Label htmlFor={responsibility} className="text-sm font-normal">
                        {responsibility}
                      </Label>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Timeline and Priorities */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  Timeline & Priorities
                </CardTitle>
                <CardDescription>Help us understand your planning timeline</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="timeline">Planning Timeline</Label>
                  <Textarea 
                    id="timeline"
                    value={profileData.timeline}
                    onChange={(e) => setProfileData(prev => ({ ...prev, timeline: e.target.value }))}
                    placeholder="Describe your planning timeline (e.g., 'Need to book venue in next 2 weeks', 'Event is in 6 months')"
                    rows={3}
                  />
                </div>
                <div>
                  <Label htmlFor="priorities">Top Priorities</Label>
                  <Textarea 
                    id="priorities"
                    value={profileData.priorities}
                    onChange={(e) => setProfileData(prev => ({ ...prev, priorities: e.target.value }))}
                    placeholder="What are your top priorities for this event? (e.g., staying within budget, finding perfect venue, quality photography)"
                    rows={3}
                  />
                </div>
              </CardContent>
            </Card>

            {/* To-Do List */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckSquare className="h-5 w-5" />
                  To-Do List
                </CardTitle>
                <CardDescription>Keep track of your planning tasks</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {profileData.todoItems.map((item, index) => (
                  <Input
                    key={index}
                    value={item}
                    onChange={(e) => updateTodoItem(index, e.target.value)}
                    placeholder={`Task ${index + 1}`}
                  />
                ))}
                <Button 
                  variant="outline" 
                  onClick={addTodoItem}
                  className="w-full"
                >
                  Add Task
                </Button>
              </CardContent>
            </Card>

            {/* Contact List */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Contact List
                </CardTitle>
                <CardDescription>Important contacts for your event planning</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {profileData.contactList.map((contact, index) => (
                  <div key={index} className="grid md:grid-cols-4 gap-3 p-4 border rounded-lg">
                    <Input
                      value={contact.name}
                      onChange={(e) => updateContact(index, "name", e.target.value)}
                      placeholder="Name"
                    />
                    <Input
                      value={contact.role}
                      onChange={(e) => updateContact(index, "role", e.target.value)}
                      placeholder="Role (e.g., Photographer)"
                    />
                    <Input
                      value={contact.phone}
                      onChange={(e) => updateContact(index, "phone", e.target.value)}
                      placeholder="Phone"
                    />
                    <Input
                      value={contact.email}
                      onChange={(e) => updateContact(index, "email", e.target.value)}
                      placeholder="Email"
                    />
                  </div>
                ))}
                <Button 
                  variant="outline" 
                  onClick={addContact}
                  className="w-full"
                >
                  Add Contact
                </Button>
              </CardContent>
            </Card>

            {/* Search Preferences */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Search className="h-5 w-5" />
                  Search Preferences
                </CardTitle>
                <CardDescription>What types of vendors are you looking for?</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-3">
                  {searchPreferenceOptions.map((preference) => (
                    <div key={preference} className="flex items-center space-x-2">
                      <Checkbox
                        id={`search-${preference}`}
                        checked={profileData.searchPreferences.includes(preference)}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            setProfileData(prev => ({
                              ...prev,
                              searchPreferences: [...prev.searchPreferences, preference]
                            }));
                          } else {
                            setProfileData(prev => ({
                              ...prev,
                              searchPreferences: prev.searchPreferences.filter(p => p !== preference)
                            }));
                          }
                        }}
                      />
                      <Label htmlFor={`search-${preference}`} className="text-sm font-normal">
                        {preference}
                      </Label>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Save Button */}
            <div className="flex justify-center">
              <Button 
                onClick={handleSaveProfile}
                size="lg"
                className="min-w-48"
              >
                <Save className="mr-2 h-4 w-4" />
                Save Profile
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}