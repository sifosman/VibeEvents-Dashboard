import { db } from '../server/db';
import { calendarEvents } from '../shared/schema';

// Function to add months to a date
function addMonths(date: Date, months: number): Date {
  const result = new Date(date);
  result.setMonth(result.getMonth() + months);
  return result;
}

async function addSampleCalendarEvents() {
  try {
    console.log('Adding sample calendar events...');
    // We'll use vendor ID 5 (Gourmet Catering Co)
    const vendorId = 5;
    
    // Current date information
    const today = new Date();
    const currentMonth = today.getMonth();
    const currentYear = today.getFullYear();
    
    // Sample events spanning over the next 3 months
    const sampleEvents = [
      // Available dates (full days)
      {
        vendorId,
        title: 'Available for Bookings',
        description: 'Full day availability for any event type',
        startDate: new Date(currentYear, currentMonth, 10, 0, 0),
        endDate: new Date(currentYear, currentMonth, 10, 23, 59),
        allDay: true,
        type: 'availability',
        color: '#4CAF50', // Green
      },
      {
        vendorId,
        title: 'Open for Bookings',
        description: 'Available for catering services',
        startDate: new Date(currentYear, currentMonth, 15, 0, 0),
        endDate: new Date(currentYear, currentMonth, 15, 23, 59),
        allDay: true,
        type: 'availability',
        color: '#4CAF50', // Green
      },
      
      // Blocked days (vendor unavailable)
      {
        vendorId,
        title: 'Not Available',
        description: 'Vendor is fully booked',
        startDate: new Date(currentYear, currentMonth, 5, 0, 0),
        endDate: new Date(currentYear, currentMonth, 5, 23, 59),
        allDay: true,
        type: 'block',
        color: '#F44336', // Red
      },
      {
        vendorId,
        title: 'Staff Training Day',
        description: 'Closed for staff training',
        startDate: new Date(currentYear, currentMonth, 20, 0, 0),
        endDate: new Date(currentYear, currentMonth, 20, 23, 59),
        allDay: true,
        type: 'block',
        color: '#F44336', // Red
      },
      
      // Actual bookings
      {
        vendorId,
        userId: 1,
        title: 'Wedding Reception - Johnson Family',
        description: 'Catering for 100 guests, Mediterranean menu',
        startDate: new Date(currentYear, currentMonth, 25, 16, 0),
        endDate: new Date(currentYear, currentMonth, 25, 22, 0),
        allDay: false,
        location: 'Diamond Event Center, Cape Town',
        status: 'confirmed',
        type: 'booking',
        color: '#2196F3', // Blue
      },
      {
        vendorId,
        userId: 2,
        title: 'Corporate Lunch - Tech Solutions Inc.',
        description: 'Business lunch for 30 people, healthy options required',
        startDate: new Date(currentYear, currentMonth, 12, 11, 30),
        endDate: new Date(currentYear, currentMonth, 12, 14, 0),
        allDay: false,
        location: 'Tech Solutions Office, Sandton',
        status: 'confirmed',
        type: 'booking',
        color: '#2196F3', // Blue
      },
      
      // Next month
      {
        vendorId,
        title: 'Vacation Week',
        description: 'Annual staff holiday',
        startDate: new Date(currentYear, currentMonth + 1, 1, 0, 0),
        endDate: new Date(currentYear, currentMonth + 1, 7, 23, 59),
        allDay: true,
        type: 'block',
        color: '#F44336', // Red
      },
      {
        vendorId,
        userId: 3,
        title: 'Birthday Party - Smith Family',
        description: 'Sweet 16 celebration with dessert buffet',
        startDate: new Date(currentYear, currentMonth + 1, 15, 18, 0),
        endDate: new Date(currentYear, currentMonth + 1, 15, 22, 0),
        allDay: false,
        location: 'Smith Residence, Pretoria',
        status: 'confirmed',
        type: 'booking',
        color: '#2196F3', // Blue
      },
      
      // Far future event
      {
        vendorId,
        userId: 1,
        title: 'Wedding Anniversary Dinner',
        description: 'Private chef service for 10th anniversary',
        startDate: addMonths(today, 3),
        endDate: new Date(addMonths(today, 3).setHours(addMonths(today, 3).getHours() + 4)),
        allDay: false,
        location: 'Client Home, Johannesburg',
        status: 'tentative',
        type: 'booking',
        color: '#FF9800', // Orange for tentative
      },
    ];

    // Insert all sample events
    const insertedEvents = await db.insert(calendarEvents).values(sampleEvents).returning();
    
    console.log(`Successfully added ${insertedEvents.length} sample calendar events.`);
    console.log('Sample events:', insertedEvents.map(e => ({
      id: e.id,
      title: e.title,
      startDate: e.startDate,
      type: e.type
    })));
    
    console.log('Done!');
    
  } catch (error) {
    console.error('Error adding sample calendar events:', error);
  } finally {
    process.exit(0);
  }
}

// Run the function
addSampleCalendarEvents();