<?php

namespace Tests;

use Illuminate\Foundation\Testing\TestCase as BaseTestCase;

abstract class TestCase extends BaseTestCase
{
    // protected $baseUrl = 'http://127.0.0.1:8000/api';
    protected function setUp(): void
    {
        parent::setUp();
        $this->artisan('db:seed')->run();
    }
}
