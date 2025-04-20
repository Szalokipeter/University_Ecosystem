<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class EventUserResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'user_id' => $this->uni_user_id,
            "username" => $this->username,
            "email" => $this->email,
            "roles_id" => $this->roles_id,
            "created_at" => $this->created_at,
            "updated_at"=> $this->updated_at
        ];
    }
}
