<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Message;
use App\Events\MessageDelivred;

class MessgeController extends Controller
{
    public function __construct(){
        $this->middleware(['auth']);
    }
    public function index(){
        $messages =  Message::all();
        return view('messages.index', compact('messages') );
    }


    public function store(Request $request){
   
        $message = auth()->user()->messages()->create($request->all());
        broadcast(new MessageDelivred($message->load('user')))->toOthers();
    // the broadcast function also exposes the toOthers method which allows 
    // you to exclude the current user from the broadcast's recipients:
    }

}
