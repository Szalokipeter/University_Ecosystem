<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateUniUserRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        // emailt nem lehet módosítani, mert az minden felhasználónak egyedi az egyetem által kiadott email cím
        return [
            'username' => 'required|string|max:255',
            'password' => 'required|min:4',
            "password_confirmation" => ["required", "string", "same:password"],
        ];
    }
}
