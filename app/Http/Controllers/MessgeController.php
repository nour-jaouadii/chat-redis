<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Message;
class MessgeController extends Controller
{
    public function index(){
        $messages =  Message::all();
        return view('messages.index', compact('messages') );
    }


    public function store(Request $request){
   
        $message = auth()->user()->messages()->create($request->all());
    }

}
