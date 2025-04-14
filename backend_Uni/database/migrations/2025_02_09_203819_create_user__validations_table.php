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
        Schema::create('user__validations', function (Blueprint $table) {
            $table->id();
            $table->date('validUntil')->default(now()->addMinutes(15));
            $table->date('approvedAt')->nullable();
            $table->boolean('approved')->default(false);
            $table->string('token');
            //$table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('user__validations');
    }
};
