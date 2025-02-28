<?php

namespace App\Http\Controllers;

use App\Models\PublicCalendar;
use App\Http\Requests\StorePublicCalendarRequest;
use App\Http\Requests\UpdatePublicCalendarRequest;
use App\Models\Schoolevent_user;
use App\Models\UniUser;
use Illuminate\Support\Facades\Auth;

class PublicCalendarController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        if (($events = PublicCalendar::where("dateofevent", ">", now()->subDays(5))->get())->isEmpty()) {
            return response()->json(['message' => 'No Recent Events found.'], 404);
        }

        return response()->json($events);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StorePublicCalendarRequest $request)
    {
        /** @var UniUser $validateduser */
        $validateduser = Auth::user();
        if (!$validateduser->isAdmin() && !$validateduser->isTeacher()) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }
        try {
            $data = $request->validated();
            $event = PublicCalendar::create($data);
            return response()->json($event, 201);
        } catch (\Throwable $th) {
            return response()->json(["message" => "Could not create Public Calendar Event."], 500);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(PublicCalendar $uniCalendar)
    {
        if (!$uniCalendar) {
            return response()->json(['message' => 'Public Calendar Event not found'], 400);
        }
        return response()->json($uniCalendar);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdatePublicCalendarRequest $request, PublicCalendar $uniCalendar)
    {
        /** @var UniUser $validateduser */
        $validateduser = Auth::user();
        if (!$validateduser->isAdmin() && !$validateduser->isTeacher()) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }
        try {
            $data = $request->validated();
            $uniCalendar->update($data);
            return response()->json($uniCalendar);
        } catch (\Throwable $th) {
            return response()->json(["message" => "Could not update Public Calendar Event."], 500);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(PublicCalendar $uniCalendar)
    {
        /** @var UniUser $validateduser */
        $validateduser = Auth::user();
        if (!$validateduser->isAdmin() && !$validateduser->isTeacher()) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }
        try {
            $uniCalendar->delete();
            return response()->json(["message" => "Public Event was deleted."]);
        } catch (\Throwable $th) {
            return response()->json(["message" => "Could not delete Public Calendar Event."], 500);
        }
    }
    public function signUpForEvent(PublicCalendar $uniCalendar, UniUser $user)
    {
        /** @var UniUser $validateduser */
        $validateduser = Auth::user();
        try {
            if (!$validateduser->isAdmin() && $validateduser->id !== $user->id) {
                return response()->json(['message' => 'Unauthorized'], 403);
            }
            $sub = Schoolevent_user::where("schoolevent_id", $uniCalendar->id)->where("uni_user_id", $user->id)->get();
            if(count($sub) !== 0){
                $sub[0]->delete();
                return response()->json(["message" => "Unsubscribed from event."], 200);
            }
            else {
                $data = new Schoolevent_user();
                $data->schoolevent_id = $uniCalendar->id;
                $data->uni_user_id = $user->id;
                $data->save(); // Tried doing it the usual way, only this worked.
                return response()->json(["message" => "Subscribed to event."], 201);
            }
        } catch (\Throwable $th) {
            return response()->json(["message" => "Error with the Public calendar user relation."], 500);
        }
    }
}
