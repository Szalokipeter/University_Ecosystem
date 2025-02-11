<?php

namespace App\Http\Controllers;

use App\Models\UniUser;
use App\Http\Requests\StoreUniUserRequest;
use App\Http\Requests\UpdateUniUserRequest;

class UniUserController extends Controller
{

    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreUniUserRequest $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(UniUser $uniUser)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateUniUserRequest $request, UniUser $uniUser)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(UniUser $uniUser)
    {
        //
    }
}
