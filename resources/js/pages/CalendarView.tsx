import React, { useState } from 'react';
import { Calendar, Plus, Clock, MapPin, Users, Edit2, Trash2, ChevronLeft, ChevronRight } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../components/ui/dialog';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Textarea } from '../components/ui/textarea';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '../components/ui/alert-dialog';
import { toast } from 'sonner';
import Layout from '@/components/Layout';

interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  type: 'appointment' | 'deadline' | 'wedding' | 'meeting';
  attendees?: string[];
}

const mockEvents: Event[] = [
  {
    id: '1',
    title: 'Venue Visit - Rosewood Manor',
    description: 'Final walkthrough and setup discussion',
    date: '2024-04-15',
    time: '14:00',
    location: 'Rosewood Manor, 123 Garden Lane',
    type: 'appointment',
    attendees: ['Sarah', 'Mike', 'Wedding Planner']
  },
  {
    id: '2',
    title: 'Photographer Meeting',
    description: 'Review timeline and shot list',
    date: '2024-04-18',
    time: '10:30',
    location: 'Perfect Moments Studio',
    type: 'meeting',
    attendees: ['Sarah', 'Mike']
  },
  {
    id: '3',
    title: 'RSVP Deadline',
    description: 'Final date for guest confirmations',
    date: '2024-05-01',
    time: '23:59',
    location: 'Online',
    type: 'deadline'
  },
  {
    id: '4',
    title: 'Wedding Day',
    description: 'Sarah & Mike\'s Wedding Ceremony',
    date: '2024-06-15',
    time: '16:00',
    location: 'Rosewood Manor',
    type: 'wedding',
    attendees: ['120 Guests']
  },
  {
    id: '5',
    title: 'Cake Tasting',
    description: 'Final flavor selection with baker',
    date: '2024-04-22',
    time: '15:00',
    location: 'Sweet Dreams Bakery',
    type: 'appointment',
    attendees: ['Sarah', 'Mike']
  }
];

const eventTypeColors = {
  appointment: { bg: 'bg-blue-100 dark:bg-blue-900/30', text: 'text-blue-800 dark:text-blue-300', border: 'border-blue-200 dark:border-blue-800' },
  deadline: { bg: 'bg-red-100 dark:bg-red-900/30', text: 'text-red-800 dark:text-red-300', border: 'border-red-200 dark:border-red-800' },
  wedding: { bg: 'bg-purple-100 dark:bg-purple-900/30', text: 'text-purple-800 dark:text-purple-300', border: 'border-purple-200 dark:border-purple-800' },
  meeting: { bg: 'bg-green-100 dark:bg-green-900/30', text: 'text-green-800 dark:text-green-300', border: 'border-green-200 dark:border-green-800' }
};

export default function CalendarView() {
  const [events, setEvents] = useState<Event[]>(mockEvents);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [viewMode, setViewMode] = useState<'month' | 'week' | 'agenda'>('month');
  const [isAddEventOpen, setIsAddEventOpen] = useState(false);
  const [isEditEventOpen, setIsEditEventOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  const [eventFormData, setEventFormData] = useState<Partial<Event>>({});

  const today = new Date();
  const currentMonth = currentDate.getMonth();
  const currentYear = currentDate.getFullYear();

  // Get events for a specific date
  const getEventsForDate = (date: string) => {
    return events.filter(event => event.date === date);
  };

  // Get upcoming events (next 7 days)
  const getUpcomingEvents = () => {
    const nextWeek = new Date();
    nextWeek.setDate(today.getDate() + 7);
    
    return events
      .filter(event => {
        const eventDate = new Date(event.date);
        return eventDate >= today && eventDate <= nextWeek;
      })
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  };

  // Generate calendar days
  const generateCalendarDays = () => {
    const firstDay = new Date(currentYear, currentMonth, 1);
    const lastDay = new Date(currentYear, currentMonth + 1, 0);
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay());

    const days = [];
    const endDate = new Date(startDate);
    endDate.setDate(endDate.getDate() + 41); // 6 weeks = 42 days

    for (let date = new Date(startDate); date <= endDate; date.setDate(date.getDate() + 1)) {
      days.push(new Date(date));
    }

    return days;
  };

  const formatDate = (date: Date) => {
    return date.toISOString().split('T')[0];
  };

  const formatDisplayDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      weekday: 'short', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  const handleAddEvent = () => {
    if (!eventFormData.title || !eventFormData.date || !eventFormData.time || !eventFormData.type) {
      toast.error('Please fill in all required fields');
      return;
    }

    const newEvent: Event = {
      id: Date.now().toString(),
      title: eventFormData.title || '',
      description: eventFormData.description || '',
      date: eventFormData.date || '',
      time: eventFormData.time || '',
      location: eventFormData.location || '',
      type: eventFormData.type as Event['type'],
      attendees: eventFormData.attendees ? eventFormData.attendees.filter(a => a.trim()) : []
    };

    setEvents([...events, newEvent]);
    setEventFormData({});
    setIsAddEventOpen(false);
    toast.success('Event added successfully!');
  };

  const handleEditEvent = () => {
    if (!editingEvent || !eventFormData.title || !eventFormData.date || !eventFormData.time || !eventFormData.type) {
      toast.error('Please fill in all required fields');
      return;
    }

    const updatedEvent = {
      ...editingEvent,
      ...eventFormData
    };

    setEvents(events.map(event => event.id === editingEvent.id ? updatedEvent : event));
    setEditingEvent(null);
    setEventFormData({});
    setIsEditEventOpen(false);
    toast.success('Event updated successfully!');
  };

  const handleDeleteEvent = (eventId: string) => {
    setEvents(events.filter(event => event.id !== eventId));
    toast.success('Event deleted successfully!');
  };

  const openEditEvent = (event: Event) => {
    setEditingEvent(event);
    setEventFormData(event);
    setIsEditEventOpen(true);
  };

  const resetForm = () => {
    setEventFormData({});
    setEditingEvent(null);
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentDate);
    if (direction === 'prev') {
      newDate.setMonth(newDate.getMonth() - 1);
    } else {
      newDate.setMonth(newDate.getMonth() + 1);
    }
    setCurrentDate(newDate);
  };

  const EventForm = ({ isEdit = false }) => (
    <div className="space-y-4">
      <div>
        <Label htmlFor="title">Event Title *</Label>
        <Input
          id="title"
          placeholder="Enter event title"
          value={eventFormData.title || ''}
          onChange={(e) => setEventFormData({ ...eventFormData, title: e.target.value })}
        />
      </div>
      <div>
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          placeholder="Event description"
          value={eventFormData.description || ''}
          onChange={(e) => setEventFormData({ ...eventFormData, description: e.target.value })}
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="date">Date *</Label>
          <Input
            id="date"
            type="date"
            value={eventFormData.date || ''}
            onChange={(e) => setEventFormData({ ...eventFormData, date: e.target.value })}
          />
        </div>
        <div>
          <Label htmlFor="time">Time *</Label>
          <Input
            id="time"
            type="time"
            value={eventFormData.time || ''}
            onChange={(e) => setEventFormData({ ...eventFormData, time: e.target.value })}
          />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="type">Event Type *</Label>
          <Select value={eventFormData.type || ''} onValueChange={(value) => setEventFormData({ ...eventFormData, type: value as Event['type'] })}>
            <SelectTrigger>
              <SelectValue placeholder="Select type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="appointment">Appointment</SelectItem>
              <SelectItem value="meeting">Meeting</SelectItem>
              <SelectItem value="deadline">Deadline</SelectItem>
              <SelectItem value="wedding">Wedding</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="location">Location</Label>
          <Input
            id="location"
            placeholder="Event location"
            value={eventFormData.location || ''}
            onChange={(e) => setEventFormData({ ...eventFormData, location: e.target.value })}
          />
        </div>
      </div>
      <div className="flex justify-end gap-2">
        <Button
          variant="outline"
          onClick={() => {
            resetForm();
            isEdit ? setIsEditEventOpen(false) : setIsAddEventOpen(false);
          }}
        >
          Cancel
        </Button>
        <Button
          className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600"
          onClick={isEdit ? handleEditEvent : handleAddEvent}
        >
          {isEdit ? 'Update Event' : 'Add Event'}
        </Button>
      </div>
    </div>
  );

  const calendarDays = generateCalendarDays();
  const upcomingEvents = getUpcomingEvents();

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Wedding Calendar</h1>
          <p className="text-muted-foreground">Manage your wedding timeline and important dates</p>
        </div>
        <div className="flex gap-2">
          <div className="flex rounded-lg border border-border overflow-hidden">
            <Button
              variant={viewMode === 'month' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('month')}
              className="rounded-none"
            >
              Month
            </Button>
            <Button
              variant={viewMode === 'agenda' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('agenda')}
              className="rounded-none"
            >
              Agenda
            </Button>
          </div>
          <Dialog open={isAddEventOpen} onOpenChange={setIsAddEventOpen}>
            <DialogTrigger asChild>
              <Button className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600">
                <Plus className="w-4 h-4 mr-2" />
                Add Event
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Add New Event</DialogTitle>
                <DialogDescription>Create a new wedding planning event</DialogDescription>
              </DialogHeader>
              <EventForm />
            </DialogContent>
          </Dialog>

          {/* Edit Event Dialog */}
          <Dialog open={isEditEventOpen} onOpenChange={setIsEditEventOpen}>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Edit Event</DialogTitle>
                <DialogDescription>Update event details</DialogDescription>
              </DialogHeader>
              <EventForm isEdit={true} />
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="bg-card border-border">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-foreground">{upcomingEvents.length}</div>
            <div className="text-sm text-muted-foreground">Upcoming Events</div>
          </CardContent>
        </Card>
        <Card className="bg-card border-border">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">{events.filter(e => e.type === 'appointment').length}</div>
            <div className="text-sm text-muted-foreground">Appointments</div>
          </CardContent>
        </Card>
        <Card className="bg-card border-border">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-red-600 dark:text-red-400">{events.filter(e => e.type === 'deadline').length}</div>
            <div className="text-sm text-muted-foreground">Deadlines</div>
          </CardContent>
        </Card>
        <Card className="bg-card border-border">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">89</div>
            <div className="text-sm text-muted-foreground">Days to Wedding</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Calendar View */}
        <Card className="lg:col-span-2 bg-card border-border">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                {currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
              </CardTitle>
              <div className="flex gap-1">
                <Button variant="ghost" size="sm" onClick={() => navigateMonth('prev')}>
                  <ChevronLeft className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="sm" onClick={() => setCurrentDate(today)}>
                  Today
                </Button>
                <Button variant="ghost" size="sm" onClick={() => navigateMonth('next')}>
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {viewMode === 'month' ? (
              <div className="space-y-4">
                {/* Calendar Grid */}
                <div className="grid grid-cols-7 gap-1">
                  {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                    <div key={day} className="p-2 text-center text-sm font-medium text-muted-foreground">
                      {day}
                    </div>
                  ))}
                  {calendarDays.map((date, index) => {
                    const dateString = formatDate(date);
                    const dayEvents = getEventsForDate(dateString);
                    const isCurrentMonth = date.getMonth() === currentMonth;
                    const isToday = formatDate(date) === formatDate(today);
                    
                    return (
                      <div
                        key={index}
                        className={`min-h-[80px] p-1 border border-border rounded cursor-pointer transition-colors ${
                          isCurrentMonth ? 'bg-card hover:bg-accent/50' : 'bg-muted/30'
                        } ${isToday ? 'ring-2 ring-blue-500 dark:ring-blue-400' : ''}`}
                        onClick={() => setSelectedDate(dateString)}
                      >
                        <div className={`text-sm mb-1 ${
                          isCurrentMonth ? 'text-foreground' : 'text-muted-foreground'
                        } ${isToday ? 'font-bold' : ''}`}>
                          {date.getDate()}
                        </div>
                        <div className="space-y-1">
                          {dayEvents.slice(0, 2).map(event => {
                            const colors = eventTypeColors[event.type];
                            return (
                              <div
                                key={event.id}
                                className={`text-xs p-1 rounded truncate ${colors.bg} ${colors.text} ${colors.border} border`}
                                title={event.title}
                              >
                                {event.title}
                              </div>
                            );
                          })}
                          {dayEvents.length > 2 && (
                            <div className="text-xs text-muted-foreground">
                              +{dayEvents.length - 2} more
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ) : (
              /* Agenda View */
              <div className="space-y-4">
                {events
                  .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
                  .map(event => {
                    const colors = eventTypeColors[event.type];
                    return (
                      <div key={event.id} className={`p-4 rounded-lg border ${colors.border} ${colors.bg}`}>
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <h4 className={`font-medium ${colors.text}`}>{event.title}</h4>
                              <Badge variant="outline" className={`${colors.bg} ${colors.text} ${colors.border}`}>
                                {event.type}
                              </Badge>
                            </div>
                            <p className="text-sm text-muted-foreground mb-2">{event.description}</p>
                            <div className="flex items-center gap-4 text-sm text-muted-foreground">
                              <div className="flex items-center gap-1">
                                <Calendar className="w-3 h-3" />
                                {formatDisplayDate(event.date)}
                              </div>
                              <div className="flex items-center gap-1">
                                <Clock className="w-3 h-3" />
                                {event.time}
                              </div>
                              {event.location && (
                                <div className="flex items-center gap-1">
                                  <MapPin className="w-3 h-3" />
                                  {event.location}
                                </div>
                              )}
                            </div>
                          </div>
                          <div className="flex items-center gap-1">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => openEditEvent(event)}
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
                                  <AlertDialogTitle>Delete Event</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    Are you sure you want to delete "{event.title}"?
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                                  <AlertDialogAction
                                    onClick={() => handleDeleteEvent(event.id)}
                                    className="bg-red-600 hover:bg-red-700"
                                  >
                                    Delete
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </div>
                        </div>
                      </div>
                    );
                  })}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Upcoming Events Sidebar */}
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-amber-600 dark:text-amber-400" />
              Upcoming Events
            </CardTitle>
            <CardDescription>Next 7 days</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {upcomingEvents.length === 0 ? (
              <div className="text-center py-8">
                <Calendar className="w-12 h-12 mx-auto mb-4 text-muted-foreground opacity-50" />
                <p className="text-muted-foreground">No upcoming events</p>
              </div>
            ) : (
              upcomingEvents.map(event => {
                const colors = eventTypeColors[event.type];
                return (
                  <div key={event.id} className={`p-3 rounded-lg border ${colors.border} ${colors.bg}`}>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <h5 className={`font-medium text-sm ${colors.text}`}>{event.title}</h5>
                        <Badge variant="outline" className={`text-xs ${colors.bg} ${colors.text} ${colors.border}`}>
                          {event.type}
                        </Badge>
                      </div>
                      <div className="space-y-1 text-xs text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {formatDisplayDate(event.date)}
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {event.time}
                        </div>
                        {event.location && (
                          <div className="flex items-center gap-1">
                            <MapPin className="w-3 h-3" />
                            <span className="truncate">{event.location}</span>
                          </div>
                        )}
                        {event.attendees && event.attendees.length > 0 && (
                          <div className="flex items-center gap-1">
                            <Users className="w-3 h-3" />
                            {event.attendees.join(', ')}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

CalendarView.layout = (page: React.ReactElement) => <Layout>{page}</Layout>;