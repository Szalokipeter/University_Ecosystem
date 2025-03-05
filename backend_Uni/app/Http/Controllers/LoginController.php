<?php

namespace App\Http\Controllers;

use App\Events\QrLoginSuccess;
use App\Http\Requests\LoginRequest;
use App\Http\Requests\QrLoginRequest;
use App\Http\Requests\RegisterRequest;
use App\Http\Requests\UpdateUniUserRequest;
use App\Models\Role;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use App\Models\UniUser;
use App\Models\User_Validation;
use Laravel\Sanctum\HasApiTokens;
use SimpleSoftwareIO\QrCode\Facades\QrCode;
use Illuminate\Support\Str;

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

    public function editUser(UpdateUniUserRequest $request, UniUser $user)
    {
        /** @var UniUser $uniUser */
        $uniUser = Auth::user();
        if (!$uniUser->isAdmin()) {
            if ($uniUser->id != $user->id) {
                return response()->json(['message' => "You are not Authorized."], 403);
            }
        }
        $validated = $request->validated();
        $validated['password'] = Hash::make($validated['password']);
        try {
            $user->update($validated);
            $user->tokens()->delete();
            if (!$uniUser->isAdmin()) {
                $token = $user->createToken('auth_token')->plainTextToken;
            }

            return response()->json([
                'message' => 'Update successful',
                'token' => $token ?? null,
                'user' => $user,
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Update failed.',
            ], 500);
        }
    }

    public function register(RegisterRequest $request)
    {
        /** @var UniUser $user */
        $user = Auth::user();
        if (!$user->isAdmin()) {
            return response()->json(['message' => "You are not Authorized."], 403);
        }

        $validated = $request->validated();

        $validated['roles_id'] = Role::where("name", "user")->first()->id;
        $validated['password'] = Hash::make($validated['password']);

        try {
            $newuser = UniUser::create($validated);

            return response()->json([
                'message' => 'Registration successful',
                'user' => $newuser,
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Registration failed.',
            ], 400);
        }
    }
    public function qrcode_token_generation(Request $request)
    {
        $token = Str::random(32);
        User_Validation::create([
            'token' => $token,
            'validUntil' => now()->addMinutes(5),
            'approved' => 0,
        ]);
        return response()->json(['qrcode' => $token]);
    }
    public function qrcode_login(QrLoginRequest $request)
    {
        QrLoginSuccess::dispatch(1, 'test-token');
        broadcast(new QrLoginSuccess(1, 'test-token'));
        $validated = $request->validated();
        try {
            $signInRequest = User_Validation::where('token', $validated['token'])->where('validUntil', '>', now())->where('approved', 0)->firstOrFail();
            if (Auth::guard('web')->attempt(['email' => $validated['email'], 'password' => $validated['password']])) {
                /** @var UniUser $user */
                $user = Auth::user();
                $token = $user->createToken('auth_token', ['*'], now()->addMinutes(15))->plainTextToken;

                // send a message in a Laravel Reverb WebSocket for the specific fontend.
                try {
                    broadcast(new QrLoginSuccess($user->id, $token));
                } catch (\Throwable $th) {
                    return response()->json(['status' => 'Error with broadcasting: ' . $th->getMessage()], 500);
                }
                $signInRequest->update(['approved' => 1, 'approvedAt' => now()]);
                $user->update(['validations_id' => $signInRequest->id]);
                return response()->json(['status' => 'success']);
            }
        } catch (\Throwable $th) {
            return response()->json(['status' => 'failed'], 500);
        }
    }
}
