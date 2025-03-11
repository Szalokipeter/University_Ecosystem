@echo off
title Tesing Environment
cd backend_uni
start "Migrating DB..." cmd /c dotenv -e .env.test -- php artisan migrate:fresh --seed
echo dotenv loading...
echo Press Enter to Continue
pause >nul
cd ..
cd laravel-echo-angular
npx concurrently "dotenv -e .env.test -- ng serve" "dotenv -e .env.test -- npx cypress open" "cd .. && cd backend_uni && php artisan serve" "cd ../backend_uni && php artisan reverb:start"
pause >nul