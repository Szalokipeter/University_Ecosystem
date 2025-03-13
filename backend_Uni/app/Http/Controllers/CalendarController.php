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
    public function index()
    {
        /** @var UniUser $validateduser */
        $validateduser = Auth::user();
        $events = Calendar::where('uni_user_id', $validateduser->id)->get();
        return response()->json($events);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreCalendarRequest $request)
    {
        /** @var UniUser $validateduser */
        $validateduser = Auth::user();
        try {
            $data = $request->validated();
            $data['uni_user_id'] = $validateduser->id;
            $event = Calendar::create($data);
            return response()->json($event, 201);
        } catch (\Throwable $th) {
            return response()->json(["message" => "Could not create Personal Calendar Event."], 500);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(Calendar $personalCalendar)
    {
        /** @var UniUser $validateduser */
        $validateduser = Auth::user();
        if (!$validateduser->isAdmin() &&  $personalCalendar->uni_user_id != $validateduser->id){
            return response()->json(['message' => 'Unauthorized'], 403);
        }
        return response()->json($personalCalendar);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Calendar $personalCalendar, UpdateCalendarRequest $request)
    {
        /** @var UniUser $validateduser */
        $validateduser = Auth::user();
        if ($validateduser->id !== $personalCalendar->uni_user_id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }
        try {
            $data = $request->validated();
            $personalCalendar->update($data);
            return response()->json($personalCalendar);
        } catch (\Throwable $th) {
            return response()->json(["message" => "Could not update Personal Calendar Event."], 500);
        }

    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Calendar $personalCalendar)
    {
        /** @var UniUser $validateduser */
        $validateduser = Auth::user();
        if ($validateduser->id !== $personalCalendar->uni_user_id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }
        if(!$personalCalendar->delete()){
            return response()->json(["message"=>"Event could not be deleted."], 500);
        }
        return response()->json(["message"=>"Event was deleted."]);
    }

    public function admin_index(Uniuser $user)
    {
        /** @var UniUser $validateduser */
        $validateduser = Auth::user();
        if (!$validateduser->isAdmin()) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }
        $events = Calendar::where('uni_user_id', $user->id)->get();
        return response()->json($events);
    }

    public function admin_show(UniUser $user, Calendar $personalCalendar)
    {
        /** @var UniUser $validateduser */
        $validateduser = Auth::user();
        if (!$validateduser->isAdmin()){
            return response()->json(['message' => 'Unauthorized'], 403);
        }
        if($user->id !== $personalCalendar->uni_user_id){
            return response()->json(['message' => 'Mismatch in the id given, and the id of the person the Event belongst to'], 500);
        }
        return response()->json($personalCalendar);
    }
}
