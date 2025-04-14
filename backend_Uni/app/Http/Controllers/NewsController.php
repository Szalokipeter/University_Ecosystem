<?php

namespace App\Http\Controllers;

use App\Models\News;
use App\Http\Requests\StoreNewsRequest;
use App\Http\Requests\UpdateNewsRequest;
use Illuminate\Support\Facades\Auth;

class NewsController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        if(($news = News::all())->isEmpty()) {
            return response()->json(['message' => 'No news found.'], 404);
        }
        return response()->json($news);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreNewsRequest $request)
    {
        /** @var UniUser $user */
        $user = Auth::user();
        if(!$user->isAdmin() && !$user->isTeacher())
        {
            return response()->json(['message' =>"You are not Authorized."], 403);
        }
        try {
            $news = News::create($request->validated());
            return response()->json($news, 201);
        }
        catch (\Throwable $th) {
            return response()->json(['message' => 'News could not be created.'], 500);
        }

    }

    /**
     * Display the specified resource.
     */
    public function show(News $news)
    {
        if(!$news) {
            return response()->json(['message' => 'News not found.'], 404);
        }
        return response()->json($news);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateNewsRequest $request, News $news)
    {
        /** @var UniUser $user */
        $user = Auth::user();
        if(!$user->isAdmin() && !$user->isTeacher())
        {
            return response()->json(['message' =>"You are not Authorized."], 403);
        }

        if(!$news->update($request->validated())){
            return response()->json(["message"=>"News could not be updated."], 500);
        }
        return response()->json($news);

    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(News $news)
    {
        /** @var UniUser $user */
        $user = Auth::user();
        if(!$user->isAdmin() && !$user->isTeacher())
        {
            return response()->json(['message' =>"You are not Authorized."], 403);
        }
        if(!$news) {
            return response()->json(['message' => 'News not found.'], 404);
        }
        $news->delete();
        return response()->json(['message' => 'News deleted.'], 200);
    }
}
