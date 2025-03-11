@echo off
title Tesing Environment
cd backend_uni

dotenv -e .env.test -- php artisan migrate:fresh --seed
echo dotenv loaded
pause >nul
cd ..
cd laravel-echo-angular
npm i
npx concurrently "dotenv -e .env.test -- ng serve" "php artisan serve --base-dir=backend_uni"
@REM dotenv -e .env.test cypress open
pause >nul