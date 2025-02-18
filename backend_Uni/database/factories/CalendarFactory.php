<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Calendar>
 */
class CalendarFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            "title" => $this->faker->sentence,
            "body" => $this->faker->paragraph,
            "event_type" => $this->faker->randomElement(["exam", "homework", "quiz", "project"]),
            "dateofevent" => $this->faker->dateTimeBetween("+1 month", "+2 month"),
        ];
    }
}
