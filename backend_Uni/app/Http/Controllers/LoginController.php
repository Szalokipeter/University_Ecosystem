<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class LoginController extends Controller
{
    public function login(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required',
            'password' => 'required'
        ]);
        if(Auth::attempt($validated)) {
            $request->session()->regenerate();
            return response()->json([
                'message' => 'Login successful'
            ], 200);
        }
        return response()->json([
            'message' => 'Login failed'
        ], 401);
    }
    public function register(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required',
            'email' => 'required',
            'password' => 'required'
        ]);
        $validated['password'] = bcrypt($validated['password']);
        try {
            DB::table('users')->insert($validated);
            return response()->json([
                'message' => 'Registration successful'
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Registration failed'
            ], 400);
        }
    }
}
