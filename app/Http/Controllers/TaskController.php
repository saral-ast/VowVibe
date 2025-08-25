<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;

class TaskController extends Controller
{
    public function index(){
        return Inertia::render('TaskManagement', props: [ 
            'data' => [], 
        ]);
    }
}