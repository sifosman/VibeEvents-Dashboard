import React, { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
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
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import {
  Plus,
  MoreHorizontal,
  Edit,
  Trash2,
  CheckCircle2,
  Calendar,
  Clock,
  AlertCircle,
  Filter,
  SortAsc,
  SortDesc,
  XCircle,
  User,
  Users,
} from 'lucide-react';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { format } from 'date-fns';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

// Sample event options
const eventOptions = [
  { id: 1, name: "Sarah & Michael's Wedding" },
  { id: 2, name: "Corporate Annual Gala" },
  { id: 3, name: "Emily's 30th Birthday" },
];

// Sample tasks data
const sampleTasks = [
  {
    id: 1,
    title: 'Book venue for ceremony and reception',
    description: 'Find and secure a venue that fits our budget and capacity requirements',
    status: 'completed',
    priority: 'high',
    dueDate: new Date('2024-06-30'),
    assignedTo: 'Sarah',
    assigneeRole: 'Bride',
    createdAt: new Date('2024-06-01'),
  },
  {
    id: 2,
    title: 'Research and hire photographer',
    description: 'Find a photographer with availability on our wedding date',
    status: 'in-progress',
    priority: 'high',
    dueDate: new Date('2024-07-15'),
    assignedTo: 'Michael',
    assigneeRole: 'Groom',
    createdAt: new Date('2024-06-05'),
  },
  {
    id: 3,
    title: 'Secure catering services',
    description: 'Find a caterer and schedule menu tasting',
    status: 'pending',
    priority: 'medium',
    dueDate: new Date('2024-07-30'),
    assignedTo: null,
    assigneeRole: null,
    createdAt: new Date('2024-06-10'),
  },
  {
    id: 4,
    title: 'Order wedding cake',
    description: 'Research bakeries and place an order for the wedding cake',
    status: 'pending',
    priority: 'medium',
    dueDate: new Date('2024-08-15'),
    assignedTo: null,
    assigneeRole: null,
    createdAt: new Date('2024-06-15'),
  },
  {
    id: 5,
    title: 'Book entertainment',
    description: 'Hire DJ or band for the reception',
    status: 'pending',
    priority: 'low',
    dueDate: new Date('2024-08-30'),
    assignedTo: 'Sarah',
    assigneeRole: 'Bride',
    createdAt: new Date('2024-06-20'),
  },
];

export default function TaskManager() {
  const { toast } = useToast();
  const [selectedEventId, setSelectedEventId] = useState<number>(1);
  const [isAddTaskOpen, setIsAddTaskOpen] = useState(false);
  const [isEditTaskOpen, setIsEditTaskOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<any>(null);
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterPriority, setFilterPriority] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<{ field: string; direction: 'asc' | 'desc' }>({
    field: 'dueDate',
    direction: 'asc',
  });
  
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    priority: 'medium',
    dueDate: '',
    assignedTo: '',
    assigneeRole: '',
  });

  // Apply filters and sorting to tasks
  const filteredTasks = sampleTasks
    .filter(task => {
      // Filter by status
      if (filterStatus !== 'all' && task.status !== filterStatus) return false;
      
      // Filter by priority
      if (filterPriority !== 'all' && task.priority !== filterPriority) return false;
      
      // Filter by search query
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        return (
          task.title.toLowerCase().includes(query) ||
          (task.description && task.description.toLowerCase().includes(query)) ||
          (task.assignedTo && task.assignedTo.toLowerCase().includes(query))
        );
      }
      
      return true;
    })
    .sort((a, b) => {
      // Sort by the selected field
      const field = sortBy.field;
      const direction = sortBy.direction === 'asc' ? 1 : -1;
      
      if (field === 'dueDate') {
        return direction * (new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime());
      }
      
      if (field === 'priority') {
        const priorityWeight = { high: 3, medium: 2, low: 1 };
        return direction * (priorityWeight[a.priority as keyof typeof priorityWeight] - priorityWeight[b.priority as keyof typeof priorityWeight]);
      }
      
      if (field === 'title') {
        return direction * a.title.localeCompare(b.title);
      }
      
      if (field === 'status') {
        const statusWeight = { pending: 3, 'in-progress': 2, completed: 1 };
        return direction * (statusWeight[a.status as keyof typeof statusWeight] - statusWeight[b.status as keyof typeof statusWeight]);
      }
      
      return 0;
    });

  // Group tasks by status for kanban view
  const tasksByStatus = {
    pending: filteredTasks.filter(task => task.status === 'pending'),
    'in-progress': filteredTasks.filter(task => task.status === 'in-progress'),
    completed: filteredTasks.filter(task => task.status === 'completed'),
  };

  // Task counts for summary
  const taskCounts = {
    total: sampleTasks.length,
    pending: sampleTasks.filter(task => task.status === 'pending').length,
    inProgress: sampleTasks.filter(task => task.status === 'in-progress').length,
    completed: sampleTasks.filter(task => task.status === 'completed').length,
  };

  // Priority counts for summary
  const priorityCounts = {
    high: sampleTasks.filter(task => task.priority === 'high').length,
    medium: sampleTasks.filter(task => task.priority === 'medium').length,
    low: sampleTasks.filter(task => task.priority === 'low').length,
  };

  // Handle adding a new task
  const handleAddTask = () => {
    toast({
      title: "Task added",
      description: `"${newTask.title}" has been added to your task list.`,
    });
    
    setIsAddTaskOpen(false);
    setNewTask({
      title: '',
      description: '',
      priority: 'medium',
      dueDate: '',
      assignedTo: '',
      assigneeRole: '',
    });
  };

  // Handle editing a task
  const handleEditTask = () => {
    if (!selectedTask) return;
    
    toast({
      title: "Task updated",
      description: `"${selectedTask.title}" has been updated.`,
    });
    
    setIsEditTaskOpen(false);
    setSelectedTask(null);
  };

  // Handle deleting a task
  const handleDeleteTask = (taskId: number, taskTitle: string) => {
    toast({
      title: "Task deleted",
      description: `"${taskTitle}" has been removed from your task list.`,
      variant: "destructive",
    });
  };

  // Handle updating task status
  const handleUpdateTaskStatus = (taskId: number, status: string) => {
    toast({
      title: "Task status updated",
      description: `Task status changed to ${status}.`,
    });
  };

  // Toggle sort direction or change sort field
  const handleSort = (field: string) => {
    if (sortBy.field === field) {
      setSortBy({
        field,
        direction: sortBy.direction === 'asc' ? 'desc' : 'asc',
      });
    } else {
      setSortBy({
        field,
        direction: 'asc',
      });
    }
  };

  // Get sort icon based on current sort state
  const getSortIcon = (field: string) => {
    if (sortBy.field !== field) return null;
    
    return sortBy.direction === 'asc' ? 
      <SortAsc className="h-3 w-3 ml-1" /> : 
      <SortDesc className="h-3 w-3 ml-1" />;
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="pb-3">
          <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
            <div>
              <CardTitle>Task Manager</CardTitle>
              <CardDescription>
                Organize and track your event planning tasks
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
              <Button onClick={() => setIsAddTaskOpen(true)}>
                <Plus className="mr-2 h-4 w-4" />
                Add Task
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {/* Task Summary */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <Card className="bg-muted/50">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Total Tasks</p>
                    <p className="text-2xl font-bold">{taskCounts.total}</p>
                  </div>
                  <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <CheckCircle2 className="h-5 w-5 text-primary" />
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-muted/50">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Pending</p>
                    <p className="text-2xl font-bold">{taskCounts.pending}</p>
                  </div>
                  <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                    <Clock className="h-5 w-5 text-blue-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-muted/50">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">In Progress</p>
                    <p className="text-2xl font-bold">{taskCounts.inProgress}</p>
                  </div>
                  <div className="h-10 w-10 rounded-full bg-orange-100 flex items-center justify-center">
                    <AlertCircle className="h-5 w-5 text-orange-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-muted/50">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Completed</p>
                    <p className="text-2xl font-bold">{taskCounts.completed}</p>
                  </div>
                  <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center">
                    <CheckCircle2 className="h-5 w-5 text-green-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Task Filter Controls */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 gap-4">
            <div className="flex flex-1 items-center border rounded-md px-3 py-1 focus-within:ring-1 focus-within:ring-ring max-w-md">
              <Filter className="h-4 w-4 mr-2 text-muted-foreground" />
              <Input 
                placeholder="Search tasks..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="border-0 p-0 focus-visible:ring-0 focus-visible:ring-transparent"
              />
            </div>
            
            <div className="flex flex-wrap gap-2">
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="w-[130px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="in-progress">In Progress</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                </SelectContent>
              </Select>
              
              <Select value={filterPriority} onValueChange={setFilterPriority}>
                <SelectTrigger className="w-[130px]">
                  <SelectValue placeholder="Priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Priorities</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="low">Low</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          {/* Task List */}
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[50px]">
                    <span className="sr-only">Status</span>
                  </TableHead>
                  <TableHead className="cursor-pointer" onClick={() => handleSort('title')}>
                    <div className="flex items-center">
                      Task {getSortIcon('title')}
                    </div>
                  </TableHead>
                  <TableHead className="cursor-pointer hidden md:table-cell" onClick={() => handleSort('priority')}>
                    <div className="flex items-center">
                      Priority {getSortIcon('priority')}
                    </div>
                  </TableHead>
                  <TableHead className="cursor-pointer hidden lg:table-cell" onClick={() => handleSort('dueDate')}>
                    <div className="flex items-center">
                      Due Date {getSortIcon('dueDate')}
                    </div>
                  </TableHead>
                  <TableHead className="hidden lg:table-cell">Assigned To</TableHead>
                  <TableHead className="cursor-pointer" onClick={() => handleSort('status')}>
                    <div className="flex items-center">
                      Status {getSortIcon('status')}
                    </div>
                  </TableHead>
                  <TableHead className="w-[70px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTasks.length > 0 ? (
                  filteredTasks.map((task) => {
                    const isPastDue = task.status !== 'completed' && new Date(task.dueDate) < new Date();
                    
                    // Status styling
                    const getStatusBadgeStyle = () => {
                      switch (task.status) {
                        case 'completed':
                          return 'bg-green-100 text-green-700 border-green-200';
                        case 'in-progress':
                          return 'bg-blue-100 text-blue-700 border-blue-200';
                        default:
                          return isPastDue ? 
                            'bg-red-100 text-red-700 border-red-200' : 
                            'bg-gray-100 text-gray-700 border-gray-200';
                      }
                    };
                    
                    // Priority styling
                    const getPriorityBadgeStyle = () => {
                      switch (task.priority) {
                        case 'high':
                          return 'bg-red-100 text-red-700 border-red-200';
                        case 'medium':
                          return 'bg-yellow-100 text-yellow-700 border-yellow-200';
                        default:
                          return 'bg-green-100 text-green-700 border-green-200';
                      }
                    };
                    
                    return (
                      <TableRow key={task.id}>
                        <TableCell>
                          <Checkbox 
                            checked={task.status === 'completed'}
                            onCheckedChange={(checked) => {
                              handleUpdateTaskStatus(
                                task.id, 
                                checked ? 'completed' : 'pending'
                              );
                            }}
                          />
                        </TableCell>
                        <TableCell>
                          <div className={task.status === 'completed' ? 'line-through text-muted-foreground' : ''}>
                            <span className="font-medium">{task.title}</span>
                            {task.description && (
                              <p className="text-sm text-muted-foreground mt-1 line-clamp-1">
                                {task.description}
                              </p>
                            )}
                          </div>
                        </TableCell>
                        <TableCell className="hidden md:table-cell">
                          <Badge className={`${getPriorityBadgeStyle()} capitalize`}>
                            {task.priority}
                          </Badge>
                        </TableCell>
                        <TableCell className="hidden lg:table-cell">
                          <div className="flex items-center">
                            <Calendar className="h-3 w-3 mr-1 text-muted-foreground" />
                            <span className={`text-sm ${isPastDue ? 'text-red-600 font-medium' : ''}`}>
                              {format(new Date(task.dueDate), 'MMM d, yyyy')}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell className="hidden lg:table-cell">
                          {task.assignedTo ? (
                            <div className="flex items-center">
                              <User className="h-3 w-3 mr-1 text-muted-foreground" />
                              <span className="text-sm">{task.assignedTo}</span>
                              {task.assigneeRole && (
                                <span className="text-xs text-muted-foreground ml-1">
                                  ({task.assigneeRole})
                                </span>
                              )}
                            </div>
                          ) : (
                            <span className="text-sm text-muted-foreground">Unassigned</span>
                          )}
                        </TableCell>
                        <TableCell>
                          <Badge className={getStatusBadgeStyle()}>
                            {task.status === 'completed' ? (
                              <CheckCircle2 className="h-3 w-3 mr-1" />
                            ) : task.status === 'in-progress' ? (
                              <Clock className="h-3 w-3 mr-1" />
                            ) : isPastDue ? (
                              <XCircle className="h-3 w-3 mr-1" />
                            ) : (
                              <AlertCircle className="h-3 w-3 mr-1" />
                            )}
                            <span className="capitalize">
                              {isPastDue && task.status === 'pending' ? 'Overdue' : task.status.replace('-', ' ')}
                            </span>
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem
                                onClick={() => {
                                  setSelectedTask(task);
                                  setIsEditTaskOpen(true);
                                }}
                              >
                                <Edit className="h-4 w-4 mr-2" />
                                Edit
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => handleUpdateTaskStatus(task.id, 'completed')}
                                disabled={task.status === 'completed'}
                              >
                                <CheckCircle2 className="h-4 w-4 mr-2" />
                                Mark Complete
                              </DropdownMenuItem>
                              {task.status !== 'in-progress' && task.status !== 'completed' && (
                                <DropdownMenuItem
                                  onClick={() => handleUpdateTaskStatus(task.id, 'in-progress')}
                                >
                                  <Clock className="h-4 w-4 mr-2" />
                                  Mark In Progress
                                </DropdownMenuItem>
                              )}
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                className="text-destructive"
                                onClick={() => handleDeleteTask(task.id, task.title)}
                              >
                                <Trash2 className="h-4 w-4 mr-2" />
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    );
                  })
                ) : (
                  <TableRow>
                    <TableCell colSpan={7} className="h-24 text-center">
                      <div className="flex flex-col items-center justify-center">
                        <CheckCircle2 className="h-8 w-8 text-muted-foreground mb-2" />
                        <p className="text-muted-foreground">No tasks match your filters</p>
                        <Button 
                          variant="link" 
                          onClick={() => {
                            setFilterStatus('all');
                            setFilterPriority('all');
                            setSearchQuery('');
                          }}
                        >
                          Reset Filters
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
      
      {/* Add Task Dialog */}
      <Dialog open={isAddTaskOpen} onOpenChange={setIsAddTaskOpen}>
        <DialogContent className="sm:max-w-[525px]">
          <DialogHeader>
            <DialogTitle>Add New Task</DialogTitle>
            <DialogDescription>
              Create a new task for your event planning.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="task-title">Task Title</Label>
              <Input
                id="task-title"
                value={newTask.title}
                onChange={(e) => setNewTask({...newTask, title: e.target.value})}
                placeholder="e.g., Book venue, Order flowers"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="task-description">Description (Optional)</Label>
              <Textarea
                id="task-description"
                value={newTask.description}
                onChange={(e) => setNewTask({...newTask, description: e.target.value})}
                placeholder="Add details about this task"
                className="min-h-[80px]"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="task-priority">Priority</Label>
                <Select 
                  value={newTask.priority} 
                  onValueChange={(value) => setNewTask({...newTask, priority: value})}
                >
                  <SelectTrigger id="task-priority">
                    <SelectValue placeholder="Select priority" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="low">Low</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="task-due-date">Due Date</Label>
                <Input
                  id="task-due-date"
                  type="date"
                  value={newTask.dueDate}
                  onChange={(e) => setNewTask({...newTask, dueDate: e.target.value})}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="task-assigned-to">Assigned To (Optional)</Label>
                <Input
                  id="task-assigned-to"
                  value={newTask.assignedTo}
                  onChange={(e) => setNewTask({...newTask, assignedTo: e.target.value})}
                  placeholder="e.g., Sarah, Michael"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="task-assignee-role">Role (Optional)</Label>
                <Input
                  id="task-assignee-role"
                  value={newTask.assigneeRole}
                  onChange={(e) => setNewTask({...newTask, assigneeRole: e.target.value})}
                  placeholder="e.g., Bride, Groom, Planner"
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" onClick={handleAddTask}>Add Task</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Edit Task Dialog */}
      {selectedTask && (
        <Dialog open={isEditTaskOpen} onOpenChange={setIsEditTaskOpen}>
          <DialogContent className="sm:max-w-[525px]">
            <DialogHeader>
              <DialogTitle>Edit Task</DialogTitle>
              <DialogDescription>
                Update task details.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="edit-task-title">Task Title</Label>
                <Input
                  id="edit-task-title"
                  value={selectedTask.title}
                  onChange={(e) => setSelectedTask({...selectedTask, title: e.target.value})}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-task-description">Description (Optional)</Label>
                <Textarea
                  id="edit-task-description"
                  value={selectedTask.description || ''}
                  onChange={(e) => setSelectedTask({...selectedTask, description: e.target.value})}
                  className="min-h-[80px]"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="edit-task-priority">Priority</Label>
                  <Select 
                    value={selectedTask.priority} 
                    onValueChange={(value) => setSelectedTask({...selectedTask, priority: value})}
                  >
                    <SelectTrigger id="edit-task-priority">
                      <SelectValue placeholder="Select priority" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="high">High</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="low">Low</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="edit-task-due-date">Due Date</Label>
                  <Input
                    id="edit-task-due-date"
                    type="date"
                    value={format(new Date(selectedTask.dueDate), 'yyyy-MM-dd')}
                    onChange={(e) => setSelectedTask({...selectedTask, dueDate: new Date(e.target.value)})}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="edit-task-assigned-to">Assigned To (Optional)</Label>
                  <Input
                    id="edit-task-assigned-to"
                    value={selectedTask.assignedTo || ''}
                    onChange={(e) => setSelectedTask({...selectedTask, assignedTo: e.target.value})}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="edit-task-assignee-role">Role (Optional)</Label>
                  <Input
                    id="edit-task-assignee-role"
                    value={selectedTask.assigneeRole || ''}
                    onChange={(e) => setSelectedTask({...selectedTask, assigneeRole: e.target.value})}
                  />
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-task-status">Status</Label>
                <Select 
                  value={selectedTask.status} 
                  onValueChange={(value) => setSelectedTask({...selectedTask, status: value})}
                >
                  <SelectTrigger id="edit-task-status">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="in-progress">In Progress</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button type="submit" onClick={handleEditTask}>Update Task</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}