@echo off
start /min cmd /c "code . && exit"
title Staring Backend
cd backend_uni
npx concurrently -k "php artisan serve" "php artisan reverb:start" "php artisan queue:work"
