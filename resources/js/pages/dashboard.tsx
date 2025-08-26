import React from 'react';
import { Head } from '@inertiajs/react';
import { Users, DollarSign, CheckSquare, Calendar, Home, Gift, MapPin, Camera } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import Layout from '@/components/Layout';
import { PageProps, Wedding, DashboardStats, ChartDataItem, MonthlyTaskItem, ActivityItem } from '@/types';

// Define the props for this specific page
interface DashboardPageProps extends PageProps {
    wedding: Wedding;
    stats: DashboardStats;
    budgetData: ChartDataItem[];
    monthlyTasks: MonthlyTaskItem[];
    recentActivities: ActivityItem[];
}

export default function Dashboard({ wedding, stats, budgetData, monthlyTasks, recentActivities }: DashboardPageProps) {
    const guestProgress = stats.totalGuests > 0 ? (stats.confirmedGuests / stats.totalGuests) * 100 : 0;
    const taskProgress = stats.totalTasks > 0 ? (stats.completedTasks / stats.totalTasks) * 100 : 0;
    const budgetProgress = Number(wedding.budget) > 0 ? (stats.totalBudget / Number(wedding.budget)) * 100 : 0;
    const formattedDate = new Date(wedding.wedding_date).toLocaleDateString('en-US', {
        year: 'numeric', month: 'long', day: 'numeric'
    });

    return (
        <>
            <Head title="Dashboard" />
            <div className="p-6 space-y-6">
                {/* Header */}
                <div className="text-center">
                    <h1 className="text-3xl font-bold text-foreground mb-2">{wedding.bride_name} & {wedding.groom_name}'s Wedding</h1>
                    <p className="text-muted-foreground text-lg">{formattedDate}</p>
                    <div className="inline-flex items-center gap-2 mt-4 px-4 py-2 bg-blue-50 dark:bg-blue-950/30 rounded-full border border-blue-200 dark:border-blue-800">
                        <Home className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                        {/* CHANGED: Use Math.floor() to show integer only */}
                        <span className="font-medium text-blue-900 dark:text-blue-100">{Math.floor(stats.daysUntilWedding)} days to go!</span>
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
                            <div className="text-2xl font-bold text-foreground">{stats.confirmedGuests}/{stats.totalGuests}</div>
                            <Progress value={guestProgress} className="mt-2" />
                        </CardContent>
                    </Card>
                    <Card className="bg-card border-border">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground">Budget Used</CardTitle>
                            <DollarSign className="h-4 w-4 text-green-600 dark:text-green-400" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-foreground">${stats.totalBudget.toLocaleString()}</div>
                            <Progress value={budgetProgress} className="mt-2" />
                        </CardContent>
                    </Card>
                    <Card className="bg-card border-border">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground">Tasks Complete</CardTitle>
                            <CheckSquare className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-foreground">{stats.completedTasks}/{stats.totalTasks}</div>
                            <Progress value={taskProgress} className="mt-2" />
                        </CardContent>
                    </Card>
                    <Card className="bg-card border-border">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground">Days Remaining</CardTitle>
                            <Calendar className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                        </CardHeader>
                        <CardContent>
                            {/* CHANGED: Use Math.floor() to show integer only */}
                            <div className="text-2xl font-bold text-foreground">{Math.floor(stats.daysUntilWedding)}</div>
                        </CardContent>
                    </Card>
                </div>

                {/* Charts and Activities */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <Card className="lg:col-span-2 bg-card border-border">
                        <CardHeader>
                            <CardTitle>Budget Breakdown</CardTitle>
                            <CardDescription>How your wedding budget is allocated</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="h-64">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <PieChart>
                                            <Pie data={budgetData} cx="50%" cy="50%" innerRadius={60} outerRadius={100} dataKey="value">
                                                {budgetData.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
                                            </Pie>
                                            <Tooltip formatter={(value: number) => `$${value.toLocaleString()}`} />
                                        </PieChart>
                                    </ResponsiveContainer>
                                </div>
                                <div className="space-y-3 self-center">
                                    {budgetData.map((item, index) => (
                                        <div key={index} className="flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                                                <span className="text-sm font-medium">{item.name}</span>
                                            </div>
                                            <span className="text-sm text-muted-foreground">${item.value.toLocaleString()}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                    <Card className="bg-card border-border">
                        <CardHeader>
                            <CardTitle>Recent Activity</CardTitle>
                            <CardDescription>Latest updates on your wedding</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {recentActivities.map((activity, index) => (
                                <div key={index} className="flex items-start gap-3">
                                    <div className={`w-2 h-2 rounded-full mt-2 ${
                                        activity.type === 'guest' ? 'bg-blue-600' :
                                        activity.type === 'budget' ? 'bg-green-600' :
                                        'bg-amber-600'
                                    }`} />
                                    <div>
                                        <p className="text-sm font-medium">{activity.action}</p>
                                        <p className="text-xs text-muted-foreground">{activity.time}</p>
                                    </div>
                                </div>
                            ))}
                        </CardContent>
                    </Card>
                </div>

                {/* Task Progress Chart */}
                <Card className="bg-card border-border">
                    <CardHeader>
                        <CardTitle>Monthly Task Progress</CardTitle>
                        <CardDescription>Track your wedding planning progress over time</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="h-64">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={monthlyTasks}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="month" />
                                    <YAxis />
                                    <Tooltip />
                                    <Bar dataKey="completed" fill="#10b981" name="Completed" />
                                    <Bar dataKey="total" fill="#93c5fd" name="Total" />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </>
    );
}

Dashboard.layout = (page: React.ReactElement) => <Layout children={page} />;