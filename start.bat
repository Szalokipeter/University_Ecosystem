@echo off
title Staring Backend and Test Frontend

start /min cmd /k "code . && cd backend_uni && php artisan serve"
start /min cmd /k "cd backend_uni && php artisan reverb:start"
start /min cmd /k "cd backend_uni && php artisan queue:work"
@REM start /min cmd /k "cd laravel-echo-angular && ng serve"
exit