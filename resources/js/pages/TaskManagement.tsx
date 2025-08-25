import React, { useState } from 'react';
import { CheckSquare, Plus, Clock, AlertCircle, CheckCircle, Calendar, User, Flag, Edit2, Trash2, Save, X } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Progress } from '../components/ui/progress';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../components/ui/dialog';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Textarea } from '../components/ui/textarea';
import { Avatar, AvatarFallback } from '../components/ui/avatar';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '../components/ui/alert-dialog';
import { toast } from 'sonner';
import Layout from '../components/Layout';

interface Task {
  id: string;
  title: string;
  description: string;
  category: string;
  priority: 'low' | 'medium' | 'high';
  status: 'todo' | 'in-progress' | 'completed';
  dueDate: string;
  assignee: string;
  estimatedCost?: number;
  notes?: string;
}

const taskCategories = [
  'Venue & Catering',
  'Photography & Video',
  'Flowers & Decorations',
  'Music & Entertainment',
  'Attire & Beauty',
  'Invitations & Stationery',
  'Transportation',
  'Legal & Documentation',
  'Other'
];

const mockTasks: Task[] = [
  {
    id: '1',
    title: 'Book wedding venue',
    description: 'Visit and book the final venue for the wedding ceremony and reception',
    category: 'Venue & Catering',
    priority: 'high',
    status: 'completed',
    dueDate: '2024-01-15',
    assignee: 'Sarah',
    estimatedCost: 15000,
    notes: 'Rosewood Manor confirmed for June 15th'
  },
  {
    id: '2',
    title: 'Choose wedding photographer',
    description: 'Interview photographers and select one for the wedding day',
    category: 'Photography & Video',
    priority: 'high',
    status: 'completed',
    dueDate: '2024-02-01',
    assignee: 'Mike',
    estimatedCost: 3500,
    notes: 'Perfect Moments Studio selected'
  },
  {
    id: '3',
    title: 'Send save the dates',
    description: 'Design and send save the date cards to all guests',
    category: 'Invitations & Stationery',
    priority: 'medium',
    status: 'completed',
    dueDate: '2024-02-14',
    assignee: 'Sarah',
    estimatedCost: 200
  },
  {
    id: '4',
    title: 'Order wedding cake',
    description: 'Finalize cake design and place order with bakery',
    category: 'Venue & Catering',
    priority: 'medium',
    status: 'in-progress',
    dueDate: '2024-04-01',
    assignee: 'Sarah',
    estimatedCost: 800,
    notes: 'Tasting scheduled for next week'
  },
  {
    id: '5',
    title: 'Choose wedding rings',
    description: 'Shop for and purchase wedding bands',
    category: 'Attire & Beauty',
    priority: 'high',
    status: 'in-progress',
    dueDate: '2024-04-15',
    assignee: 'Both',
    estimatedCost: 2500
  },
  {
    id: '6',
    title: 'Book honeymoon',
    description: 'Research and book honeymoon destination and accommodations',
    category: 'Transportation',
    priority: 'medium',
    status: 'todo',
    dueDate: '2024-05-01',
    assignee: 'Mike',
    estimatedCost: 5000
  },
  {
    id: '7',
    title: 'Order flowers',
    description: 'Select and order bridal bouquet, centerpieces, and ceremony flowers',
    category: 'Flowers & Decorations',
    priority: 'medium',
    status: 'todo',
    dueDate: '2024-05-15',
    assignee: 'Sarah',
    estimatedCost: 1500
  },
  {
    id: '8',
    title: 'Finalize guest list',
    description: 'Confirm final guest count and collect all RSVPs',
    category: 'Other',
    priority: 'high',
    status: 'in-progress',
    dueDate: '2024-04-30',
    assignee: 'Both',
    notes: 'Waiting on 15 more RSVPs'
  }
];

export default function TaskManagement() {
  const [tasks, setTasks] = useState<Task[]>(mockTasks);
  const [isAddTaskOpen, setIsAddTaskOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [isEditTaskOpen, setIsEditTaskOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [formData, setFormData] = useState<Partial<Task>>({});

  const filteredTasks = selectedCategory === 'all' 
    ? tasks 
    : tasks.filter(task => task.category === selectedCategory);

  const todoTasks = filteredTasks.filter(task => task.status === 'todo');
  const inProgressTasks = filteredTasks.filter(task => task.status === 'in-progress');
  const completedTasks = filteredTasks.filter(task => task.status === 'completed');

  const totalTasks = tasks.length;
  const completedCount = tasks.filter(task => task.status === 'completed').length;
  const completionPercentage = (completedCount / totalTasks) * 100;

  const handleAddTask = () => {
    if (!formData.title || !formData.category || !formData.priority || !formData.dueDate || !formData.assignee) {
      toast.error('Please fill in all required fields');
      return;
    }

    const newTask: Task = {
      id: Date.now().toString(),
      title: formData.title || '',
      description: formData.description || '',
      category: formData.category || '',
      priority: formData.priority as 'low' | 'medium' | 'high',
      status: 'todo',
      dueDate: formData.dueDate || '',
      assignee: formData.assignee || '',
      estimatedCost: formData.estimatedCost || 0,
      notes: formData.notes || ''
    };

    setTasks([...tasks, newTask]);
    setFormData({});
    setIsAddTaskOpen(false);
    toast.success('Task added successfully!');
  };

  const handleEditTask = () => {
    if (!editingTask || !formData.title || !formData.category || !formData.priority || !formData.dueDate || !formData.assignee) {
      toast.error('Please fill in all required fields');
      return;
    }

    const updatedTask = {
      ...editingTask,
      ...formData
    };

    setTasks(tasks.map(task => task.id === editingTask.id ? updatedTask : task));
    setEditingTask(null);
    setFormData({});
    setIsEditTaskOpen(false);
    toast.success('Task updated successfully!');
  };

  const handleDeleteTask = (taskId: string) => {
    setTasks(tasks.filter(task => task.id !== taskId));
    toast.success('Task deleted successfully!');
  };

  const handleStatusChange = (taskId: string, newStatus: 'todo' | 'in-progress' | 'completed') => {
    setTasks(tasks.map(task => 
      task.id === taskId ? { ...task, status: newStatus } : task
    ));
    toast.success('Task status updated!');
  };

  const openEditTask = (task: Task) => {
    setEditingTask(task);
    setFormData(task);
    setIsEditTaskOpen(true);
  };

  const resetForm = () => {
    setFormData({});
    setEditingTask(null);
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300 border-red-200 dark:border-red-800';
      case 'medium':
        return 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300 border-yellow-200 dark:border-yellow-800';
      case 'low':
        return 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 border-green-200 dark:border-green-800';
      default:
        return 'bg-muted text-muted-foreground border-border';
    }
  };

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'high':
        return <AlertCircle className="w-3 h-3" />;
      case 'medium':
        return <Clock className="w-3 h-3" />;
      case 'low':
        return <Flag className="w-3 h-3" />;
      default:
        return null;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const isOverdue = (dateString: string, status: string) => {
    if (status === 'completed') return false;
    const dueDate = new Date(dateString);
    const today = new Date();
    return dueDate < today;
  };

  const TaskForm = ({ isEdit = false }) => (
    <div className="space-y-4">
      <div>
        <Label htmlFor="title">Task Title *</Label>
        <Input
          id="title"
          placeholder="Enter task title"
          value={formData.title || ''}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
        />
      </div>
      <div>
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          placeholder="Task description"
          value={formData.description || ''}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="category">Category *</Label>
          <Select value={formData.category || ''} onValueChange={(value) => setFormData({ ...formData, category: value })}>
            <SelectTrigger>
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              {taskCategories.map((category) => (
                <SelectItem key={category} value={category}>{category}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="priority">Priority *</Label>
          <Select value={formData.priority || ''} onValueChange={(value) => setFormData({ ...formData, priority: value as 'low' | 'medium' | 'high' })}>
            <SelectTrigger>
              <SelectValue placeholder="Select priority" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="low">Low</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="high">High</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="dueDate">Due Date *</Label>
          <Input
            id="dueDate"
            type="date"
            value={formData.dueDate || ''}
            onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
          />
        </div>
        <div>
          <Label htmlFor="assignee">Assignee *</Label>
          <Select value={formData.assignee || ''} onValueChange={(value) => setFormData({ ...formData, assignee: value })}>
            <SelectTrigger>
              <SelectValue placeholder="Assign to" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Sarah">Sarah</SelectItem>
              <SelectItem value="Mike">Mike</SelectItem>
              <SelectItem value="Both">Both</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      {isEdit && (
        <div>
          <Label htmlFor="status">Status</Label>
          <Select value={formData.status || ''} onValueChange={(value) => setFormData({ ...formData, status: value as 'todo' | 'in-progress' | 'completed' })}>
            <SelectTrigger>
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todo">To Do</SelectItem>
              <SelectItem value="in-progress">In Progress</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
            </SelectContent>
          </Select>
        </div>
      )}
      <div>
        <Label htmlFor="cost">Estimated Cost (optional)</Label>
        <Input
          id="cost"
          type="number"
          placeholder="0.00"
          value={formData.estimatedCost || ''}
          onChange={(e) => setFormData({ ...formData, estimatedCost: parseFloat(e.target.value) || 0 })}
        />
      </div>
      <div>
        <Label htmlFor="notes">Notes</Label>
        <Textarea
          id="notes"
          placeholder="Additional notes"
          value={formData.notes || ''}
          onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
        />
      </div>
      <div className="flex justify-end gap-2">
        <Button
          variant="outline"
          onClick={() => {
            resetForm();
            isEdit ? setIsEditTaskOpen(false) : setIsAddTaskOpen(false);
          }}
        >
          Cancel
        </Button>
        <Button
          className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600"
          onClick={isEdit ? handleEditTask : handleAddTask}
        >
          <Save className="w-4 h-4 mr-2" />
          {isEdit ? 'Update Task' : 'Add Task'}
        </Button>
      </div>
    </div>
  );

  const TaskCard = ({ task }: { task: Task }) => {
    const overdue = isOverdue(task.dueDate, task.status);
    
    return (
      <Card className="bg-card backdrop-blur-sm border-l-4" 
            style={{ borderLeftColor: task.priority === 'high' ? '#EF4444' : task.priority === 'medium' ? '#F59E0B' : '#10B981' }}>
        <CardContent className="p-4">
          <div className="space-y-3">
            <div className="flex items-start justify-between">
              <h4 className="font-medium text-foreground line-clamp-2">{task.title}</h4>
              <div className="flex items-center gap-1">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => openEditTask(task)}
                  className="w-8 h-8 p-0 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950/30"
                >
                  <Edit2 className="w-3 h-3" />
                </Button>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="w-8 h-8 p-0 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30"
                    >
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Delete Task</AlertDialogTitle>
                      <AlertDialogDescription>
                        Are you sure you want to delete "{task.title}"? This action cannot be undone.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => handleDeleteTask(task.id)}
                        className="bg-red-600 hover:bg-red-700"
                      >
                        Delete
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </div>
            
            <Badge className={`${getPriorityColor(task.priority)} text-xs w-fit`}>
              {getPriorityIcon(task.priority)}
              <span className="ml-1 capitalize">{task.priority}</span>
            </Badge>
            
            <p className="text-sm text-muted-foreground line-clamp-2">{task.description}</p>
            
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Calendar className="w-3 h-3" />
              <span className={overdue ? 'text-red-600 dark:text-red-400 font-medium' : ''}>
                {formatDate(task.dueDate)}
                {overdue && <span className="ml-1">(Overdue)</span>}
              </span>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <User className="w-3 h-3 text-muted-foreground" />
                <span className="text-xs text-muted-foreground">{task.assignee}</span>
              </div>
              {task.estimatedCost && (
                <span className="text-xs font-medium text-blue-600 dark:text-blue-400">
                  ${task.estimatedCost.toLocaleString()}
                </span>
              )}
            </div>
            
            <div className="flex gap-1">
              <Button
                size="sm"
                variant={task.status === 'todo' ? 'default' : 'outline'}
                onClick={() => handleStatusChange(task.id, 'todo')}
                className="flex-1 text-xs h-7"
              >
                To Do
              </Button>
              <Button
                size="sm"
                variant={task.status === 'in-progress' ? 'default' : 'outline'}
                onClick={() => handleStatusChange(task.id, 'in-progress')}
                className="flex-1 text-xs h-7"
              >
                In Progress
              </Button>
              <Button
                size="sm"
                variant={task.status === 'completed' ? 'default' : 'outline'}
                onClick={() => handleStatusChange(task.id, 'completed')}
                className="flex-1 text-xs h-7"
              >
                Done
              </Button>
            </div>
            
            {task.notes && (
              <div className="p-2 bg-accent/50 rounded text-xs text-muted-foreground">
                {task.notes}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="p-6 space-y-6 bg-background min-h-screen">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Task Management</h1>
          <p className="text-muted-foreground">Keep track of all your wedding planning tasks</p>
        </div>
        <Dialog open={isAddTaskOpen} onOpenChange={setIsAddTaskOpen}>
          <DialogTrigger asChild>
            <Button className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600">
              <Plus className="w-4 h-4 mr-2" />
              Add Task
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Add New Task</DialogTitle>
              <DialogDescription>Create a new wedding planning task</DialogDescription>
            </DialogHeader>
            <TaskForm />
          </DialogContent>
        </Dialog>

        {/* Edit Task Dialog */}
        <Dialog open={isEditTaskOpen} onOpenChange={setIsEditTaskOpen}>
          <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Edit Task</DialogTitle>
              <DialogDescription>Update task details</DialogDescription>
            </DialogHeader>
            <TaskForm isEdit={true} />
          </DialogContent>
        </Dialog>
      </div>

      {/* Progress Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-card backdrop-blur-sm border-border">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Tasks</CardTitle>
            <CheckSquare className="h-4 w-4 text-blue-600 dark:text-blue-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{totalTasks}</div>
          </CardContent>
        </Card>

        <Card className="bg-card backdrop-blur-sm border-border">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600 dark:text-green-400">{completedCount}</div>
          </CardContent>
        </Card>

        <Card className="bg-card backdrop-blur-sm border-border">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">In Progress</CardTitle>
            <Clock className="h-4 w-4 text-blue-600 dark:text-blue-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">{inProgressTasks.length}</div>
          </CardContent>
        </Card>

        <Card className="bg-card backdrop-blur-sm border-border">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">To Do</CardTitle>
            <AlertCircle className="h-4 w-4 text-yellow-600 dark:text-yellow-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">{todoTasks.length}</div>
          </CardContent>
        </Card>
      </div>

      {/* Overall Progress */}
      <Card className="bg-card backdrop-blur-sm border-border">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckSquare className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            Wedding Planning Progress
          </CardTitle>
          <CardDescription>
            {completedCount} of {totalTasks} tasks completed ({completionPercentage.toFixed(1)}%)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Progress value={completionPercentage} className="h-3" />
        </CardContent>
      </Card>

      {/* Category Filter */}
      <Card className="bg-card backdrop-blur-sm border-border">
        <CardContent className="p-4">
          <div className="flex items-center gap-4">
            <Label htmlFor="category-filter">Filter by category:</Label>
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-64">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {taskCategories.map((category) => (
                  <SelectItem key={category} value={category}>{category}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Kanban Board */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* To Do Column */}
        <Card className="bg-card backdrop-blur-sm border-border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-yellow-700 dark:text-yellow-400">
              <AlertCircle className="w-5 h-5" />
              To Do ({todoTasks.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {todoTasks.map((task) => (
              <TaskCard key={task.id} task={task} />
            ))}
            {todoTasks.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                <CheckCircle className="w-12 h-12 mx-auto mb-2 opacity-50" />
                <p>No pending tasks</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* In Progress Column */}
        <Card className="bg-card backdrop-blur-sm border-border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-blue-700 dark:text-blue-400">
              <Clock className="w-5 h-5" />
              In Progress ({inProgressTasks.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {inProgressTasks.map((task) => (
              <TaskCard key={task.id} task={task} />
            ))}
            {inProgressTasks.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                <Clock className="w-12 h-12 mx-auto mb-2 opacity-50" />
                <p>No tasks in progress</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Completed Column */}
        <Card className="bg-card backdrop-blur-sm border-border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-green-700 dark:text-green-400">
              <CheckCircle className="w-5 h-5" />
              Completed ({completedTasks.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {completedTasks.map((task) => (
              <TaskCard key={task.id} task={task} />
            ))}
            {completedTasks.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                <CheckSquare className="w-12 h-12 mx-auto mb-2 opacity-50" />
                <p>No completed tasks yet</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

TaskManagement.layout = (page: React.ReactElement) => <Layout>{page}</Layout>;