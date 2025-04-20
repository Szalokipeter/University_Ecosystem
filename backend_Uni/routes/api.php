<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\CalendarController;
use App\Http\Controllers\LoginController;
use App\Http\Controllers\NewsController;
use App\Http\Controllers\PublicCalendarController;
use App\Http\Controllers\TodoController;
use Illuminate\Session\Middleware\StartSession;
use Illuminate\Support\Facades\Artisan;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');


Route::middleware([StartSession::class])->group(function () {
    Route::post('login', [LoginController::class, 'login']); //ez a route bárki számára használható
    Route::post('qrcode/generate', [LoginController::class, 'qrcode_token_generation']); //ez a route bárki számára használható
});


Route::middleware('auth:sanctum')->group(function(){
    Route::post('logout', [LoginController::class, 'logout']); //ez a route bárki számára használható aki be van jelentkezve
    Route::put('users/{user}', [LoginController::class, 'editUser']); //ez a route csak admin-ok vagy a saját user számára használható
    Route::post('admin/register', [LoginController::class, 'register']); //ez a route csak admin-ok számára használható

    Route::apiResource('personalCalendar', CalendarController::class); // ez a route minden tag számára elérhető (controller ellenőrzi hogy saját maga vagy admin)
    Route::apiResource('personalTodos', TodoController::class); // ez a route minden tag számára elérhető (controller ellenőrzi hogy saját maga vagy admin)
    Route::apiResource('uniCalendar', PublicCalendarController::class)->except(['index','show']); // ez a route vegyesen érhető el, a get minden tag számára elérhető, a post,put,delete az csak Admin vagy oktató számára érhető el.
    Route::post("uniCalendar/{uniCalendar}/signup", [PublicCalendarController::class, "signUpForEvent"]); // ez a route minden tag számára elérhető

    Route::get('users', [LoginController::class, 'getUsers']);
    Route::get('users/{user}', [LoginController::class, 'getUser']);
    Route::get("uniCalendar/{uniCalendar}/signup", [PublicCalendarController::class, "checkSignUp"]);
    Route::get("uniCalendar/{uniCalendar}/allUsers", [PublicCalendarController::class, "getAllSubscribedUsers"]);

    Route::get('admin/users/{user}/personalTodos', [TodoController::class, 'admin_index']);
    Route::get('admin/users/{user}/personalTodos/{personalTodo}', [TodoController::class, 'admin_show']);
    Route::get('admin/users/{user}/personalCalendar', [CalendarController::class, 'admin_index']);
    Route::get('admin/users/{user}/personalCalendar/{personalCalendar}', [CalendarController::class, 'admin_show']);

    Route::apiResource('news', NewsController::class)->except(['index', 'show']); // ez a route vegyesen érhető el, a get minden tag számára elérhető, a post,put,delete az csak Admin vagy oktató számára érhető el.
    Route::post('qrcode/login', [LoginController::class, 'qrcode_login']); // ez a route minden tag számára elérhető (mobilról való bejelentkezéshez)
});

Route::apiResource("uniCalendar", PublicCalendarController::class)->only(['index', 'show']); // ezek a route-ok minden tag számára elérhető
Route::apiResource("news", NewsController::class)->only(['index', 'show']); // ezek a route-ok minden tag számára elérhető

Route::any("have-to-login", function(){
    return response()->json(["message"=>"Has to log in to access this function."], 401);
});

if (app()->environment('cypress')) {
    Route::post('/test/reset-database', function () {
        try {
            Artisan::call('migrate:fresh --seed');
            return response()->json(['status' => 'success']);
        } catch (\Throwable $th) {
            return response()->json(['status' => 'error', 'message' => $th->getMessage()]);
        }
    });
}
