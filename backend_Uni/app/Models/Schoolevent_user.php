<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Schoolevent_user extends Model
{
    use HasFactory;
    public $timestamps = false;
    protected $table = "schoolevent_user";
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
