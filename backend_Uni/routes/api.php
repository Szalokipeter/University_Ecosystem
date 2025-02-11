<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\CalendarController;
use App\Http\Controllers\LoginController;
use App\Http\Controllers\NewsController;
use App\Http\Controllers\PublicCalendarController;
use App\Http\Controllers\TodoController;
use Illuminate\Session\Middleware\StartSession;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');


Route::middleware([StartSession::class])->group(function () {
    Route::post('login', [LoginController::class, 'login']); //ez a route bárki számára használható
    Route::post('register', [LoginController::class, 'register']); //ez a route csak admin-ok számára használható
});


Route::middleware('auth:sanctum')->group(function(){
    Route::apiResource('users/{user}/personalCalendar', CalendarController::class); // ez a route minden tag számára elérhető (controller ellenőrzi hogy saját maga vagy admin)
    Route::apiResource('users/{user}/personalTodos', TodoController::class); // ez a route minden tag számára elérhető (controller ellenőrzi hogy saját maga vagy admin)
    Route::apiResource('uniCalendar', PublicCalendarController::class, ['except' => 'index']); // ez a route vegyesen érhető el, a get minden tag számára elérhető, a post,put,delete az csak Admin vagy oktató számára érhető el.

    Route::apiResource('news', NewsController::class, ['except' => 'index']); // ez a route vegyesen érhető el, a get minden tag számára elérhető, a post,put,delete az csak Admin vagy oktató számára érhető el.

});

Route::get("uniCalendar", [PublicCalendarController::class, "index"]);
Route::get("news", [NewsController::class, "index"]);
