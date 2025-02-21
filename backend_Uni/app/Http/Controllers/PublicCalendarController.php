<?php

namespace App\Http\Controllers;

use App\Models\PublicCalendar;
use App\Http\Requests\StorePublicCalendarRequest;
use App\Http\Requests\UpdatePublicCalendarRequest;
use Illuminate\Support\Facades\Auth;

class PublicCalendarController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {

    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(PublicCalendar $uniCalendar, StorePublicCalendarRequest $request)
    {
        /** @var UniUser $validateduser */
        $validateduser = Auth::user();
        if (!$validateduser->isAdmin() && ! !$validateduser->isTeacher()) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

    }

    /**
     * Display the specified resource.
     */
    public function show(PublicCalendar $publicCalendar)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdatePublicCalendarRequest $request, PublicCalendar $publicCalendar)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(PublicCalendar $publicCalendar)
    {
        //
    }
}
