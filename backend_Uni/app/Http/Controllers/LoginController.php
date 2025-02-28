<?php

namespace App\Http\Controllers;

use App\Http\Requests\LoginRequest;
use App\Models\Role;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use App\Models\UniUser;
use Laravel\Sanctum\HasApiTokens;

class LoginController extends Controller
{
    use HasApiTokens;
    public function login(LoginRequest $request)
    {
        $validated = $request->validated();

        if (Auth::attempt($validated)) {

            /** @var UniUser $user */
            $user = Auth::user();

            $token = $user->createToken('auth_token', ['*'], now()->addMinutes(15))->plainTextToken;

            return response()->json([
                'message' => 'Login successful',
                'token' => $token,
                'user' => $user,
            ], 200);
        }

        return response()->json([
            'message' => 'Login failed: Invalid credentials',
        ], 401);
    }
    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();

        return response()->json([
            'message' => 'Logout successful',
        ], 200);
    }

    public function editUser(Request $request, UniUser $uniUser){ // requestben meg kell adni a password_confirmation-t is
        /** @var UniUser $user */
        $user = Auth::user();
        if(!$user->isAdmin())
        {
            if($uniUser->id != $user->id){
                return response()->json(['message' =>"You are not Authorized."], 403);
            }
        }
        $validated = $request->validate([
            'username' => 'required|unique:uni_users,username',
            'email' => 'required|email|unique:uni_users,email',
            'password' => 'required|min:4',
        ]);
        if($request->password != $request->password_confirmation){
            return response()->json(['message' =>"Passwords do not match."], 400);
        }

        $validated['password'] = Hash::make($validated['password']);
        try {
            $user->update($validated);
            $user->tokens()->delete();
            $token = $user->createToken('auth_token')->plainTextToken;

            return response()->json([
                'message' => 'Update successful',
                'token' => $token,
                'user' => $user,
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Update failed: ' . $e->getMessage(),
            ], 400);
        }
    }

    public function register(Request $request)
    {
        /** @var UniUser $user */
        $user = Auth::user();
        if(!$user->isAdmin())
        {
            return response()->json(['message' =>"You are not Authorized."], 403);
        }

        $validated = $request->validate([
            'username' => 'required|unique:uni_users,username',
            'email' => 'required|email|unique:uni_users,email',
            'password' => 'required|min:4',
        ]);

        $validated['roles_id'] = Role::where("name", "user")->first()->id;
        $validated['password'] = Hash::make($validated['password']);

        // dd($validated);

        try {
            $newuser = UniUser::create($validated);

            return response()->json([
                'message' => 'Registration successful',
                'user' => $newuser,
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Registration failed: ' . $e->getMessage(),
            ], 400);
        }
    }
    public function qrcode_token_generation(Request $request){

    }
}
