<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Todo extends Model
{
    protected $fillable = [
        'title',
        'body',
        'user_id',
        'status'
    ];
    public function users(){
        return $this->belongsTo(User::class);
    }
}
