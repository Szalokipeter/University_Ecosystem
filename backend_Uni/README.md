# Leírás a Backend használatához

## Setup

### Ideiglenesen, ameddig lokálisan lesz futtatva:
### 1. opció: (kézi megoldás)
    - https://laravel.com/docs/11.x/installation#installing
    - php oldalról futtasd le a bash kommandot powershell-ben (majd ha szükséges a php.ini fájlból távolítsd el az első változó nevéből az E betűt és metsd el a fájlt) (C:\Users\Sajat neved\.config\herd-lite\bin\php.ini)
    - git clone után menj be a folderbe cmd-vel nyisd meg a visual studio code-ot a jelenlegi folderen ( code . )
    - ezután nyiss egy terminált a vs code-ban, utána: cd backend_Uni  
    - .env.example fájlból csinálj másolatot és töröld ki a ".example"-t ezzel csinálva egy .env fájlt.
    - következő parancsokat add ki a vs-code termináljában:
    1. php artisan key:generate
    2. composer install
	3. npm i
    3. php artisan migrate --seed (ha már van .sqlite fájlod vagy csak az eredeti adatokat szeretnéd visszaszerezni akkor: php artisan migrate:fresh --seed)
    4. (opcionális) php artisan route:list (ezzel a route-okat tudod megnézni)
    5. php artisan serve (1.cmd)
	6. php artisan reverb:start (2.cmd)
	7. php artisan queue:work (3.cmd)
### 2. opció:
	- Ez az opció .bat fájlok segítségével, gyorsítja a setupolást és a program futtatását
	- setup:
	1. húzd le a .env fájlt valahonnan Z meghajtótok vagy esetleg dc-ről (a backend_Uni folderbe rakjátok be)
	2. futtasd le az **INSTALL.bat** fájlt. (Ez egy pöppet több időbe fog telni, mivel az összes függőséget telepíti és a migrációkat is elvégezi)
	3. amint befejeződött elindíthatod a **START.bat** fájlt, ez elindítja a 3 backend működéséhez szükséges cmd-t és a külső .git fájlal rendelkező folderben megnyitja a vscode-ot. (Github miatt a külső foldert használjátok gyökér folderként)
	- amikor friss adatbázist akartok vagy lefuttatjátok a **freshData.bat** fájlt, vagy lefuttatjátok a következő commandot (a backend_Uni folderen belül!!!): 
	- php artisan migrate:fresh --seed
