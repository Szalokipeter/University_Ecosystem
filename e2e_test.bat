@echo off
title Tesing Environment

cd laravel-echo-angular
npx concurrently "dotenv -e .env.cypress -- ng serve --host 127.0.0.1" "npx cypress open --config baseUrl=http://127.0.0.1:4200" "cd .. && cd backend_uni && php artisan serve --env=cypress --port=8000" "cd ../backend_uni && php artisan reverb:start"
pause >nul
