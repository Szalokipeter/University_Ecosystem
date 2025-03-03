<?php

use Illuminate\Support\Facades\Broadcast;

Broadcast::channel('App.Models.UniUser.{id}', function ($user, $id) {
    return true; //(int) $user->id === (int) $id;
});
