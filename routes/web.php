<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\GuestController;
use App\Http\Controllers\BudgetController;
use App\Http\Controllers\TaskController;
use App\Http\Controllers\CalendarController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

// Publicly accessible welcome page
Route::get('/', function () {
     if(auth()->user()){
        return redirect()->route('dashboard');
     }
     return redirect()->route('login');
})->name('home');

// Routes that require a user to be logged in
Route::middleware(['auth', 'verified'])->group(function () {
    // Dashboard
    Route::get('/dashboard', [DashboardController::class, 'index'])->name('home');
     Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');
    // Guest Management Routes
        Route::get('/guests', [GuestController::class, 'index'])->name('guests');
        Route::post('/guests', [GuestController::class, 'store'])->name('guests.store');
        Route::put('/guests/{guest}', [GuestController::class, 'update'])->name('guests.update');
        Route::delete('/guests/{guest}', [GuestController::class, 'destroy'])->name('guests.destroy');

    // Budget Tracking
    Route::get('/budget', [BudgetController::class, 'index'])->name('budget');
    
    // Task Management
    Route::get('/tasks', [TaskController::class, 'index'])->name('tasks');
    
    // Calendar View
    Route::get('/calendar', [CalendarController::class, 'index'])->name('calendar');

    // // Profile Routes
    // Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    // Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    // Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});


require __DIR__.'/settings.php';
require __DIR__.'/auth.php';