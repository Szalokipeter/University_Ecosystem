<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class UniUser extends Model
{
    /** @use HasFactory<\Database\Factories\UniUserFactory> */
    use HasFactory;
    protected $fillable = [
        'username',
        'email',
        'password',
        'session_id',
        'validations_id'
    ];
    public function sessions(){
        return $this->hasMany(User_Session::class);
    }
     public function validations(){
        return $this->hasMany(User_Validation::class);
    }

}
