

require('./bootstrap');

import Echo from "laravel-echo"

window.io = require('socket.io-client');

window.Echo = new Echo({
    broadcaster: 'socket.io',
    host: window.location.hostname + ':6001'
});

let onlineUsersLength = 0;
 
window.Echo.join('online')
    .here((users) => {
        //console.log(users);
        
        onlineUsersLength = users.length;
         if(users.length >1){
 
            $('#no-online-users').css('display', 'none');
           
         }

        let userID = $('meta[name= user-id]').attr('content');
        //console.log(userID)
        
        
        users.forEach( function(user) {
           
            // hidden  user auth() 
            if(user.id == userID){
                return;
            } 
            
             $('#online-users').append(` <li id="user-${user.id}" class="list-group-item">
             
             <i class="fas fa-circle text-succes" style="color:green;" ></i>           

             ${user.name} </li>`);
        }) // end of forEach
    }) // end here
    
    .joining((user) => {
         
        onlineUsersLength++;
        $('#no-online-users').css('display', 'none');
        $('#online-users').append(` <li id="user-${user.id}" class="list-group-item">
        
        <i class="fas fa-circle text-succes" style="color:green;" ></i> 
        ${user.name} </li>`);

    }) //end joining

    .leaving((user) => {

        onlineUsersLength--;
        if(onlineUsersLength== 1){

            $('#no-online-users').css('display', 'block');

        }
      $('#user-'+ user.id ).remove() ;
    }); // end leaving

    $('#chat-text').keypress(function(e){
        
       console.log(e.which);
       if(e.which == 13){
           e.preventDefault();
           let body = $(this).val(); // console.log(body);
           let url = $(this).data('url'); // console.log(url);
           let userName = $('meta[name=user-name]').attr('content');

           $(this).val('');
           
           $('#chat').append(`
            <div class="mt-4 w-50 text-white p-3 rounded  float-right bg-primary">
            <p>${ userName  } </p>
            <p>${body} </p>
            </div>
            <div class="clearfix"></div>
          `)
           
           
           let data ={
               '_token': $('meta[name=csrf-token]').attr('content'),
               body 
           }
            console.log(data);

            $.ajax({
                url: url  ,
                method:'post',
                data: data,
              
               }) //end of ajax
            
        }
    });// end key press
    
    // listen MessageDelivred
     
   
window.Echo.channel('chat-groupp')
    .listen('.App\Events\\chat-groupp\\MessageDelivred', (e) => {
      console.log(e.message.body);
      $('#chat').append(`
            <div class="mt-4 w-50 text-white p-3 rounded  float-left bg-warning">
                <p> ${e.message.user.name} </p>     
                <p>${e.message.body} </p>

            </div>
            <div class="clearfix"></div>
        `)
    });