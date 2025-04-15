set -e

# php artisan migrate --seed
# octane:start --server=frankenphp

exec npx concurrently -k "php artisan serve" "php artisan reverb:start --host=0.0.0.0 --port=8080"
