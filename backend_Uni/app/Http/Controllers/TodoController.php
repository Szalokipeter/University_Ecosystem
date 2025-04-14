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
        /** @var UniUser $validateduser */
        $validateduser = Auth::user();
        $todos = Todo::where('uni_user_id', $validateduser->id)->get();
        return response()->json($todos);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreTodoRequest $request)
    {
        /** @var UniUser $validateduser */
        $validateduser = Auth::user();
        try {
            $data = $request->validated();
            $data['status'] = "todo";
            $data['uni_user_id'] = $validateduser->id;

            $todo = Todo::create($data);
            return response()->json($todo, 201);
        } catch (\Throwable $th) {
            return response()->json(['message' => 'Todo could not be created.'], 500);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(Todo $personalTodo)
    {
        /** @var UniUser $validateduser */
        $validateduser = Auth::user();
        if ( $personalTodo->uni_user_id != $validateduser->id){
            return response()->json(['message' => 'Unauthorized'], 403);
        }
        return response()->json($personalTodo);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update( Todo $personalTodo, UpdateTodoRequest $request)
    {
        /** @var UniUser $validateduser */
        $validateduser = Auth::user();
        if ($validateduser->id !== $personalTodo->uni_user_id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }
        if (!$personalTodo->update($request->validated())) {
            return response()->json(["message" => "Todo could not be updated."], 500);
        }
        return response()->json($personalTodo);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Todo $personalTodo)
    {
        /** @var UniUser $validateduser */
        $validateduser = Auth::user();
        if ($validateduser->id !== $personalTodo->uni_user_id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }
        if (!$personalTodo->delete()) {
            return response()->json(["message" => "Todo could not be deleted."], 500);
        }
        return response()->json(["message" => "Todo was deleted."]);
    }

    public function admin_index(Uniuser $user)
    {
        /** @var UniUser $validateduser */
        $validateduser = Auth::user();
        if (!$validateduser->isAdmin()) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }
        $todos = Todo::where('uni_user_id', $user->id)->get();
        return response()->json($todos);
    }

    public function admin_show(UniUser $user, Todo $personalTodo)
    {
        /** @var UniUser $validateduser */
        $validateduser = Auth::user();
        if (!$validateduser->isAdmin()){
            return response()->json(['message' => 'Unauthorized'], 403);
        }
        if($user->id !== $personalTodo->uni_user_id){
            return response()->json(['message' => 'Mismatch in the id given, and the id of the person the Todo belongst to'], 500);
        }
        return response()->json($personalTodo);
    }
}
