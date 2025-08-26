import React from "react";
import { Helmet } from "react-helmet";
import { useAuth } from "@/context/AuthContext";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Wallet, ChevronLeft, Plus, Download, PieChart } from "lucide-react";
import { Progress } from "@/components/ui/progress";

export default function BudgetTracker() {
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
        <title>Budget Tracker | HowzEventz</title>
        <meta name="description" content="Track expenses and stay on budget for your event" />
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
                <Wallet className="h-7 w-7 mr-3 text-primary" />
                Budget Tracker
              </h1>
              <p className="text-muted-foreground mt-1">Track expenses and stay on budget for your event</p>
            </div>
            <div className="flex space-x-2">
              <Button variant="outline">
                <Download className="h-4 w-4 mr-2" /> Export
              </Button>
              <Button className="bg-primary text-white">
                <Plus className="h-4 w-4 mr-2" /> Add Expense
              </Button>
            </div>
          </div>
        </div>

        {/* Budget overview section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div className="lg:col-span-2">
            <div className="border rounded-lg p-6 bg-background h-full">
              <h2 className="text-xl font-semibold mb-4">Budget Overview</h2>
              
              <div className="space-y-6">
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="font-medium">Total Budget</span>
                    <span className="font-semibold">R0.00</span>
                  </div>
                  <Progress value={0} className="h-2" />
                </div>
                
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="font-medium">Venue</span>
                    <span>R0.00 / R0.00</span>
                  </div>
                  <Progress value={0} className="h-2" />
                </div>
                
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="font-medium">Catering</span>
                    <span>R0.00 / R0.00</span>
                  </div>
                  <Progress value={0} className="h-2" />
                </div>
                
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="font-medium">Decorations</span>
                    <span>R0.00 / R0.00</span>
                  </div>
                  <Progress value={0} className="h-2" />
                </div>
                
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="font-medium">Entertainment</span>
                    <span>R0.00 / R0.00</span>
                  </div>
                  <Progress value={0} className="h-2" />
                </div>
              </div>
            </div>
          </div>
          
          <div>
            <div className="border rounded-lg p-6 bg-background h-full">
              <h2 className="text-xl font-semibold mb-4">Expense Distribution</h2>
              <div className="flex items-center justify-center py-10">
                <div className="flex flex-col items-center">
                  <PieChart className="h-20 w-20 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground mt-4">
                    Add expenses to see your budget distribution
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Expenses list placeholder */}
        <div className="border rounded-lg p-6 bg-background mb-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Expenses</h2>
            <Button size="sm">
              <Plus className="h-4 w-4 mr-2" /> Add Expense
            </Button>
          </div>
          
          <div className="text-center py-10">
            <p className="text-muted-foreground mb-6">
              You haven't added any expenses yet. Click the button above to add your first expense.
            </p>
          </div>
        </div>

        {/* Budget templates section */}
        <div className="mt-8">
          <h2 className="text-xl font-semibold mb-4">Budget Templates</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="border rounded-lg p-5 bg-background">
              <h3 className="font-medium mb-2">Small Wedding</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Budget template for weddings with 50 guests or fewer
              </p>
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" /> Use Template
              </Button>
            </div>
            <div className="border rounded-lg p-5 bg-background">
              <h3 className="font-medium mb-2">Corporate Conference</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Budget breakdown for business events and conferences
              </p>
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" /> Use Template
              </Button>
            </div>
            <div className="border rounded-lg p-5 bg-background">
              <h3 className="font-medium mb-2">Birthday Party</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Budget outline for milestone birthday celebrations
              </p>
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" /> Use Template
              </Button>
            </div>
          </div>
        </div>

        {/* Tips for budgeting */}
        <div className="mt-8 bg-accent/20 rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-2">Budgeting Tips</h2>
          <p className="text-muted-foreground mb-4">Making the most of your event budget</p>
          <ul className="space-y-2">
            <li className="flex items-start">
              <span className="text-primary font-bold mr-2">•</span>
              <span>Start with your total budget and allocate percentages to each category</span>
            </li>
            <li className="flex items-start">
              <span className="text-primary font-bold mr-2">•</span>
              <span>Include a 10-15% buffer for unexpected expenses</span>
            </li>
            <li className="flex items-start">
              <span className="text-primary font-bold mr-2">•</span>
              <span>Track all expenses in real-time to avoid overspending</span>
            </li>
            <li className="flex items-start">
              <span className="text-primary font-bold mr-2">•</span>
              <span>Consider off-peak dates and times to save on venue costs</span>
            </li>
          </ul>
        </div>
      </div>
    </>
  );
}