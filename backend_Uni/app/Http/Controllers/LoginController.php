<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use App\Models\UniUser; // Use your custom UniUser model
use Laravel\Sanctum\HasApiTokens;

class LoginController extends Controller
{
    use HasApiTokens;
    public function login(Request $request)
    {
        // Validate the request
        $validated = $request->validate([
            'email' => 'required|email',
            'password' => 'required',
        ]);

        // Attempt to authenticate the user
        if (Auth::attempt($validated)) {
            // Get the authenticated user

            /** @var UniUser $user */
            $user = Auth::user();

            // Create a Sanctum token for the user
            $token = $user->createToken('auth_token', ['*'], now()->addMinutes(15))->plainTextToken;

            // Return the token in the response
            return response()->json([
                'message' => 'Login successful',
                'token' => $token, // Include the token in the response
                'user' => $user, // Optionally include user details
            ], 200);
        }

        // If authentication fails
        return response()->json([
            'message' => 'Login failed: Invalid credentials',
        ], 401);
    }
    public function logout(Request $request)
    {
        // Revoke the user's current token
        $request->user()->currentAccessToken()->delete();

        return response()->json([
            'message' => 'Logout successful',
        ], 200);
    }


    public function register(Request $request)
    {
        // Validate the request
        $validated = $request->validate([
            'username' => 'required|unique:uni_users,username', // Use your table name
            'email' => 'required|email|unique:uni_users,email', // Use your table name
            'password' => 'required|min:8',
        ]);

        // Hash the password
        $validated['password'] = Hash::make($validated['password']);

        // Create the user
        try {
            $user = UniUser::create($validated);

            // Optionally log the user in and return a token
            $token = $user->createToken('auth_token')->plainTextToken;

            return response()->json([
                'message' => 'Registration successful',
                'token' => $token, // Include the token in the response
                'user' => $user, // Optionally include user details
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Registration failed: ' . $e->getMessage(),
            ], 400);
        }
    }
}
