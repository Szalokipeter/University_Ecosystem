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
        'roles_id', // e miatt az editnél meg a register-nél is extra ellerőrző lépések szükségesek
        'sessions_id',
        'validations_id'
    ];
    public function isAdmin(){
        return $this->roles->name == 'admin';
    }
    public function isTeacher(){
        return $this->roles->name == 'teacher';
    }
    public function sessions(){
        return $this->hasMany(User_Session::class);
    }
     public function validations(){
        return $this->hasMany(User_Validation::class);
    }
    public function todos(){
        return $this->hasMany(Todo::class);
    }
    public function publicCalendar(){
        return $this->belongsToMany(PublicCalendar::class, "schoolevent_user", "uni_user_id", "schoolevent_id");
    }
    public function Calendars(){
        return $this->hasMany(Calendar::class);
    }
    public function roles(){
        return $this->belongsTo(Role::class);
    }

}
