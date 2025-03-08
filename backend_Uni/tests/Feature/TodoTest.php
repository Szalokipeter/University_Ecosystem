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
        $user = UniUser::findOrFail(3); // sima user ranggal rendelkező felhasználó
        $todos = Todo::where("uni_user_id", $user->id)->get();
        $response = $this->actingAs($user)->getJson('/api/users/' . $user->id . '/personalTodos');
        $this->assertNotEmpty($todos);
        $response->assertJson($todos->toArray());
        $response->assertStatus(200);
    }
}
