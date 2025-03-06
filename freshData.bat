cd backend_uni
echo Reseting DB
php artisan migrate:refresh --seed
echo DB Reset Completed
exit