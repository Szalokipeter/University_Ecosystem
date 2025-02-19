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
    public function index()
    {
        /** @var UniUser $user */
        $validateduser = Auth::user();
        return $validateduser->todos;

    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreTodoRequest $request)
    {
        /** @var UniUser $user */
        $validateduser = Auth::user();
        try {
            $data = $request->validated();
            $data['status'] = "todo";
            $data['uni_user_id'] = $validateduser->id;
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
    public function show($id)
    {
        $todo = Todo::find($id);
        /** @var UniUser $user */
        $validateduser = Auth::user();
        // if ($validateduser->id !== $todo->uni_user_id || !$validateduser->isAdmin()) {
        //     return response()->json(['message' => 'Unauthorized'], 403);
        // }
        return response()->json($todo);

    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateTodoRequest $request, Todo $todo)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Todo $todo)
    {
        //
    }
}
