set -e

# php artisan migrate --seed

exec npx concurrently -k "php artisan octane:start --server=frankenphp" "php artisan reverb:start --host=0.0.0.0 --port=8080"
