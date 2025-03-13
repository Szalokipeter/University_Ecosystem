<?php

use Illuminate\Support\Facades\Broadcast;

Broadcast::channel('qr-login.{token}', function ($user, $token) {
    // return $user->token === $token;
    return true;
});
