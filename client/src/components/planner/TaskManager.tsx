import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/context/AuthContext";
import { apiRequest } from "@/lib/queryClient";
import { Task, insertTaskSchema } from "@shared/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { formatDate, getPriorityColor } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
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
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon, Plus, Trash2 } from "lucide-react";

const taskFormSchema = insertTaskSchema.extend({
  dueDate: z.date().optional(),
});

type TaskFormValues = z.infer<typeof taskFormSchema>;

export default function TaskManager() {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isAddTaskOpen, setIsAddTaskOpen] = useState(false);

  const { data: tasks, isLoading } = useQuery<Task[]>({
    queryKey: [user ? `/api/tasks?userId=${user.id}` : null],
    enabled: !!user,
  });

  const createMutation = useMutation({
    mutationFn: async (taskData: TaskFormValues) => {
      return apiRequest('POST', '/api/tasks', taskData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/tasks?userId=${user?.id}`] });
      toast({
        title: "Task created",
        description: "Your task has been added to the list.",
      });
      setIsAddTaskOpen(false);
    },
  });

  const updateStatusMutation = useMutation({
    mutationFn: async ({ id, status }: { id: number; status: string }) => {
      return apiRequest('PATCH', `/api/tasks/${id}/status`, { status });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/tasks?userId=${user?.id}`] });
      toast({
        title: "Task updated",
        description: "Task status has been updated.",
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (taskId: number) => {
      return apiRequest('DELETE', `/api/tasks/${taskId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/tasks?userId=${user?.id}`] });
      toast({
        title: "Task deleted",
        description: "The task has been removed from your list.",
      });
    },
  });

  const form = useForm<TaskFormValues>({
    resolver: zodResolver(taskFormSchema),
    defaultValues: {
      userId: user?.id,
      title: "",
      description: "",
      priority: "medium",
      status: "pending",
      assignedTo: "",
      assigneeRole: "",
    },
  });

  const onSubmit = (data: TaskFormValues) => {
    createMutation.mutate(data);
  };

  const handleToggleComplete = (task: Task) => {
    const newStatus = task.status === "completed" ? "pending" : "completed";
    updateStatusMutation.mutate({ id: task.id, status: newStatus });
  };

  const handleDelete = (taskId: number) => {
    if (confirm("Are you sure you want to delete this task?")) {
      deleteMutation.mutate(taskId);
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Team Tasks</CardTitle>
          <div className="animate-pulse w-20 h-8 bg-gray-200 rounded"></div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="p-3 border border-gray-200 rounded animate-pulse">
                <div className="flex justify-between items-start mb-2">
                  <div className="flex items-center">
                    <div className="w-4 h-4 bg-gray-200 rounded-sm mr-3"></div>
                    <div className="h-5 bg-gray-300 rounded w-40"></div>
                  </div>
                  <div className="w-16 h-6 bg-gray-200 rounded"></div>
                </div>
                <div className="pl-7">
                  <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
                  <div className="h-4 bg-gray-100 rounded w-3/4 mb-3"></div>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center">
                      <div className="w-6 h-6 bg-gray-200 rounded-full"></div>
                      <div className="h-4 w-24 bg-gray-100 rounded ml-2"></div>
                    </div>
                    <div className="h-4 w-20 bg-gray-100 rounded"></div>
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
        <CardTitle>Team Tasks</CardTitle>
        <Dialog open={isAddTaskOpen} onOpenChange={setIsAddTaskOpen}>
          <DialogTrigger asChild>
            <Button className="bg-primary text-white hover:bg-primary/90">
              <Plus className="h-4 w-4 mr-1" />
              Add Task
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Task</DialogTitle>
              <DialogDescription>
                Create a new task and assign it to a team member.
              </DialogDescription>
            </DialogHeader>
            
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Task Title</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter task title" {...field} />
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
                          placeholder="Enter task details" 
                          className="resize-none" 
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="priority"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Priority</FormLabel>
                        <Select 
                          onValueChange={field.onChange} 
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select priority" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="low">Low</SelectItem>
                            <SelectItem value="medium">Medium</SelectItem>
                            <SelectItem value="high">High</SelectItem>
                            <SelectItem value="urgent">Urgent</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="dueDate"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel>Due Date</FormLabel>
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
                              disabled={(date) =>
                                date < new Date(new Date().setHours(0, 0, 0, 0))
                              }
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="assignedTo"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Assigned To</FormLabel>
                        <FormControl>
                          <Input placeholder="Name of assignee" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="assigneeRole"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Role</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g. Maid of Honor" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
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
                    {createMutation.isPending ? "Creating..." : "Create Task"}
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
        {!tasks || tasks.length === 0 ? (
          <div className="text-center py-10">
            <h3 className="text-lg font-medium mb-2">No tasks yet</h3>
            <p className="text-muted-foreground mb-6">Start by adding tasks and assigning them to your team</p>
            <Button 
              className="bg-primary text-white hover:bg-primary/90"
              onClick={() => setIsAddTaskOpen(true)}
            >
              <Plus className="h-4 w-4 mr-1" />
              Add Your First Task
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {tasks.map((task) => (
              <div key={task.id} className="p-3 border border-gray-200 rounded hover:bg-accent/20 transition-colors">
                <div className="flex justify-between items-start mb-2">
                  <div className="flex items-center">
                    <Checkbox 
                      id={`task-${task.id}`} 
                      className="mr-3 h-4 w-4 text-primary border-gray-300 rounded" 
                      checked={task.status === "completed"}
                      onCheckedChange={() => handleToggleComplete(task)}
                    />
                    <label 
                      htmlFor={`task-${task.id}`} 
                      className={`font-medium ${task.status === "completed" ? "line-through text-muted-foreground" : ""}`}
                    >
                      {task.title}
                    </label>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`text-xs px-2 py-1 rounded ${getPriorityColor(task.priority)}`}>
                      {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
                    </span>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-6 w-6 text-destructive" 
                      onClick={() => handleDelete(task.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <div className="pl-7">
                  {task.description && (
                    <p className={`text-sm text-muted-foreground mb-2 ${task.status === "completed" ? "line-through" : ""}`}>
                      {task.description}
                    </p>
                  )}
                  <div className="flex justify-between items-center mt-2">
                    {task.assignedTo ? (
                      <div className="flex items-center">
                        <div className="w-6 h-6 rounded-full bg-primary text-white flex items-center justify-center text-xs">
                          {task.assignedTo.charAt(0)}
                        </div>
                        <span className="text-xs text-muted-foreground ml-2">
                          {task.assignedTo} {task.assigneeRole ? `(${task.assigneeRole})` : ''}
                        </span>
                      </div>
                    ) : (
                      <span className="text-xs text-muted-foreground">Unassigned</span>
                    )}
                    {task.dueDate && (
                      <span className="text-xs text-muted-foreground">
                        Due {formatDate(task.dueDate)}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
