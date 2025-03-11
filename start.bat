@echo off
start /min cmd /c "code ."
title Staring Backend
cd backend_uni
npx concurrently -k "php artisan serve" "php artisan reverb:start"
