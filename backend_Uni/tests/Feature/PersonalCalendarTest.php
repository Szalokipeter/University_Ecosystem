<?php

namespace Tests\Feature;

use App\Models\Calendar;
use App\Models\UniUser;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Tests\TestCase;

class PersonalCalendarTest extends TestCase
{
    /**
     * A basic feature test example.
     */
    use RefreshDatabase;
    public function test_get_all_events_of_user(): void
    {
        $user = UniUser::findOrFail(3);
        $events = Calendar::where("uni_user_id", $user->id)->get();
        $response = $this->actingAs($user)->getJson('/api/personalCalendar');
        $this->assertNotEmpty($events);
        $response->assertJson($events->toArray());
        $response->assertStatus(200);
    }
    public function test_get_a_event_of_user(): void
    {
        $user = UniUser::findOrFail(3);
        $event = Calendar::where("uni_user_id", $user->id)->firstOrFail();
        $response = $this->actingAs($user)->getJson('/api/personalCalendar/' . $event->id);
        $response->assertStatus(200);
        $this->assertNotEmpty($event);
        $response->assertJson($event->toArray());
    }
    public function test_cant_get_a_event_of_different_user_as_not_admin(): void
    {
        $user = UniUser::findOrFail(3);
        $response = $this->actingAs($user)->getJson('/api/personalCalendar/4');
        $response->assertStatus(403);
    }
    public function test_get_all_events_of_different_user_as_admin(): void
    {
        $user = UniUser::findOrFail(1);
        $events = Calendar::where($user->id, 'uni_user_id')->get();
        $response = $this->actingAs($user)->getJson('/api/personalCalendar');
        $response->assertStatus(200);
        $response->assertJson($events->toArray());
    }
    public function test_get_a_event_of_different_user_as_admin(): void
    {
        $user = UniUser::findOrFail(1);
        $event = Calendar::where("id", 9)->firstOrFail();
        $response = $this->actingAs($user)->getJson('/api/personalCalendar/9');
        $response->assertStatus(200);
        $this->assertNotEmpty($event);
        $response->assertJson($event->toArray());
    }
    public function test_cant_edit_an_event_of_different_user_even_as_admin(): void
    {
        $user = UniUser::findOrFail(1);
        $event = Calendar::where("uni_user_id", 3)->firstOrFail();
        $event["title"] = 'test';
        unset($event['created_at'], $event['updated_at']);
        $response = $this->actingAs($user)->putJson('/api/personalCalendar/9', $event->toArray());
        $response->assertStatus(403);
    }
    public function test_cant_delete_an_event_of_a_different_user_even_as_admin(): void
    {
        $user = UniUser::findOrFail(1);
        $event = Calendar::where("uni_user_id", 3)->firstOrFail();
        $response = $this->actingAs($user)->deleteJson('/api/personalCalendar/' . $event->id);
        $response->assertStatus(403);
    }
    public function test_user_create_an_event_for_himself_successfully(): void
    {
        $event = Calendar::factory()->make();
        $user = UniUser::findOrFail(3);
        $eventData = $event->toArray();
        $eventData['dateofevent'] = now();
        $response = $this->actingAs($user)->postJson('/api/personalCalendar', $eventData);
        $response->assertStatus(201);
        unset($eventData['created_at'], $eventData['updated_at']);
        $response->assertJsonFragment($eventData);
    }
    public function test_user_edit_an_event_for_himself_successfully(): void
    {
        $user = UniUser::findOrFail(3);
        $event = Calendar::where("uni_user_id", 3)->firstOrFail();
        $event["title"] = 'test';
        unset($event['created_at'], $event['updated_at']);
        $response = $this->actingAs($user)->putJson('/api/personalCalendar/' . $event->id, $event->toArray());
        $response->assertStatus(200);
        $response->assertJsonFragment($event->toArray());
    }
    public function test_user_delete_an_event_for_himself_successfully(): void
    {
        $user = UniUser::findOrFail(3);
        $event = Calendar::where("uni_user_id", 3)->firstOrFail();
        $response = $this->actingAs($user)->deleteJson('/api/personalCalendar/' . $event->id, $event->toArray());
        $this->assertDatabaseMissing('calendars', $event->toArray());
        $response->assertStatus(200);
    }
}
