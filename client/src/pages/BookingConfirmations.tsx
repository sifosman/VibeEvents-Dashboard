import React from "react";
import { Helmet } from "react-helmet";
import { useAuth } from "@/context/AuthContext";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { CheckSquare, ChevronLeft, Plus, Upload } from "lucide-react";

export default function BookingConfirmations() {
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
        <title>Booking Confirmations | HowzEventz</title>
        <meta name="description" content="Manage your event bookings and contracts" />
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
                <CheckSquare className="h-7 w-7 mr-3 text-primary" />
                Booking Confirmations
              </h1>
              <p className="text-muted-foreground mt-1">Manage your confirmed bookings and contracts</p>
            </div>
            <Button className="bg-primary text-white">
              <Upload className="h-4 w-4 mr-2" /> Upload Contract
            </Button>
          </div>
        </div>

        {/* Bookings list placeholder */}
        <div className="border rounded-lg p-8 bg-background">
          <div className="text-center py-16">
            <h2 className="text-xl font-medium mb-2">Your Confirmed Bookings</h2>
            <p className="text-muted-foreground mb-6">Keep track of all your vendor contracts in one place</p>
            <Button>
              <Plus className="h-4 w-4 mr-2" /> Add Your First Booking
            </Button>
          </div>
        </div>

        {/* Payment schedule section */}
        <div className="mt-8">
          <h2 className="text-xl font-semibold mb-4">Payment Schedules</h2>
          <div className="border rounded-lg p-6 bg-background">
            <p className="text-center text-muted-foreground py-8">
              Track upcoming payments and deposits for all your vendor bookings.
            </p>
          </div>
        </div>

        {/* Contract checklist */}
        <div className="mt-8">
          <h2 className="text-xl font-semibold mb-4">Contract Checklist</h2>
          <div className="border rounded-lg p-6 bg-background">
            <ul className="space-y-4">
              <li className="flex items-center border-b pb-4">
                <div className="h-5 w-5 border border-primary rounded-sm mr-3 flex-shrink-0"></div>
                <span>Verify vendor contact details and emergency contacts</span>
              </li>
              <li className="flex items-center border-b pb-4">
                <div className="h-5 w-5 border border-primary rounded-sm mr-3 flex-shrink-0"></div>
                <span>Check payment schedule and amounts</span>
              </li>
              <li className="flex items-center border-b pb-4">
                <div className="h-5 w-5 border border-primary rounded-sm mr-3 flex-shrink-0"></div>
                <span>Confirm cancellation and refund policies</span>
              </li>
              <li className="flex items-center border-b pb-4">
                <div className="h-5 w-5 border border-primary rounded-sm mr-3 flex-shrink-0"></div>
                <span>Verify service details and included items</span>
              </li>
              <li className="flex items-center pb-4">
                <div className="h-5 w-5 border border-primary rounded-sm mr-3 flex-shrink-0"></div>
                <span>Confirm setup and breakdown times</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Tips for contracts */}
        <div className="mt-8 bg-accent/20 rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-2">Contract Management Tips</h2>
          <p className="text-muted-foreground mb-4">Protect yourself with proper contract management</p>
          <ul className="space-y-2">
            <li className="flex items-start">
              <span className="text-primary font-bold mr-2">•</span>
              <span>Always read the full contract before signing</span>
            </li>
            <li className="flex items-start">
              <span className="text-primary font-bold mr-2">•</span>
              <span>Keep digital copies of all signed contracts in this section</span>
            </li>
            <li className="flex items-start">
              <span className="text-primary font-bold mr-2">•</span>
              <span>Set calendar reminders for payment due dates</span>
            </li>
            <li className="flex items-start">
              <span className="text-primary font-bold mr-2">•</span>
              <span>Get written confirmation of any changes to the original agreement</span>
            </li>
          </ul>
        </div>
      </div>
    </>
  );
}