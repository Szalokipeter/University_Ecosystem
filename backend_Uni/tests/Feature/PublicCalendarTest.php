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
    public function test_get_a_single_news_endpoint_works_for_anyone(): void
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
}
