import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/context/AuthContext";
import { apiRequest } from "@/lib/queryClient";
import { TimelineEvent, insertTimelineEventSchema } from "@shared/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { formatDate } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Checkbox } from "@/components/ui/checkbox";
import { CalendarIcon, Check, Clock, Hourglass, Plus, Trash2 } from "lucide-react";

const timelineFormSchema = insertTimelineEventSchema.extend({
  eventDate: z.date().optional(),
});

type TimelineFormValues = z.infer<typeof timelineFormSchema>;

export default function Timeline() {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isAddEventOpen, setIsAddEventOpen] = useState(false);

  const { data: events, isLoading } = useQuery<TimelineEvent[]>({
    queryKey: [user ? `/api/timeline?userId=${user.id}` : null],
    enabled: !!user,
  });

  const createMutation = useMutation({
    mutationFn: async (eventData: TimelineFormValues) => {
      return apiRequest('POST', '/api/timeline', eventData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/timeline?userId=${user?.id}`] });
      toast({
        title: "Event created",
        description: "Your event has been added to the timeline.",
      });
      setIsAddEventOpen(false);
    },
  });

  const updateCompletedMutation = useMutation({
    mutationFn: async ({ id, completed }: { id: number; completed: boolean }) => {
      return apiRequest('PATCH', `/api/timeline/${id}/completed`, { completed });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/timeline?userId=${user?.id}`] });
      toast({
        title: "Timeline updated",
        description: "Your timeline has been updated.",
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (eventId: number) => {
      return apiRequest('DELETE', `/api/timeline/${eventId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/timeline?userId=${user?.id}`] });
      toast({
        title: "Event deleted",
        description: "The event has been removed from your timeline.",
      });
    },
  });

  const form = useForm<TimelineFormValues>({
    resolver: zodResolver(timelineFormSchema),
    defaultValues: {
      userId: user?.id,
      title: "",
      description: "",
      eventDate: undefined,
      completed: false,
    },
  });

  const onSubmit = (data: TimelineFormValues) => {
    createMutation.mutate(data);
  };

  const handleToggleComplete = (event: TimelineEvent) => {
    updateCompletedMutation.mutate({ id: event.id, completed: !event.completed });
  };

  const handleDelete = (eventId: number) => {
    if (confirm("Are you sure you want to delete this timeline event?")) {
      deleteMutation.mutate(eventId);
    }
  };

  // Helper to determine if date is in past, present or future
  const getTimePosition = (date?: Date | string | null): 'past' | 'present' | 'future' => {
    if (!date) return 'future';
    
    const eventDate = new Date(date);
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    
    if (eventDate < today) return 'past';
    if (eventDate.getTime() === today.getTime()) return 'present';
    return 'future';
  };

  // Sort events chronologically
  const sortedEvents = events?.slice().sort((a, b) => {
    if (!a.eventDate) return 1;
    if (!b.eventDate) return -1;
    return new Date(a.eventDate).getTime() - new Date(b.eventDate).getTime();
  });

  if (isLoading) {
    return (
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Wedding Timeline</CardTitle>
          <div className="animate-pulse w-20 h-8 bg-gray-200 rounded"></div>
        </CardHeader>
        <CardContent>
          <div className="relative">
            <div className="absolute inset-y-0 left-4 w-0.5 bg-gray-200"></div>
            
            {[1, 2, 3].map((i) => (
              <div key={i} className="relative mb-6 animate-pulse">
                <div className="flex items-start">
                  <div className="flex flex-col items-center">
                    <div className="flex z-10 justify-center items-center bg-gray-200 w-8 h-8 rounded-full"></div>
                    <div className="ml-4 mt-1 w-16 h-4 bg-gray-100 rounded"></div>
                  </div>
                  <div className="ml-4 mt-1">
                    <div className="h-5 bg-gray-200 rounded w-40 mb-2"></div>
                    <div className="h-4 bg-gray-100 rounded w-64"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Wedding Timeline</CardTitle>
        <Dialog open={isAddEventOpen} onOpenChange={setIsAddEventOpen}>
          <DialogTrigger asChild>
            <Button className="bg-primary text-white hover:bg-primary/90">
              <Plus className="h-4 w-4 mr-1" />
              Add Event
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Timeline Event</DialogTitle>
              <DialogDescription>
                Create a new milestone for your event planning journey.
              </DialogDescription>
            </DialogHeader>
            
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Event Title</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter event title" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Enter event details" 
                          className="resize-none" 
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="eventDate"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Event Date</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant={"outline"}
                              className={
                                "w-full pl-3 text-left font-normal"
                              }
                            >
                              {field.value ? (
                                formatDate(field.value)
                              ) : (
                                <span>Pick a date</span>
                              )}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="completed"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>
                          Mark as Completed
                        </FormLabel>
                        <FormDescription>
                          Check this if the event has already happened
                        </FormDescription>
                      </div>
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="userId"
                  render={({ field }) => (
                    <input type="hidden" {...field} value={user?.id} />
                  )}
                />
                
                <DialogFooter>
                  <Button 
                    type="submit" 
                    className="bg-primary text-white hover:bg-primary/90"
                    disabled={createMutation.isPending}
                  >
                    {createMutation.isPending ? "Creating..." : "Create Event"}
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
        {!sortedEvents || sortedEvents.length === 0 ? (
          <div className="text-center py-10">
            <h3 className="text-lg font-medium mb-2">No timeline events yet</h3>
            <p className="text-muted-foreground mb-6">Build your event journey with important milestones</p>
            <Button 
              className="bg-primary text-white hover:bg-primary/90"
              onClick={() => setIsAddEventOpen(true)}
            >
              <Plus className="h-4 w-4 mr-1" />
              Add Your First Event
            </Button>
          </div>
        ) : (
          <div className="relative">
            <div className="absolute inset-y-0 left-4 w-0.5 bg-gray-200" aria-hidden="true"></div>
            
            {sortedEvents.map((event, index) => {
              const timePosition = getTimePosition(event.eventDate);
              let icon;
              let bgColor;
              
              if (event.completed) {
                icon = <Check className="h-4 w-4 text-white" />;
                bgColor = "bg-primary";
              } else {
                if (timePosition === 'present') {
                  icon = <Hourglass className="h-4 w-4 text-white" />;
                  bgColor = "bg-[#6A8C7D]";
                } else if (timePosition === 'future') {
                  icon = <span className="text-white text-xs">{index + 1}</span>;
                  bgColor = "bg-gray-300";
                } else {
                  icon = <Clock className="h-4 w-4 text-white" />;
                  bgColor = "bg-gray-400";
                }
              }
              
              return (
                <div key={event.id} className="relative mb-6 group">
                  <div className="flex items-start">
                    <div className="flex flex-col items-center">
                      <div className={`flex z-10 justify-center items-center ${bgColor} w-8 h-8 rounded-full`}>
                        {icon}
                      </div>
                      <div className="ml-4 mt-1">
                        <span className="text-xs text-muted-foreground">
                          {event.eventDate ? formatDate(event.eventDate) : 'No date set'}
                        </span>
                      </div>
                    </div>
                    <div className="ml-4 mt-1 relative">
                      <h4 className="font-medium flex items-center">
                        {event.title}
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-6 w-6 text-destructive opacity-0 group-hover:opacity-100 transition-opacity ml-2" 
                          onClick={() => handleDelete(event.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </h4>
                      <p className="text-sm text-muted-foreground">{event.description}</p>
                      
                      <div className="mt-2">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="text-xs h-7" 
                          onClick={() => handleToggleComplete(event)}
                        >
                          {event.completed ? "Mark as Incomplete" : "Mark as Complete"}
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
