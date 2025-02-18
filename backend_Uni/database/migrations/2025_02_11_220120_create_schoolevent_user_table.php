<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('schoolevent_user', function (Blueprint $table) {
            $table->id();
            $table->foreignId('schoolevent_id')->references('id')->on('public_calendars')->onDelete('cascade');
            $table->foreignId('user_id')->references('id')->on('uni_users')->onDelete('cascade');
            //$table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('schoolevent_user');
    }
};
