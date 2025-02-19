<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Todo extends Model
{
    /** @use HasFactory<\Database\Factories\TodoFactory> */
    use HasFactory;
    protected $fillable = [
        'title',
        'body',
        'uni_user_id',
        'status'
    ];
    public function users(){
        return $this->belongsTo(UniUser::class);
    }
}
