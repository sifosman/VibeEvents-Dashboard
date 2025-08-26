import React, { useState } from "react";
import { Helmet } from "react-helmet";
import { Link, useLocation } from "wouter";
import { 
  CalendarDays, 
  CheckSquare, 
  DollarSign, 
  Plus,
  Trash2,
  Edit
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface Task {
  id: number;
  text: string;
  completed: boolean;
  dueDate: string;
}

interface BudgetItem {
  id: number;
  category: string;
  budgeted: number;
  spent: number;
}

interface CalendarEvent {
  id: number;
  title: string;
  date: string;
  time: string;
  type: string;
}

export default function MyPlanningPage() {
  // Task List State
  const [tasks, setTasks] = useState<Task[]>([
    { id: 1, text: "Book venue", completed: false, dueDate: "2024-02-15" },
    { id: 2, text: "Send invitations", completed: true, dueDate: "2024-02-10" },
    { id: 3, text: "Order flowers", completed: false, dueDate: "2024-02-20" }
  ]);
  const [newTask, setNewTask] = useState("");

  // Budget State
  const [budgetItems, setBudgetItems] = useState<BudgetItem[]>([
    { id: 1, category: "Venue", budgeted: 5000, spent: 4500 },
    { id: 2, category: "Catering", budgeted: 3000, spent: 2800 },
    { id: 3, category: "Photography", budgeted: 2000, spent: 0 },
    { id: 4, category: "Flowers", budgeted: 800, spent: 0 }
  ]);

  // Calendar Events State
  const [calendarEvents, setCalendarEvents] = useState<CalendarEvent[]>([
    { id: 1, title: "Venue Visit", date: "2024-02-15", time: "2:00 PM", type: "meeting" },
    { id: 2, title: "Catering Tasting", date: "2024-02-18", time: "12:00 PM", type: "appointment" },
    { id: 3, title: "Final Dress Fitting", date: "2024-02-25", time: "10:00 AM", type: "appointment" }
  ]);

  // Task Functions
  const addTask = () => {
    if (newTask.trim()) {
      const task: Task = {
        id: Date.now(),
        text: newTask,
        completed: false,
        dueDate: new Date().toISOString().split('T')[0]
      };
      setTasks([...tasks, task]);
      setNewTask("");
    }
  };

  const toggleTask = (id: number) => {
    setTasks(tasks.map(task => 
      task.id === id ? { ...task, completed: !task.completed } : task
    ));
  };

  const deleteTask = (id: number) => {
    setTasks(tasks.filter(task => task.id !== id));
  };

  const totalBudget = budgetItems.reduce((sum, item) => sum + item.budgeted, 0);
  const totalSpent = budgetItems.reduce((sum, item) => sum + item.spent, 0);

  return (
    <>
      <Helmet>
        <title>My Planner | Vibeventz</title>
        <meta name="description" content="Manage your event planning tasks, budget, and calendar" />
      </Helmet>

      <div className="container mx-auto py-4 px-4">
        <h1 className="text-2xl font-display font-bold mb-6">My Planner</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Task List */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2">
                <CheckSquare className="h-5 w-5" />
                Task List
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {/* Add new task */}
              <div className="flex gap-2">
                <Input
                  placeholder="Add new task..."
                  value={newTask}
                  onChange={(e) => setNewTask(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && addTask()}
                  className="h-9"
                />
                <Button onClick={addTask} size="sm">
                  <Plus className="h-4 w-4" />
                </Button>
              </div>

              {/* Task list */}
              <div className="space-y-2 max-h-80 overflow-y-auto">
                {tasks.map((task) => (
                  <div key={task.id} className="flex items-center gap-2 p-2 border rounded">
                    <input
                      type="checkbox"
                      checked={task.completed}
                      onChange={() => toggleTask(task.id)}
                      className="w-4 h-4"
                    />
                    <span className={`flex-1 text-sm ${task.completed ? 'line-through text-muted-foreground' : ''}`}>
                      {task.text}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {task.dueDate}
                    </span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => deleteTask(task.id)}
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                ))}
              </div>

              <div className="text-sm text-muted-foreground">
                {tasks.filter(t => !t.completed).length} remaining of {tasks.length} tasks
              </div>
            </CardContent>
          </Card>

          {/* Budget */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="h-5 w-5" />
                Budget
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {/* Budget summary */}
              <div className="bg-muted/50 p-3 rounded">
                <div className="flex justify-between text-sm">
                  <span>Total Budget:</span>
                  <span className="font-medium">${totalBudget.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Total Spent:</span>
                  <span className="font-medium">${totalSpent.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm font-semibold">
                  <span>Remaining:</span>
                  <span className={totalBudget - totalSpent >= 0 ? 'text-green-600' : 'text-red-600'}>
                    ${(totalBudget - totalSpent).toLocaleString()}
                  </span>
                </div>
              </div>

              {/* Budget items */}
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {budgetItems.map((item) => (
                  <div key={item.id} className="p-2 border rounded">
                    <div className="flex justify-between text-sm font-medium">
                      <span>{item.category}</span>
                      <span>${item.spent} / ${item.budgeted}</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2 mt-1">
                      <div 
                        className={`h-2 rounded-full ${
                          item.spent > item.budgeted ? 'bg-red-500' : 'bg-primary'
                        }`}
                        style={{ width: `${Math.min((item.spent / item.budgeted) * 100, 100)}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Calendar Items */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2">
                <CalendarDays className="h-5 w-5" />
                Calendar Items
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {/* Upcoming events */}
              <div className="space-y-2 max-h-80 overflow-y-auto">
                {calendarEvents.map((event) => (
                  <div key={event.id} className="p-3 border rounded hover:bg-muted/50">
                    <div className="font-medium text-sm">{event.title}</div>
                    <div className="text-xs text-muted-foreground flex justify-between">
                      <span>{event.date}</span>
                      <span>{event.time}</span>
                    </div>
                    <div className="text-xs">
                      <span className={`inline-block px-2 py-1 rounded-full text-white text-xs ${
                        event.type === 'meeting' ? 'bg-blue-500' : 'bg-green-500'
                      }`}>
                        {event.type}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              <Button variant="outline" className="w-full h-9">
                <Plus className="h-4 w-4 mr-2" />
                Add Event
              </Button>
            </CardContent>
          </Card>

        </div>
      </div>
    </>
  );
}