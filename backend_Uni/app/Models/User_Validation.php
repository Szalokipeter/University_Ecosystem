<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class User_Validation extends Model
{
    public $timestamps = false;
    protected $fillable = [
        'validUntil',
        'approvedAt',
        'approved',
        'token',
    ];
    public function users(){
        return $this->belongsTo(UniUser::class);
    }
}
