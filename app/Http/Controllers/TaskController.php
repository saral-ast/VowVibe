<?php

namespace App\Http\Controllers;

use App\Models\Task;
use App\Models\Wedding;
use App\Http\Requests\StoreTaskRequest;
use App\Http\Requests\UpdateTaskRequest;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response as InertiaResponse;

class TaskController extends Controller
{
    public function index(): InertiaResponse
    {
        $tasks = Task::where('wedding_id', auth()->user()->wedding_id)
            ->orderBy('status')
            ->orderBy('due_date')
            ->get()
            ->groupBy('status');

        // Ensure all status keys exist with empty arrays
        $statuses = ['todo', 'in_progress', 'completed'];
        $groupedTasks = [];
        
        foreach ($statuses as $status) {
            $groupedTasks[$status] = $tasks->get($status, collect())->values();
        }

        // Calculate task statistics
        $totalTasks = Task::where('wedding_id', auth()->user()->wedding_id)->count();
        $completedCount = $tasks->get('completed', collect())->count();
        $inProgressCount = $tasks->get('in_progress', collect())->count();
        $todoCount = $tasks->get('todo', collect())->count();
        $completionPercentage = $totalTasks > 0 ? round(($completedCount / $totalTasks) * 100, 1) : 0;

        return Inertia::render('TaskManagement', [
            'tasks' => $groupedTasks,
            'editingTask' => null,
            'stats' => [
                'total' => $totalTasks,
                'completed' => $completedCount,
                'inProgress' => $inProgressCount,
                'todo' => $todoCount,
                'completionPercentage' => $completionPercentage
            ]
        ]);
    }

    public function store(StoreTaskRequest $request): RedirectResponse
    {
        Task::create([
            ...$request->validated(),
            'wedding_id' => auth()->user()->wedding_id
        ]);

        return redirect()->route('tasks.index')->with('success', 'Task created successfully.');
    }

    public function update(UpdateTaskRequest $request, Task $task): JsonResponse|RedirectResponse
    {
        if ($task->wedding_id !== auth()->user()->wedding_id) {
            abort(403);
        }
        
        $task->update($request->validated());
        
        if ($request->wantsJson()) {
            return response()->json(['success' => true]);
        }
        
        return redirect()->route('tasks.index')->with('success', 'Task updated successfully.');
    }

    public function updateStatus(Task $task, string $status): JsonResponse|RedirectResponse
    {
        if ($task->wedding_id !== auth()->user()->wedding_id) {
            abort(403);
        }
        
        $task->update(['status' => $status]);
        
        if (request()->wantsJson()) {
            return response()->json(['success' => true]);
        }
        
        return redirect()->route('tasks.index')->with('success', 'Task status updated.');
    }

    public function destroy(Task $task): JsonResponse|RedirectResponse
    {
        if ($task->wedding_id !== auth()->user()->wedding_id) {
            abort(403);
        }
        
        $task->delete();
        
        if (request()->wantsJson()) {
            return response()->json(['success' => true]);
        }
        
        return redirect()->route('tasks.index')->with('success', 'Task deleted successfully.');
    }
}