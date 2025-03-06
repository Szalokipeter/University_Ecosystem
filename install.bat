@echo off
title DO NOT CLOSE THIS WINDOW
echo .
echo Installing Backend and Test Frontend
echo .

cd /d "%~dp0"
cd backend_uni
echo Backend Directory: %cd%
echo .

echo Installing Backend in 3 seconds...
timeout /t 3 >nul
powershell "# Run as administrator... Set-ExecutionPolicy Bypass -Scope Process -Force; [System.Net.ServicePointManager]::SecurityProtocol = [System.Net.ServicePointManager]::SecurityProtocol -bor 3072; iex ((New-Object System.Net.WebClient).DownloadString('https://php.new/install/windows/8.4'))"
echo C:\Users\%USERNAME%\.config\herd-lite\bin\php.ini
set "PHPINI_PATH=C:\Users\%USERNAME%\.config\herd-lite\bin\php.ini"
powershell -Command "(Get-Content -LiteralPath '%PHPINI_PATH%') -replace 'variables_order = \"EGPCS\"', 'variables_order = \"GPCS\"' | Set-Content -LiteralPath '%PHPINI_PATH%'"
start "npm Install" cmd /c "npm install && timeout /t 1 && exit"
start "Composer Install" cmd /c "composer install && timeout /t 1 && php artisan migrate --seed && timeout /t 1 && exit"
@REM start "Frontend npm Install" cmd /c "cd .. && cd laravel-echo-angular && npm install && timeout /t 1 && exit"

exit