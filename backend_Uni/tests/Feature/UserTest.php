<?php

namespace Tests\Feature;

use App\Models\UniUser;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Tests\TestCase;

class UserTest extends TestCase
{
    /**
     * A basic feature test example.
     */
    use RefreshDatabase;
    public function test_Login_successfull_with_correct_credentials(): void
    {
        $user = UniUser::find(1);
        $userData = $user->toArray();
        $userCredentials = [
            'email' => "admin@admin.com",
            "password" => "admin"
        ];
        $response = $this->postJson('/api/login', $userCredentials);
        $response->assertStatus(200);
        unset($userData['created_at'], $userData['updated_at']);
        $response->assertJsonFragment($userData);
    }
    public function test_Login_fails_with_incorrect_credentials(): void
    {
        $userCredentials = [
            'email' => "admin1@admin1.com",
            "password" => "admin1"
        ];
        $response = $this->postJson('/api/login', $userCredentials);
        $response->assertStatus(401);
        $response->assertJson(["message" => "Login failed: Invalid credentials"]);
    }
    public function test_logout_successfull_as_user(): void
    {
        $response = $this->withToken("i9sF06pWSKiUlegNWtYS3aoK0h7XH9JQ1f1fdfxI42c07ca2")->postJson('/api/logout'); // actingAs() tokens dont work here for some reason so im using the static token for testing
        $response->assertStatus(200);
        $response->assertJson(["message"=> "Logout successful"]);
    }
    public function test_register_works_for_admin(): void
    {
        $user = UniUser::find(1);
        $userCredentials = [
            'email' => "asdf@asdf.com",
            "username" => 'asdf',
            "password" => "asdf"
        ];
        $response = $this->actingAs($user)->postJson('/api/register', $userCredentials);
        $response->assertStatus(201);
        $response->assertJson(["message" => "Registration successful"]);
    }
    public function test_register_error_for_admin_when_not_sending_the_querry_body_correctly(): void
    {
        $user = UniUser::find(1);
        $userCredentials = [
            'email' => "asd@asd.com",
            "username" => 'asd',
            "password" => "asd"
        ];
        $response = $this->actingAs($user)->postJson('/api/register', $userCredentials);
        $response->assertStatus(422);
    }
    public function test_register_unathorized_for_students(): void
    {
        $user = UniUser::find(3);
        $registerCredentials = [
            'email' => "asda@asda.com",
            'username' => 'asda',
            "password" => "asda"
        ];
        $response = $this->actingAs($user)->postJson('/api/register', $registerCredentials);
        $response->assertStatus(403);
        $response->assertJson(["message" => "You are not Authorized."]);
    }
    public function test_register_unathorized_for_someone_that_isnt_logged_in(): void
    {
        $registerCredentials = [
            'email' => "asda@asda.com",
            'username' => 'asda',
            "password" => "asd"
        ];
        $response = $this->postJson('/api/register', $registerCredentials);
        $response->assertStatus(401);
        $response->assertJson(["message" => "Unauthenticated."]);
    }
    public function test_edit_user_works_for_admin(): void
    {
        $user = UniUser::find(1);
        $newUserCredentials = [
            "username" => 'asdf',
            "password" => "asdf",
            "password_confirmation" => "asdf"
        ];
        $response = $this->actingAs($user)->putJson('/api/users/' . 4, $newUserCredentials);
        $response->assertStatus(200);
        $response->assertJson(["message" => "Update successful"]);
    }
}
