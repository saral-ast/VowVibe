<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreTaskRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'title' => ['required', 'string', 'max:255'],
            'status' => ['required', 'string', Rule::in(['todo', 'in_progress', 'completed'])],
            'due_date' => ['nullable', 'date'],
            'description' => ['nullable', 'string'],
            'priority' => ['required', 'string', Rule::in(['low', 'medium', 'high'])],
        ];
    }
}
