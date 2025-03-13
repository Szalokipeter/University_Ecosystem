<?php

namespace Tests\Feature;

use App\Models\PublicCalendar;
use App\Models\UniUser;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Tests\TestCase;

class PublicCalendarTest extends TestCase
{
    /**
     * A basic feature test example.
     */
    use RefreshDatabase;
    public function test_get_all_public_events_endpoint_works_for_anyone(): void
    {
        $publicCalendar = PublicCalendar::where("dateofevent", ">", now()->subDays(5))->get();
        $response = $this->getJson('/api/uniCalendar');

        $this->assertNotEmpty($publicCalendar);
        $response->assertStatus(200);
        $response->assertJson($publicCalendar->toArray());
    }
    public function test_get_a_single_event_endpoint_works_for_anyone(): void
    {
        $publicCalendar = PublicCalendar::findOrFail(1);
        $response = $this->getJson('/api/uniCalendar/' . $publicCalendar->id);

        $this->assertNotEmpty($publicCalendar);
        $response->assertStatus(200);
        $response->assertJson($publicCalendar->toArray());
    }
    public function test_create_public_event_endpoint_works_for_admin(): void
    {
        $publicCalendar = PublicCalendar::factory()->make();
        $user = UniUser::findOrFail(1);
        $publicCalendarData = $publicCalendar->toArray();
        $publicCalendarData['dateofevent'] = now()->addDay();
        $response = $this->actingAs($user)->postJson('/api/uniCalendar', $publicCalendarData);
        $response->assertStatus(201);
        $response->assertJsonStructure([
            'id',
            'title',
            'body',
            'event_type',
            'dateofevent',
            'created_at',
            'updated_at',
        ]);
        unset($publicCalendarData['created_at'], $publicCalendarData['updated_at']);
        $response->assertJsonFragment($publicCalendarData);
    }
    public function test_update_public_event_endpoint_works_for_admin(): void
    {
        $publicCalendar = PublicCalendar::findOrFail(1);
        $user = UniUser::findOrFail(1);
        $publicCalendarData = $publicCalendar->toArray();
        $publicCalendarData['dateofevent'] = now()->addDay();
        unset($publicCalendarData['created_at'], $publicCalendarData['updated_at']);
        $response = $this->actingAs($user)->putJson('/api/uniCalendar/'. $publicCalendar->id, $publicCalendarData);
        $response->assertStatus(200);
        $response->assertJsonStructure([
            'id',
            'title',
            'body',
            'event_type',
            'dateofevent',
            'created_at',
            'updated_at',
        ]);
        $response->assertJsonFragment($publicCalendarData);
    }
    public function test_delete_public_event_endpoint_works_for_admin(): void
    {
        $publicCalendar = PublicCalendar::findOrFail(1);
        $user = UniUser::findOrFail(1);
        $response = $this->actingAs($user)->deleteJson('/api/uniCalendar/'. $publicCalendar->id);
        $response->assertStatus(200);
        $this->assertDatabaseMissing('public_calendars', $publicCalendar->toArray());
    }
    public function test_user_can_sub_to_public_event(): void
    {
        $publicCalendar = PublicCalendar::findOrFail(3);
        $user = UniUser::findOrFail(4);
        $response = $this->actingAs($user)->postJson('/api/uniCalendar/'. $publicCalendar->id . '/signup');
        $response->assertStatus(201);
        $message['message'] = "Subscribed to event.";
        $response->assertJson($message);
    }
    public function test_user_can_unsub_from_public_event(): void
    {
        $publicCalendar = PublicCalendar::findOrFail(3);
        $user = UniUser::findOrFail(4);
        $response = $this->actingAs($user)->postJson('/api/uniCalendar/'. $publicCalendar->id . '/signup');
        $response = $this->actingAs($user)->postJson('/api/uniCalendar/'. $publicCalendar->id . '/signup'); // sub 2 times to sub and then delete the sub
        $response->assertStatus(200);
        $message['message'] = "Unsubscribed from event.";
        $response->assertJson($message);
    }
    public function test_user_cant_create_public_event(): void
    {
        $publicCalendar = PublicCalendar::factory()->make();
        $user = UniUser::findOrFail(3);
        $publicCalendarData = $publicCalendar->toArray();
        $publicCalendarData['dateofevent'] = now()->addDay();
        $response = $this->actingAs($user)->postJson('/api/uniCalendar', $publicCalendarData);
        $response->assertStatus(403);
        unset($publicCalendarData['created_at'], $publicCalendarData['updated_at']);
        $this->assertDatabaseMissing("public_calendars",$publicCalendarData);
    }
    public function test_user_cant_update_public_event(): void
    {
        $publicCalendar = PublicCalendar::findOrFail(1);
        $user = UniUser::findOrFail(3);
        $publicCalendarData = $publicCalendar->toArray();
        $publicCalendarData['dateofevent'] = now()->addDay();
        $response = $this->actingAs($user)->putJson('/api/uniCalendar/'. $publicCalendar->id, $publicCalendarData);
        $response->assertStatus(403);
        unset($publicCalendarData['created_at'], $publicCalendarData['updated_at']);
        $this->assertDatabaseMissing("public_calendars", $publicCalendarData); // assert that the updated aka changed data is not in the db
    }
    public function test_user_cant_delete_public_event(): void
    {
        $publicCalendar = PublicCalendar::findOrFail(1);
        $user = UniUser::findOrFail(3);
        $response = $this->actingAs($user)->deleteJson('/api/uniCalendar/'. $publicCalendar->id);
        $response->assertStatus(403);
        $publicCalendarData = $publicCalendar->toArray();
        unset($publicCalendarData['created_at'], $publicCalendarData['updated_at']);
        $this->assertDatabaseHas("public_calendars", $publicCalendarData);
    }
}
