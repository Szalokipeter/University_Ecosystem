<?php

use Illuminate\Support\Facades\Route;

Route::get('pulse', function () {
    return view("/vendor/pulse/dashboard");
});
