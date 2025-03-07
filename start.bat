@echo off
title Staring Backend and Test Frontend
cd backend_uni
npx concurrently -k "php artisan serve" "php artisan reverb:start" "php artisan queue:work"
pause >nul
