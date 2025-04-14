<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PublicCalendar extends Model
{
    /** @use HasFactory<\Database\Factories\PublicCalendarFactory> */
    use HasFactory;
    protected $fillable = [
        'title',
        'body',
        'event_type',
        'dateofevent',
    ];
    public function uniUsers(){
        return $this->belongsToMany(UniUser::class, "schoolevent_user", "schoolevent_id", "uni_user_id");
    }
}
