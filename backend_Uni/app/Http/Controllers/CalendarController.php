<?php

namespace App\Http\Controllers;

use App\Models\Calendar;
use App\Http\Requests\StoreCalendarRequest;
use App\Http\Requests\UpdateCalendarRequest;
use App\Models\UniUser;
use Illuminate\Support\Facades\Auth;

class CalendarController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(UniUser $user)
    {
        /** @var UniUser $validateduser */
        $validateduser = Auth::user();
        if (!$validateduser->isAdmin() && $validateduser->id !== $user->id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $events = Calendar::where('uni_user_id', $user->id)->get();
        return response()->json($events);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(UniUser $user, StoreCalendarRequest $request)
    {
        /** @var UniUser $validateduser */
        $validateduser = Auth::user();
        if (!$validateduser->isAdmin() && $validateduser->id !== $user->id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }
        try {
            $data = $request->validated();
            $data['uni_user_id'] = $user->id;
            // dd($data);
            $event = Calendar::create($data);
            return response()->json($event, 201);
        } catch (\Throwable $th) {
            return response()->json(["message" => "Could not create Personal Calendar Event."], 500);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(Calendar $calendar)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateCalendarRequest $request, Calendar $calendar)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Calendar $calendar)
    {
        //
    }
}
