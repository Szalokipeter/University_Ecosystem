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
            "password" => "Asdfhhhh1."
        ];
        $response = $this->actingAs($user)->postJson('/api/admin/register', $userCredentials);
        $response->assertStatus(201);
        $response->assertJson(["message" => "Registration successful"]);
    }
    public function test_register_gives_422_when_not_all_required_fields_are_provided(): void
    {
        $user = UniUser::find(1);
        $userCredentials = [
            'email' => "asd@asd.com",
            "username" => 'asd',
            "password" => "Asdfhhh"
        ];
        $response = $this->actingAs($user)->postJson('/api/admin/register', $userCredentials);
        $response->assertStatus(422);
    }
    public function test_register_unathorized_for_students(): void
    {
        $user = UniUser::find(3);
        $registerCredentials = [
            'email' => "asda@asda.com",
            'username' => 'asda',
            "password" => "Asdfhhhh1."
        ];
        $response = $this->actingAs($user)->postJson('/api/admin/register', $registerCredentials);
        $response->assertStatus(403);
        $response->assertJson(["message" => "You are not Authorized."]);
    }
    public function test_register_unathorized_for_someone_that_isnt_logged_in(): void
    {
        $registerCredentials = [
            'email' => "asda@asda.com",
            'username' => 'asda',
            "password" => "Asdfhhhh1."
        ];
        $response = $this->postJson('/api/admin/register', $registerCredentials);
        $response->assertStatus(401);
        $response->assertJson(["message" => "Unauthenticated."]);
    }
    public function test_edit_user_works_for_admin(): void
    {
        $user = UniUser::find(1);
        $editCredentials = [
            "username" => 'asdf',
            "password" => "Asdfhhhh1.",
            "password_confirmation" => "Asdfhhhh1."
        ];
        $response = $this->actingAs($user)->putJson('/api/users/4', $editCredentials);
        $response->assertStatus(200);
        $response->assertJson(["message" => "Update successful"]);
    }
    public function test_edit_user_works_for_user_aka_the_user_can_edit_himself(): void
    {
        $user = UniUser::find(3);
        $editCredentials = [
            "username" => 'asdf',
            "password" => "Asdfhhhh1.",
            "password_confirmation" => "Asdfhhhh1."
        ];
        $response = $this->actingAs($user)->putJson('/api/users/3', $editCredentials);
        $response->assertStatus(200);
        $response->assertJson(["message" => "Update successful"]);
    }
    public function test_edit_user_gives_422_when_not_all_required_fields_are_provided(): void
    {
        $user = UniUser::find(4);
        $editCredentials = [
            "username" => 'asdf',
            "password" => "Asdfhhhh1.",
        ];
        $response = $this->actingAs($user)->putJson('/api/users/4', $editCredentials);
        $response->assertStatus(422);
    }
    public function test_edit_user_gives_422_for_admin_when_not_all_required_fields_are_provided(): void
    {
        $user = UniUser::find(1);
        $editCredentials = [
            "username" => 'asdf',
            "password" => "Asdfhhhh1.",
        ];
        $response = $this->actingAs($user)->putJson('/api/users/4', $editCredentials);
        $response->assertStatus(422);
    }
    public function test_edit_user_unathorized_for_someone_that_isnt_logged_in(): void
    {
        $editCredentials = [
            'email' => "asda@asda.com",
            'username' => 'asda',
            "password" => "Asdfhhhh1."
        ];
        $response = $this->putJson('/api/users/3', $editCredentials);
        $response->assertStatus(401);
        $response->assertJson(["message" => "Unauthenticated."]);
    }
    public function test_qr_code_generation_works(): void
    {
        $response = $this->postJson('/api/qrcode/generate');
        $response->assertStatus(200);
        $response->assertJsonCount(1);
    }
}
