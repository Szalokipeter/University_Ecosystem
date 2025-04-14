<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Calendar extends Model
{
    /** @use HasFactory<\Database\Factories\CalendarFactory> */
    use HasFactory;

    protected $fillable = [
        'title',
        'body',
        'uni_user_id',
        'event_type',
        'dateofevent'
    ];
    public function users(){
        return $this->belongsTo(UniUser::class);
    }
}
