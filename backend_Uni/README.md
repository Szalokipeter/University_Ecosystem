# Leírás a Backend használatához

## Setup

### Ideiglenesen, ameddig lokálisan lesz futtatva:
    - https://laravel.com/docs/11.x/installation#installing-php oldalról futtasd le a bash kommandot powershell-ben (majd ha szükséges a php.ini fájlból távolítsd el az első változó nevéből az E betűt és metsd el a fájlt) (C:\Users\Sajat neved\.config\herd-lite\bin\php.ini)
    - git clone után menj be a folderbe cmd-vel nyisd meg a visual studio code-ot a jelenlegi folderen ( code . )
    - ezután nyiss egy terminált a vs code-ban, utána: cd backend_Uni  
    - .env.example fájlból csinálj másolatot és töröld ki a ".example"-t ezzel csinálva egy .env fájlt.
    - következő parancsokat add ki a vs-code termináljában:
    1. php artisan key:generate
    2. composer install
    3. php artisan migrate --seed (ha már van .sqlite fájlod vagy csak az eredeti adatokat szeretnéd visszaszerezni akkor: php artisan migrate:fresh --seed)
    4. (opcionális) php artisan route:list (ezzel a route-okat tudod megnézni)
    5. php artisan serve

