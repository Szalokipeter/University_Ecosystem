@echo off
title DO NOT CLOSE THIS WINDOW
echo .
echo Installing Backend and Test Frontend
echo .

cd /d "%~dp0"
cd backend_uni
echo Backend Directory: %cd%
echo .

echo installing backend in 3 seconds...
timeout /t 3 >nul
powershell "Set-ExecutionPolicy Bypass -Scope Process -Force; [System.Net.ServicePointManager]::SecurityProtocol = [System.Net.ServicePointManager]::SecurityProtocol -bor 3072; iex ((New-Object System.Net.WebClient).DownloadString('https://php.new/install/windows/8.4'))"
echo C:\Users\%USERNAME%\.config\herd-lite\bin\php.ini
set "PHPINI_FOLDER=C:\Users\%USERNAME%\.config\herd-lite\bin"
set "PHPINI_PATH=%PHPINI_FOLDER%\php.ini"
powershell -Command "(Get-Content -LiteralPath '%PHPINI_PATH%') -replace 'variables_order = \"EGPCS\"', 'variables_order = \"GPCS\"' | Set-Content -LiteralPath '%PHPINI_PATH%'"
set "PATH=%PATH%;%PHPINI_FOLDER%"
start "npm Install" cmd /c "npm i -g concurrently dotenv-cli && npm install"
start "npm Install frontend" cmd /c "cd ../laravel-echo-angular && npm install"

composer install
php artisan migrate --seed