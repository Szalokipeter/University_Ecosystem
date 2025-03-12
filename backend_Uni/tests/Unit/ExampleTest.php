<?php

namespace Tests\Unit;

use App\Models\Calendar;
use PHPUnit\Framework\TestCase;
use App\Models\PublicCalendar;
use App\Models\News;
use App\Models\Todo;

class ExampleTest extends TestCase
{

    public function test_public_calendar_model(): void
    {
        $publicCalendar = new PublicCalendar();
        $this->assertInstanceOf(PublicCalendar::class, $publicCalendar);
        $this->assertTrue(method_exists($publicCalendar, 'uniUsers'));
    }

    public function test_private_calendar_model(): void
    {
        $privateCalendar = new Calendar();
        $this->assertInstanceOf(Calendar::class, $privateCalendar);
        $this->assertTrue(method_exists($privateCalendar, 'users'));
    }
    public function test_todo_model(): void
    {
        $todo = new Todo();
        $this->assertInstanceOf(Todo::class, $todo);
        $this->assertTrue(method_exists($todo, 'users'));
    }
}
