<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Support\Facades\Auth;
use Carbon\Carbon;

class DashboardController extends Controller
{
    public function index(): Response
    {
        $user = Auth::user();
        $wedding = $user->wedding;

        if (! $wedding) {
            abort(404, 'Wedding details not found.');
        }

        // --- Calculate Real Stats ---
        $daysUntilWedding = Carbon::now()->diffInDays(Carbon::parse($wedding->wedding_date), false);
        $totalGuests = $wedding->guests()->count();
        $confirmedGuests = $wedding->guests()->where('rsvpStatus', 'confirmed')->count();
        $totalTasks = $wedding->tasks()->count();
        $completedTasks = $wedding->tasks()->where('status', 'completed')->count();

        // --- Prepare Sample Data for Charts & Activity ---
        // Later, you will build this data from your database queries.
        $budgetData = [
            ['name' => 'Venue', 'value' => 15000, 'color' => '#3b82f6'],
            ['name' => 'Catering', 'value' => 8000, 'color' => '#10b981'],
            ['name' => 'Photography', 'value' => 3500, 'color' => '#f59e0b'],
            ['name' => 'Flowers', 'value' => 2000, 'color' => '#ef4444'],
            ['name' => 'Music', 'value' => 1500, 'color' => '#8b5cf6'],
        ];
        
        $monthlyTasks = [
            ['month' => 'Jan', 'completed' => 12, 'total' => 15],
            ['month' => 'Feb', 'completed' => 18, 'total' => 20],
            ['month' => 'Mar', 'completed' => 25, 'total' => 28],
        ];

        $recentActivities = [
            ['action' => 'RSVP received from Emma Johnson', 'time' => '2 hours ago', 'type' => 'guest'],
            ['action' => 'Photographer deposit paid', 'time' => '1 day ago', 'type' => 'budget'],
            ['action' => 'Venue tasting scheduled', 'time' => '2 days ago', 'type' => 'task'],
        ];

        return Inertia::render('dashboard', [
            'wedding' => $wedding,
            'stats' => [
                'daysUntilWedding' => $daysUntilWedding > 0 ? $daysUntilWedding : 0,
                'totalGuests' => $totalGuests,
                'confirmedGuests' => $confirmedGuests,
                'totalTasks' => $totalTasks,
                'completedTasks' => $completedTasks,
                'totalBudget' => array_sum(array_column($budgetData, 'value')),
            ],
            'budgetData' => $budgetData,
            'monthlyTasks' => $monthlyTasks,
            'recentActivities' => $recentActivities,
        ]);
    }
}