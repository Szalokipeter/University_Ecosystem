<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\PublicCalendar>
 */
class PublicCalendarFactory extends Factory
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
            "event_type" => $this->faker->randomElement(["Student Affairs", "Open to Public", "Registration Required", "Family Affairs"]),
            "dateofevent" => $this->faker->dateTimeBetween("+1 day", "+2 month"),
        ];
    }
}
