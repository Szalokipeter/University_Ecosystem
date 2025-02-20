<?php

namespace App\Http\Controllers;

use App\Models\Todo;
use App\Http\Requests\StoreTodoRequest;
use App\Http\Requests\UpdateTodoRequest;
use App\Models\UniUser;
use Illuminate\Support\Facades\Auth;

class TodoController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Uniuser $User)
    {
        /** @var UniUser $validateduser */
        $validateduser = Auth::user();
        if(!$validateduser->isAdmin() && $validateduser->id !== $User->id){
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $todos = Todo::where('uni_user_id', $User->id)->get();
        return response()->json($todos);

    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(UniUser $User, StoreTodoRequest $request)
    {
        /** @var UniUser $validateduser */
        $validateduser = Auth::user();
        if(!$validateduser->isAdmin() && $validateduser->id != $User->id){
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        try {
            $data = $request->validated();
            $data['status'] = "todo";
            $data['uni_user_id'] = $User->id;

            // dd($data);
            $todo = Todo::create($data);
            return response()->json($todo, 201);
        }
        catch (\Throwable $th) {
            return response()->json(['message' => 'Todo could not be created.'], 500);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(UniUser $User, $todo)
    {
        // $todo = Todo::find($todo->id);
        /** @var UniUser $validateduser */
        dd([$User, $todo]);
        $validateduser = Auth::user();
         if ($validateduser->id !== $User->id && !$validateduser->isAdmin()) {
             return response()->json(['message' => 'Unauthorized'], 403);
         }

        return response()->json($todo);

    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UniUser $User, Todo $todo, UpdateTodoRequest $request )
    {
        /** @var UniUser $validateduser */
        $validateduser = Auth::user();
        if ($validateduser->id !== $User->id && !$validateduser->isAdmin()) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }
        try {
            //code...
        } catch (\Throwable $th) {
            //throw $th;
        }
        if(!$todo->update($request->validated())){
            return response()->json(["message"=>"Todo could not be updated."], 500);
        }
        return response()->json($todo);

    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(UniUser $User, Todo $todo)
    {
        /** @var UniUser $validateduser */
        $validateduser = Auth::user();
        if ($validateduser->id !== $todo->uni_user_id && !$validateduser->isAdmin()) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }
        if(!$todo->delete()){
            return response()->json(["message"=>"Todo could not be deleted."], 500);
        }
        return response()->json(["message"=>"Todo was deleted."]);
    }
}
