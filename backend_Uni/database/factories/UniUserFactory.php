<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\UniUser>
 */
class UniUserFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            "username" => $this->faker->userName,
            "email" => $this->faker->unique()->safeEmail,
            "password" => bcrypt($this->faker->word()),
            "roles_id" => $this->faker->numberBetween(1, 3),
            "sessions_id" => $this->faker->numberBetween(1, 2),
            "validations_id" => $this->faker->numberBetween(1, 2),
            "remember_token" => null,
        ];
    }
}
