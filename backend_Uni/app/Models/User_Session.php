<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class User_Session extends Model
{
    use HasFactory;
    public $timestamps = false;
    protected $fillable = [
        'ip_address',
        'user_agent',
        'payload',
        'last_activity'
    ];
    public function users(){
        return $this->belongsTo(UniUser::class);
    }
}
