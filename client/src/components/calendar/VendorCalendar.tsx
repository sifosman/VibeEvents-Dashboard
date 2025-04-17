import React, { useState, useEffect } from 'react';
import Calendar from 'react-calendar';
import { useQuery, useMutation } from '@tanstack/react-query';
import { queryClient } from '@/lib/queryClient';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';
import { Loader2, Clock, MapPin, Calendar as CalendarIcon } from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { CalendarEvent } from '@shared/schema';
import 'react-calendar/dist/Calendar.css';

interface VendorCalendarProps {
  vendorId: number;
  userId?: number; // Optional - only needed for booking
  vendorName?: string;
}

export function VendorCalendar({ vendorId, userId, vendorName }: VendorCalendarProps) {
  const { toast } = useToast();
  const [date, setDate] = useState<Date>(new Date());
  const [view, setView] = useState<'calendar' | 'booking'>('calendar');
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string | null>(null);
  const [bookingDetails, setBookingDetails] = useState({
    title: '',
    description: '',
    location: '',
  });

  // Get first day and last day of the selected month
  const monthStart = new Date(date.getFullYear(), date.getMonth(), 1);
  const monthEnd = new Date(date.getFullYear(), date.getMonth() + 1, 0);

  // Fetch events for the selected vendor for the current month view
  const { data: events, isLoading: eventsLoading } = useQuery<CalendarEvent[]>({
    queryKey: ['/api/calendar-events', {
      vendorId, 
      startDate: monthStart.toISOString(),
      endDate: monthEnd.toISOString()
    }],
  });

  // Get specific day events when a day is selected
  const { data: dayEvents, isLoading: dayEventsLoading } = useQuery<CalendarEvent[]>({
    queryKey: ['/api/calendar-events', {
      vendorId,
      startDate: date.toISOString(),
      endDate: new Date(date.getFullYear(), date.getMonth(), date.getDate(), 23, 59, 59).toISOString()
    }],
    enabled: view === 'booking',
  });

  // Create a new calendar event (booking)
  const createEventMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await fetch('/api/calendar-events', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      
      if (!response.ok) {
        const error = await response.text();
        throw new Error(error || 'Failed to create booking');
      }
      
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: 'Booking created',
        description: 'Your booking has been successfully created',
      });
      queryClient.invalidateQueries({ queryKey: ['/api/calendar-events'] });
      setView('calendar');
      setSelectedTimeSlot(null);
      setBookingDetails({
        title: '',
        description: '',
        location: '',
      });
    },
    onError: (error: Error) => {
      toast({
        title: 'Booking failed',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  // Generate time slots for booking (9 AM to 5 PM, hourly slots)
  const timeSlots = Array.from({ length: 9 }, (_, i) => {
    const hour = i + 9;
    return `${hour % 12 || 12}:00 ${hour >= 12 ? 'PM' : 'AM'}`;
  });

  // Check if a time slot is available (not blocked by existing events)
  const isTimeSlotAvailable = (timeSlot: string) => {
    if (!dayEvents) return true;
    
    // Parse the time slot string to get hours
    const [time, meridiem] = timeSlot.split(' ');
    const [hours] = time.split(':').map(Number);
    const adjustedHours = meridiem === 'PM' && hours !== 12 ? hours + 12 : hours;
    
    // Check if any events overlap with this time slot
    return !dayEvents.some(event => {
      const startDate = new Date(event.startDate);
      const endDate = new Date(event.endDate);
      const slotStart = new Date(date);
      slotStart.setHours(adjustedHours, 0, 0, 0);
      const slotEnd = new Date(date);
      slotEnd.setHours(adjustedHours + 1, 0, 0, 0);
      
      return (
        (startDate <= slotStart && endDate > slotStart) || 
        (startDate >= slotStart && startDate < slotEnd)
      );
    });
  };

  // Get classes for calendar tile (to highlight days with events)
  const getTileClassName = ({ date, view }: { date: Date; view: string }) => {
    if (view !== 'month') return '';
    
    const hasEvent = events?.some(event => {
      const eventStart = new Date(event.startDate);
      const eventEnd = new Date(event.endDate);
      const dayStart = new Date(date);
      dayStart.setHours(0, 0, 0, 0);
      const dayEnd = new Date(date);
      dayEnd.setHours(23, 59, 59, 999);
      
      return (eventStart <= dayEnd && eventEnd >= dayStart);
    });
    
    const isFullyBooked = events?.some(event => {
      const eventDate = new Date(event.startDate);
      return (
        eventDate.getDate() === date.getDate() &&
        eventDate.getMonth() === date.getMonth() &&
        eventDate.getFullYear() === date.getFullYear() &&
        event.type === 'block' && event.allDay
      );
    });
    
    if (isFullyBooked) return 'bg-red-100 text-red-800 rounded';
    if (hasEvent) return 'bg-blue-100 text-blue-800 rounded';
    return '';
  };

  const handleCreateBooking = () => {
    if (!userId) {
      toast({
        title: 'Login required',
        description: 'You need to be logged in to make a booking',
        variant: 'destructive',
      });
      return;
    }
    
    if (!selectedTimeSlot) {
      toast({
        title: 'Time required',
        description: 'Please select a time slot for your booking',
        variant: 'destructive',
      });
      return;
    }
    
    // Parse the selected time
    const [time, meridiem] = selectedTimeSlot.split(' ');
    const [hours] = time.split(':').map(Number);
    const adjustedHours = meridiem === 'PM' && hours !== 12 ? hours + 12 : hours;
    
    // Create start and end dates for the booking (1 hour duration)
    const startDate = new Date(date);
    startDate.setHours(adjustedHours, 0, 0, 0);
    
    const endDate = new Date(date);
    endDate.setHours(adjustedHours + 1, 0, 0, 0);
    
    // Prepare the booking data
    const bookingData = {
      vendorId,
      userId,
      title: bookingDetails.title || `Booking with ${vendorName || 'vendor'}`,
      description: bookingDetails.description,
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString(),
      location: bookingDetails.location,
      status: 'pending',
      type: 'booking',
      allDay: false,
      notificationsEnabled: true,
    };
    
    createEventMutation.mutate(bookingData);
  };

  return (
    <div className="space-y-4">
      {view === 'calendar' ? (
        <>
          <div className="bg-white p-4 rounded-lg shadow">
            {eventsLoading ? (
              <div className="flex justify-center items-center py-8">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : (
              <Calendar
                onChange={(value) => {
                  if (value instanceof Date) {
                    setDate(value);
                    setView('booking');
                  }
                }}
                value={date}
                tileClassName={getTileClassName}
                className="w-full border-none"
              />
            )}
          </div>
          <div className="flex items-center justify-around">
            <div className="flex items-center">
              <div className="w-4 h-4 rounded bg-blue-100 mr-2"></div>
              <span className="text-sm">Available</span>
            </div>
            <div className="flex items-center">
              <div className="w-4 h-4 rounded bg-red-100 mr-2"></div>
              <span className="text-sm">Fully Booked</span>
            </div>
          </div>
        </>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <CalendarIcon className="mr-2 h-5 w-5" />
              <span>{date.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
            </CardTitle>
            <CardDescription>
              Select a time slot to book with {vendorName || 'this vendor'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {dayEventsLoading ? (
              <div className="flex justify-center py-4">
                <Loader2 className="h-6 w-6 animate-spin text-primary" />
              </div>
            ) : (
              <>
                <div className="grid grid-cols-3 gap-2 mb-4">
                  {timeSlots.map((slot) => {
                    const available = isTimeSlotAvailable(slot);
                    return (
                      <Button
                        key={slot}
                        variant={selectedTimeSlot === slot ? "default" : "outline"}
                        className={available ? "" : "opacity-50 cursor-not-allowed"}
                        disabled={!available}
                        onClick={() => setSelectedTimeSlot(slot)}
                      >
                        <Clock className="mr-1 h-4 w-4" />
                        {slot}
                      </Button>
                    );
                  })}
                </div>
                
                {selectedTimeSlot && (
                  <div className="space-y-3 mt-6">
                    <div className="space-y-1">
                      <label className="text-sm font-medium">Event Title</label>
                      <input
                        type="text"
                        className="w-full p-2 border rounded"
                        placeholder="Meeting with vendor"
                        value={bookingDetails.title}
                        onChange={(e) => setBookingDetails({...bookingDetails, title: e.target.value})}
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-sm font-medium">Description (optional)</label>
                      <textarea
                        className="w-full p-2 border rounded"
                        rows={3}
                        placeholder="Details about the meeting..."
                        value={bookingDetails.description}
                        onChange={(e) => setBookingDetails({...bookingDetails, description: e.target.value})}
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-sm font-medium">Location (optional)</label>
                      <div className="flex">
                        <MapPin className="h-5 w-5 mr-2 text-gray-400 mt-2" />
                        <input
                          type="text"
                          className="w-full p-2 border rounded"
                          placeholder="Meeting location"
                          value={bookingDetails.location}
                          onChange={(e) => setBookingDetails({...bookingDetails, location: e.target.value})}
                        />
                      </div>
                    </div>
                  </div>
                )}
              </>
            )}
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" onClick={() => setView('calendar')}>
              Back to Calendar
            </Button>
            <Button 
              onClick={handleCreateBooking} 
              disabled={!selectedTimeSlot || createEventMutation.isPending}
            >
              {createEventMutation.isPending && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              Book Now
            </Button>
          </CardFooter>
        </Card>
      )}
    </div>
  );
}

export default VendorCalendar;