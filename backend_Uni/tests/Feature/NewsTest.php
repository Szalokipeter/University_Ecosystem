<?php

namespace Tests\Feature;

use App\Models\News;
use App\Models\UniUser;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Tests\TestCase;

class NewsTest extends TestCase
{
    use RefreshDatabase;
    public function test_get_all_news_endpoint_works_for_anyone(): void
    {
        $news = News::all();
        $response = $this->getJson('/api/news');

        $this->assertNotEmpty($news);
        $response->assertStatus(200);
        $response->assertJson($news->toArray());
    }
    public function test_get_a_single_news_endpoint_works_for_anyone(): void
    {
        $news = News::findOrFail(1);
        $response = $this->getJson('/api/news/1');

        $this->assertNotEmpty($news);
        $response->assertStatus(200);
        $response->assertJson($news->toArray());
    }
    public function test_create_news_endpoint_works_for_admin(): void
    {
        $news = News::factory()->make();
        $user = UniUser::findOrFail(1);
        $response = $this->actingAs($user)->postJson('/api/news', $news->toArray());
        $response->assertStatus(201);
        $response->assertJsonStructure([
            'id',
            'title',
            'body',
            'created_at',
            'updated_at',
        ]);
        $newsData = $news->toArray();
        unset($newsData['created_at'], $newsData['updated_at']);

        $response->assertJson($newsData);
    }
    public function test_put_news_endpoint_works_for_admin(): void
    {
        $news = News::findOrFail(1);
        $newsData = $news->toArray();
        unset($newsData['created_at'], $newsData['updated_at']);
        $newsData['title'] = 'test';
        $newsData['body'] = 'test';
        $user = UniUser::findOrFail(1);
        $response = $this->actingAs($user)->putJson('/api/news/' . $news->id, $newsData);
        $response->assertStatus(200);
        $response->assertJsonStructure([
            'id',
            'title',
            'body',
            'created_at',
            'updated_at',
        ]);
        $response->assertJson($newsData);
    }
    public function test_delete_news_endpoint_works_for_admin(): void
    {
        $news = News::findOrFail(1);
        $user = UniUser::findOrFail(1);
        $response = $this->actingAs($user)->deleteJson('/api/news/' . $news->id, $news->toArray());
        $this->assertDatabaseMissing('news', $news->toArray());
        $response->assertStatus(200);
    }
    public function test_create_news_endpoint_dosent_work_for_user(): void
    {
        $news = News::factory()->make();
        $user = UniUser::findOrFail(3);
        $response = $this->actingAs($user)->postJson('/api/news', $news->toArray());
        $response->assertStatus(403);
        $this->assertDatabaseMissing('news', $news->toArray());
    }
    public function test_update_news_endpoint_dosent_work_for_user(): void
    {
        $news = News::findOrFail(1);
        $newsData = $news->toArray();
        unset($newsData['created_at'], $newsData['updated_at']);
        $newsData['title'] = 'test';
        $newsData['body'] = 'test';
        $user = UniUser::findOrFail(3);
        $response = $this->actingAs($user)->putJson('/api/news/' . $news->id, $news->toArray());
        $response->assertStatus(403);
    }
    public function test_delete_news_endpoint_dosent_work_for_user(): void
    {
        $news = News::findOrFail(1);
        $user = UniUser::findOrFail(3);
        $response = $this->actingAs($user)->deleteJson('/api/news/' . $news->id);
        $response->assertStatus(403);
    }
}
