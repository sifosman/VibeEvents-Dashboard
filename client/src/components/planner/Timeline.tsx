import React, { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import {
  CalendarDays,
  Check,
  ChevronDown,
  Clock,
  Edit,
  MoreHorizontal,
  Plus,
  Trash2,
  CalendarIcon
} from 'lucide-react';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { format } from 'date-fns';

// Sample event options
const eventOptions = [
  { id: 1, name: "Sarah & Michael's Wedding" },
  { id: 2, name: "Corporate Annual Gala" },
  { id: 3, name: "Emily's 30th Birthday" },
];

// Sample timeline data
const timelineData = [
  {
    id: 1,
    title: '12 Months Before',
    events: [
      {
        id: 101,
        title: 'Set wedding date and book venue',
        description: 'Choose your ideal wedding date and secure your dream venue',
        completed: true,
        eventDate: new Date('2025-06-15'),
      },
      {
        id: 102,
        title: 'Hire wedding planner',
        description: 'Find a professional to help organize your special day',
        completed: true,
        eventDate: new Date('2024-06-20'),
      },
      {
        id: 103,
        title: 'Set budget and guest list',
        description: 'Determine your overall budget and start creating your guest list',
        completed: true,
        eventDate: new Date('2024-06-25'),
      },
    ],
  },
  {
    id: 2,
    title: '9-10 Months Before',
    events: [
      {
        id: 201,
        title: 'Book photographer and videographer',
        description: 'Research and secure your preferred photo & video team',
        completed: true,
        eventDate: new Date('2024-09-15'),
      },
      {
        id: 202,
        title: 'Book caterer and decide on menu',
        description: 'Choose your catering service and plan your menu options',
        completed: false,
        eventDate: new Date('2024-09-20'),
      },
      {
        id: 203,
        title: 'Shop for wedding attire',
        description: 'Start looking for wedding dress, suits, and accessories',
        completed: false,
        eventDate: new Date('2024-09-25'),
      },
    ],
  },
  {
    id: 3,
    title: '6-8 Months Before',
    events: [
      {
        id: 301,
        title: 'Book florist',
        description: 'Choose your florist and discuss floral arrangements',
        completed: false,
        eventDate: new Date('2024-11-15'),
      },
      {
        id: 302,
        title: 'Book entertainment',
        description: 'Hire DJ, band, or other entertainment for the reception',
        completed: false,
        eventDate: new Date('2024-11-20'),
      },
      {
        id: 303,
        title: 'Order wedding cake',
        description: 'Select your baker and design your wedding cake',
        completed: false,
        eventDate: new Date('2024-11-25'),
      },
    ],
  },
  {
    id: 4,
    title: '3-5 Months Before',
    events: [
      {
        id: 401,
        title: 'Send save-the-dates',
        description: 'Send out save-the-date cards to your guest list',
        completed: false,
        eventDate: new Date('2025-02-15'),
      },
      {
        id: 402,
        title: 'Finalize wedding attire',
        description: 'Complete fittings and purchase all wedding attire',
        completed: false,
        eventDate: new Date('2025-02-20'),
      },
    ],
  },
  {
    id: 5,
    title: '1-2 Months Before',
    events: [
      {
        id: 501,
        title: 'Send wedding invitations',
        description: 'Mail out formal invitations to your guests',
        completed: false,
        eventDate: new Date('2025-05-01'),
      },
      {
        id: 502,
        title: 'Finalize details with vendors',
        description: 'Confirm all arrangements with your hired vendors',
        completed: false,
        eventDate: new Date('2025-05-15'),
      },
    ],
  },
];

export default function Timeline() {
  const { toast } = useToast();
  const [selectedEventId, setSelectedEventId] = useState<number>(1);
  const [isAddEventOpen, setIsAddEventOpen] = useState(false);
  const [isAddTimelineOpen, setIsAddTimelineOpen] = useState(false);
  const [selectedTimelineId, setSelectedTimelineId] = useState<number | null>(null);
  const [expandedSections, setExpandedSections] = useState<number[]>([1, 2]);
  const [newTimelineEvent, setNewTimelineEvent] = useState({
    title: '',
    description: '',
    eventDate: '',
  });
  const [newTimeline, setNewTimeline] = useState({
    title: '',
  });

  // Toggle section expansion
  const toggleSection = (sectionId: number) => {
    if (expandedSections.includes(sectionId)) {
      setExpandedSections(expandedSections.filter(id => id !== sectionId));
    } else {
      setExpandedSections([...expandedSections, sectionId]);
    }
  };

  // Handle toggling event completion
  const handleToggleCompletion = (eventId: number, completed: boolean) => {
    toast({
      title: completed ? "Event marked as completed" : "Event marked as incomplete",
      description: "Your timeline has been updated.",
    });
  };

  // Handle adding a new timeline event
  const handleAddTimelineEvent = () => {
    if (!selectedTimelineId) return;
    
    const timelineName = timelineData.find(t => t.id === selectedTimelineId)?.title || '';
    
    toast({
      title: "Event added",
      description: `"${newTimelineEvent.title}" has been added to ${timelineName}.`,
    });
    
    setIsAddEventOpen(false);
    setNewTimelineEvent({
      title: '',
      description: '',
      eventDate: '',
    });
  };

  // Handle adding a new timeline section
  const handleAddTimeline = () => {
    toast({
      title: "Timeline section added",
      description: `"${newTimeline.title}" section has been added to your timeline.`,
    });
    
    setIsAddTimelineOpen(false);
    setNewTimeline({
      title: '',
    });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="pb-3">
          <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
            <div>
              <CardTitle>Event Timeline</CardTitle>
              <CardDescription>
                Organize and track your event planning milestones
              </CardDescription>
            </div>
            <div className="flex flex-col sm:flex-row gap-2">
              <Select value={selectedEventId.toString()} onValueChange={(value) => setSelectedEventId(Number(value))}>
                <SelectTrigger className="w-[240px]">
                  <SelectValue placeholder="Select event" />
                </SelectTrigger>
                <SelectContent>
                  {eventOptions.map(event => (
                    <SelectItem key={event.id} value={event.id.toString()}>
                      {event.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button variant="outline" onClick={() => setIsAddTimelineOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Add Section
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-8">
            {timelineData.map((timeline) => {
              const isExpanded = expandedSections.includes(timeline.id);
              const completedEvents = timeline.events.filter(e => e.completed).length;
              const progress = Math.round((completedEvents / timeline.events.length) * 100);
              
              return (
                <div key={timeline.id} className="space-y-2">
                  <div 
                    className="flex items-center justify-between cursor-pointer hover:bg-muted/50 p-2 rounded"
                    onClick={() => toggleSection(timeline.id)}
                  >
                    <div className="flex items-center">
                      <ChevronDown 
                        className={`h-5 w-5 mr-2 transition-transform ${isExpanded ? 'transform rotate-0' : 'transform -rotate-90'}`} 
                      />
                      <h3 className="text-lg font-medium">{timeline.title}</h3>
                      
                      <div className="ml-2 px-2 py-0.5 bg-muted rounded text-xs">
                        {completedEvents} of {timeline.events.length}
                      </div>
                      
                      <div className="ml-2 w-24 h-2 bg-muted rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-primary"
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                    </div>
                    
                    <div className="flex items-center">
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedTimelineId(timeline.id);
                          setIsAddEventOpen(true);
                        }}
                      >
                        <Plus className="h-4 w-4 mr-1" />
                        Add Event
                      </Button>
                    </div>
                  </div>
                  
                  {isExpanded && (
                    <div className="pl-10 space-y-4">
                      {timeline.events.map((event) => (
                        <div key={event.id} className="border rounded-lg overflow-hidden">
                          <div className={`p-4 ${event.completed ? 'bg-muted/50' : 'bg-card'}`}>
                            <div className="flex items-start justify-between">
                              <div className="flex items-start">
                                <div className="mr-3 mt-1">
                                  <Checkbox 
                                    id={`event-${event.id}`}
                                    checked={event.completed}
                                    onCheckedChange={(checked) => {
                                      handleToggleCompletion(event.id, checked as boolean);
                                    }}
                                  />
                                </div>
                                <div>
                                  <label 
                                    htmlFor={`event-${event.id}`}
                                    className={`font-medium ${event.completed ? 'line-through text-muted-foreground' : ''}`}
                                  >
                                    {event.title}
                                  </label>
                                  {event.description && (
                                    <p className="text-sm text-muted-foreground mt-1">
                                      {event.description}
                                    </p>
                                  )}
                                  <div className="flex items-center mt-2">
                                    <CalendarDays className="h-3 w-3 mr-1 text-muted-foreground" />
                                    <span className="text-xs text-muted-foreground">
                                      {format(event.eventDate, 'MMMM d, yyyy')}
                                    </span>
                                  </div>
                                </div>
                              </div>
                              
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" size="sm">
                                    <MoreHorizontal className="h-4 w-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuItem>
                                    <Edit className="h-4 w-4 mr-2" />
                                    Edit
                                  </DropdownMenuItem>
                                  <DropdownMenuItem 
                                    onClick={() => handleToggleCompletion(event.id, !event.completed)}
                                  >
                                    <Check className="h-4 w-4 mr-2" />
                                    Mark as {event.completed ? 'Incomplete' : 'Complete'}
                                  </DropdownMenuItem>
                                  <DropdownMenuItem className="text-destructive">
                                    <Trash2 className="h-4 w-4 mr-2" />
                                    Delete
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </div>
                          </div>
                        </div>
                      ))}
                      
                      {timeline.events.length === 0 && (
                        <div className="text-center py-6 text-muted-foreground">
                          <Clock className="h-8 w-8 mx-auto mb-2 text-muted-foreground/70" />
                          <p>No events in this timeframe</p>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            className="mt-2"
                            onClick={() => {
                              setSelectedTimelineId(timeline.id);
                              setIsAddEventOpen(true);
                            }}
                          >
                            <Plus className="h-4 w-4 mr-1" />
                            Add Event
                          </Button>
                        </div>
                      )}
                    </div>
                  )}
                  
                  {timeline.id < timelineData.length && <Separator className="my-4" />}
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
      
      {/* Add Timeline Event Dialog */}
      <Dialog open={isAddEventOpen} onOpenChange={setIsAddEventOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Add Timeline Event</DialogTitle>
            <DialogDescription>
              Add a new milestone or task to your timeline.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="event-title">Event Title</Label>
              <Input
                id="event-title"
                value={newTimelineEvent.title}
                onChange={(e) => setNewTimelineEvent({...newTimelineEvent, title: e.target.value})}
                placeholder="e.g., Book photographer, Send invitations"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="event-description">Description (Optional)</Label>
              <Textarea
                id="event-description"
                value={newTimelineEvent.description}
                onChange={(e) => setNewTimelineEvent({...newTimelineEvent, description: e.target.value})}
                placeholder="Add details about this event"
                className="min-h-[80px]"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="event-date">Due Date</Label>
              <div className="flex">
                <Input
                  id="event-date"
                  type="date"
                  value={newTimelineEvent.eventDate}
                  onChange={(e) => setNewTimelineEvent({...newTimelineEvent, eventDate: e.target.value})}
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" onClick={handleAddTimelineEvent}>Add Event</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Add Timeline Section Dialog */}
      <Dialog open={isAddTimelineOpen} onOpenChange={setIsAddTimelineOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Add Timeline Section</DialogTitle>
            <DialogDescription>
              Create a new section for your timeline.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="timeline-title">Section Title</Label>
              <Input
                id="timeline-title"
                value={newTimeline.title}
                onChange={(e) => setNewTimeline({...newTimeline, title: e.target.value})}
                placeholder="e.g., 6 Months Before, Week of Event"
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" onClick={handleAddTimeline}>Add Section</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}