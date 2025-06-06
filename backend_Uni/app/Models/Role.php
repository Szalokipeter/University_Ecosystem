<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Role extends Model
{
    /** @use HasFactory<\Database\Factories\RoleFactory> */
    use HasFactory;
    public $timestamps = false;
    protected $fillable = [
        'name',
    ];
    public function users(){
        return $this->hasMany(UniUser::class);
    }
}
