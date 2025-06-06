<?php

namespace Tests\Feature;

use App\Models\Todo;
use App\Models\UniUser;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Tests\TestCase;

class TodoTest extends TestCase
{
    /**
     * A basic feature test example.
     */
    use RefreshDatabase;
    public function test_get_all_todos_of_user(): void
    {
        $user = UniUser::findOrFail(3);
        $todos = Todo::where("uni_user_id", $user->id)->get();
        $response = $this->actingAs($user)->getJson('/api/personalTodos');
        $this->assertNotEmpty($todos);
        $response->assertJson($todos->toArray());
        $response->assertStatus(200);
    }
    public function test_get_a_todo_of_user(): void
    {
        $user = UniUser::findOrFail(3);
        $todo = Todo::where("uni_user_id", $user->id)->firstOrFail();
        $response = $this->actingAs($user)->getJson('/api/personalTodos/' . $todo->id);
        $response->assertStatus(200);
        $this->assertNotEmpty($todo);
        $response->assertJson($todo->toArray());
    }
    public function test_cant_get_a_todo_of_different_user_as_not_admin(): void
    {
        $user = UniUser::findOrFail(3);
        $response = $this->actingAs($user)->getJson('/api/personalTodos/4');
        $response->assertStatus(403);
    }
    public function test_get_all_todos_of_different_user_as_admin(): void
    {
        $user = UniUser::findOrFail(1);
        $todos = Todo::where($user->id, 'uni_user_id')->get();
        $response = $this->actingAs($user)->getJson('/api/admin/users/3/personalTodos');
        $response->assertStatus(200);
        $response->assertJson($todos->toArray());
    }
    public function test_get_a_todo_of_different_user_as_admin(): void
    {
        $user = UniUser::findOrFail(1);
        $todo = Todo::where("id", 9)->firstOrFail();
        $response = $this->actingAs($user)->getJson('/api/admin/users/3/personalTodos/9');
        $response->assertStatus(200);
        $this->assertNotEmpty($todo);
        $response->assertJson($todo->toArray());
    }
    public function test_cant_edit_a_todo_of_different_user_even_as_admin(): void
    {
        $user = UniUser::findOrFail(1);
        $todo = Todo::where("uni_user_id", 3)->firstOrFail();
        $todo["title"] = 'test';
        unset($todo['created_at'], $todo['updated_at']);
        $response = $this->actingAs($user)->putJson('/api/personalTodos/9', $todo->toArray());
        $response->assertStatus(403);
    }
    public function test_cant_delete_a_todo_of_a_different_user_even_as_admin(): void
    {
        $user = UniUser::findOrFail(1);
        $todo = Todo::where("uni_user_id", 3)->firstOrFail();
        $response = $this->actingAs($user)->deleteJson('/api/personalTodos/' . $todo->id);
        $response->assertStatus(403);
    }
    public function test_user_create_a_todo_for_himself_successfully(): void
    {
        $todo = Todo::factory()->make();
        $user = UniUser::findOrFail(3);
        $todoData = $todo->toArray();
        $todoData['status'] = 'todo';
        $response = $this->actingAs($user)->postJson('/api/personalTodos', $todoData);
        $response->assertStatus(201);
        unset($todoData['created_at'], $todoData['updated_at']);
        $response->assertJsonFragment($todoData);
    }
    public function test_user_edit_a_todo_for_himself_successfully(): void
    {
        $user = UniUser::findOrFail(3);
        $todo = Todo::where("uni_user_id", 3)->firstOrFail();
        $todo["title"] = 'test';
        unset($todo['created_at'], $todo['updated_at']);
        $response = $this->actingAs($user)->putJson('/api/personalTodos/' . $todo->id, $todo->toArray());
        $response->assertStatus(200);
        $response->assertJsonFragment($todo->toArray());
    }
    public function test_user_delete_a_todo_for_himself_successfully(): void
    {
        $user = UniUser::findOrFail(3);
        $todo = Todo::where("uni_user_id", 3)->firstOrFail();
        $response = $this->actingAs($user)->deleteJson('/api/personalTodos/' . $todo->id, $todo->toArray());
        $this->assertDatabaseMissing('calendars', $todo->toArray());
        $response->assertStatus(200);
    }
}
