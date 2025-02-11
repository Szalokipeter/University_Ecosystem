<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Schoolevent_user extends Model
{
    public $timestamps = false;
    protected $fillable = [
        'user_id',
        'publicCalendar_id',
    ];
    public function users(){
        return $this->belongsTo(UniUser::class);
    }
    public function publicCalendars(){
        return $this->belongsTo(PublicCalendar::class);
    }
}
