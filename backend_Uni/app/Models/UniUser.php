<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;
use Illuminate\Foundation\Auth\User as Authenticatable;


class UniUser extends Authenticatable
{
    /** @use HasFactory<\Database\Factories\UniUserFactory> */
    use HasFactory, Notifiable, HasApiTokens;
    protected $fillable = [
        'username',
        'email',
        'password',
        'sessions_id',
        'validations_id'
    ];
    public function sessions(){
        return $this->hasMany(User_Session::class);
    }
     public function validations(){
        return $this->hasMany(User_Validation::class);
    }
    public function todos(){
        return $this->hasMany(Todo::class);
    }
    public function schoolEventUsers(){
        return $this->hasMany(Schoolevent_user::class);
    }
    public function Calendars(){
        return $this->hasMany(Calendar::class);
    }
    public function roles(){
        return $this->hasOne(Role::class);
    }

}
