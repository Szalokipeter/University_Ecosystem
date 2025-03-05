<?php

namespace App\Listeners;

use App\Events\QrLoginSuccess;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Support\Facades\Log;

class QrLoginSuccessListener
{
    /**
     * Handle the event.
     *
     * @param  \App\Events\QrLoginSuccess  $event
     * @return void
     */
    public function handle(QrLoginSuccess $event)
    {
        Log::info('QR Login Successful', ['AuthToken' => $event->Authtoken, 'QRToken' => $event->QRToken]);

    }
}
