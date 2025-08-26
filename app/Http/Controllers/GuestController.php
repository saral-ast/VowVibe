<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreGuestRequest;
use App\Models\Guest;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;

class GuestController extends Controller
{
    public function index(): Response
    {
        $wedding = Auth::user()->wedding;
        $guests = $wedding->guests()->get();

        return Inertia::render('GuestManagement', [
            'guests' => $guests,
        ]);
    }

    public function store(StoreGuestRequest $request)
    {
        $wedding = Auth::user()->wedding;
        $wedding->guests()->create($request->validated());

        return redirect()->route('guests')->with('success', 'Guest added successfully.');
    }

    public function update(StoreGuestRequest $request, Guest $guest)
    {
        $guest->update($request->validated());

        return redirect()->route('guests')->with('success', 'Guest updated successfully.');
    }

    public function destroy(Guest $guest)
    {
        $guest->delete();

        return redirect()->route('guests')->with('success', 'Guest deleted successfully.');
    }

}