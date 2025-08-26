<?php

namespace App\Http\Middleware;

use Illuminate\Http\Request;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{
    // ... other properties

    public function share(Request $request): array
    {
        return array_merge(parent::share($request), [
            'auth' => function () use ($request) {
                $user = $request->user();

                if (! $user) {
                    return ['user' => null];
                }

                // Eager load the wedding relationship
                $wedding = $user->wedding;

                return [
                    'user' => [
                        'id' => $user->id,
                        'name' => $user->name,
                        'email' => $user->email,
                        'wedding' => $wedding ? [
                            'bride_name' => $wedding->bride_name,
                            'groom_name' => $wedding->groom_name,
                            'wedding_date' => $wedding->wedding_date,
                        ] : null,
                    ],
                ];
            },
        ]);
    }
}   