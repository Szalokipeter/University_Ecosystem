<?php

namespace App\Events;

use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Log;

class QrLoginSuccess implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public $QRToken;
    public $Authtoken;

    /**
     * Create a new event instance.
     *
     * @return void
     */
    public function __construct($QRToken, $token)
    {
        $this->QRToken = $QRToken;
        $this->Authtoken = $token;
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
            new Channel('qr-login.' . $this->QRToken)
        ];
    }
    public function broadcastWith(): array
    {
        return [
            'QRToken' => $this->QRToken,
            'Authtoken' => $this->Authtoken
        ];
    }
    public function broadcastAs()
    {
        return 'qr-login-success';
    }
}
