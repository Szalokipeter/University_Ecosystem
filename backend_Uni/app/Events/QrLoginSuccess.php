<?php

namespace App\Events;

use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class QrLoginSuccess implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public $userId;
    public $token;

    /**
     * Create a new event instance.
     *
     * @return void
     */
    public function __construct($userId, $token)
    {
        $this->userId = $userId;
        $this->token = $token;
    }

    /**
     * Get the channels the event should broadcast on.
     *
     *
     * @return array<int, \Illuminate\Broadcasting\PrivateChannel>
     */
    public function broadcastOn()
    {
        return [
            new Channel('qr-login.40OlKKcLo3zZORKBLtupK5IjI8Ybh9Z1' ) // . $this->token
    ];
    }
}
