<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreGuestRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true; // Assuming any authenticated user can create a guest for their wedding
    }

    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:255'],
            'email' => ['nullable', 'email', 'max:255'],
            'phone' => ['nullable', 'string', 'max:20'],
            'side' => ['required', Rule::in(['bride', 'groom'])],
            'group' => ['required', 'string', 'max:255'],
            'role' => ['required', 'string', 'max:255'],
            'invite_status' => ['sometimes', Rule::in(['pending', 'confirmed', 'declined'])],
            'dietary_restrictions' => ['nullable', 'string'],
            'members_count' => ['required', 'integer', 'min:1'],
        ];
    }
}