@echo off
title DO NOT CLOSE THIS WINDOW, IT MIGHT STILL DO THE SEEDING!
cd backend_uni
echo Reseting DB
php artisan migrate:fresh --seed
echo DB Reset Completed
