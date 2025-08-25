import React from 'react';
import { Users, DollarSign, CheckSquare, Calendar, Home, Gift, MapPin, Camera } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Progress } from '../components/ui/progress';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import Layout from '../components/Layout';

const budgetData = [
  { name: 'Venue', value: 15000, color: '#3b82f6' },
  { name: 'Catering', value: 8000, color: '#10b981' },
  { name: 'Photography', value: 3500, color: '#f59e0b' },
  { name: 'Flowers', value: 2000, color: '#ef4444' },
  { name: 'Music', value: 1500, color: '#8b5cf6' },
];

const monthlyTasks = [
  { month: 'Jan', completed: 12, total: 15 },
  { month: 'Feb', completed: 18, total: 20 },
  { month: 'Mar', completed: 25, total: 28 },
  { month: 'Apr', completed: 30, total: 35 },
  { month: 'May', completed: 15, total: 25 },
  { month: 'Jun', completed: 8, total: 20 },
];

const recentActivities = [
  { action: 'RSVP received from Emma Johnson', time: '2 hours ago', type: 'guest' },
  { action: 'Photographer deposit paid', time: '1 day ago', type: 'budget' },
  { action: 'Venue tasting scheduled', time: '2 days ago', type: 'task' },
  { action: 'Invitation design approved', time: '3 days ago', type: 'task' },
];

export default function Dashboard() {
  const totalBudget = budgetData.reduce((sum, item) => sum + item.value, 0);
  const daysUntilWedding = 89;
  const completedTasks = 108;
  const totalTasks = 150;
  const confirmedGuests = 87;
  const totalGuests = 120;

  return (
    <div className="p-6 space-y-6 bg-background min-h-screen">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-foreground mb-2">Sarah & Mike's Wedding</h1>
        <p className="text-muted-foreground text-lg">June 15, 2024 • Rosewood Manor</p>
        <div className="inline-flex items-center gap-2 mt-4 px-4 py-2 bg-blue-50 dark:bg-blue-950/30 rounded-full border border-blue-200 dark:border-blue-800">
          <Home className="w-4 h-4 text-blue-600 dark:text-blue-400" />
          <span className="font-medium text-blue-900 dark:text-blue-100">{daysUntilWedding} days to go!</span>
        </div>
      </div>

      {/* Main Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-card border-border">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Confirmed Guests</CardTitle>
            <Users className="h-4 w-4 text-blue-600 dark:text-blue-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{confirmedGuests}/{totalGuests}</div>
            <p className="text-xs text-muted-foreground">+12 this week</p>
            <Progress value={(confirmedGuests / totalGuests) * 100} className="mt-2" />
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Budget Used</CardTitle>
            <DollarSign className="h-4 w-4 text-green-600 dark:text-green-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">${totalBudget.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">75% of budget</p>
            <Progress value={75} className="mt-2" />
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Tasks Complete</CardTitle>
            <CheckSquare className="h-4 w-4 text-amber-600 dark:text-amber-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{completedTasks}/{totalTasks}</div>
            <p className="text-xs text-muted-foreground">72% complete</p>
            <Progress value={(completedTasks / totalTasks) * 100} className="mt-2" />
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Days Remaining</CardTitle>
            <Calendar className="h-4 w-4 text-purple-600 dark:text-purple-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{daysUntilWedding}</div>
            <p className="text-xs text-muted-foreground">12 weeks, 5 days</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts and Activities */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Budget Breakdown */}
        <Card className="lg:col-span-2 bg-card border-border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-green-600 dark:text-green-400" />
              Budget Breakdown
            </CardTitle>
            <CardDescription>How your wedding budget is allocated</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={budgetData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      dataKey="value"
                    >
                      {budgetData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip 
                      formatter={(value) => `$${value.toLocaleString()}`}
                      contentStyle={{
                        backgroundColor: 'hsl(var(--card))',
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px',
                        color: 'hsl(var(--foreground))'
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="space-y-3">
                {budgetData.map((item, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div 
                        className="w-3 h-3 rounded-full" 
                        style={{ backgroundColor: item.color }}
                      />
                      <span className="text-sm font-medium text-foreground">{item.name}</span>
                    </div>
                    <span className="text-sm text-muted-foreground">
                      ${item.value.toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Home className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              Recent Activity
            </CardTitle>
            <CardDescription>Latest updates on your wedding</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {recentActivities.map((activity, index) => (
              <div key={index} className="flex items-start gap-3">
                <div className={`w-2 h-2 rounded-full mt-2 ${
                  activity.type === 'guest' ? 'bg-blue-600 dark:bg-blue-400' :
                  activity.type === 'budget' ? 'bg-green-600 dark:bg-green-400' :
                  'bg-amber-600 dark:bg-amber-400'
                }`} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground">{activity.action}</p>
                  <p className="text-xs text-muted-foreground">{activity.time}</p>
                </div>
              </div>
            ))}
            <Button variant="ghost" className="w-full mt-4 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950/30">
              View All Activity
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Task Progress Chart */}
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckSquare className="w-5 h-5 text-amber-600 dark:text-amber-400" />
            Monthly Task Progress
          </CardTitle>
          <CardDescription>Track your wedding planning progress over time</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyTasks}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis 
                  dataKey="month" 
                  stroke="hsl(var(--muted-foreground))"
                />
                <YAxis stroke="hsl(var(--muted-foreground))" />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px',
                    color: 'hsl(var(--foreground))'
                  }}
                />
                <Bar dataKey="completed" fill="#10b981" name="Completed" />
                <Bar dataKey="total" fill="#93c5fd" name="Total" opacity={0.6} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Button className="h-20 flex-col gap-2 bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600">
          <Gift className="w-6 h-6" />
          <span className="text-sm">Add Guest</span>
        </Button>
        <Button className="h-20 flex-col gap-2 bg-green-600 hover:bg-green-700 dark:bg-green-500 dark:hover:bg-green-600">
          <DollarSign className="w-6 h-6" />
          <span className="text-sm">Log Expense</span>
        </Button>
        <Button className="h-20 flex-col gap-2 bg-amber-600 hover:bg-amber-700 dark:bg-amber-500 dark:hover:bg-amber-600">
          <MapPin className="w-6 h-6" />
          <span className="text-sm">Venue Details</span>
        </Button>
        <Button className="h-20 flex-col gap-2 bg-purple-600 hover:bg-purple-700 dark:bg-purple-500 dark:hover:bg-purple-600">
          <Camera className="w-6 h-6" />
          <span className="text-sm">Photo Gallery</span>
        </Button>
      </div>
    </div>
  );
}

Dashboard.layout = (page: React.ReactElement) => <Layout>{page}</Layout>;
