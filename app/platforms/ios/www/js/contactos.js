var screen_varios = $("#screen_varios");
screen_varios.wrapper = screen_varios.find('wrapper');
screen_varios.show = function(){	
	focus_trivia = false; 
	screen_varios.removeClass('downed');
	screen_to_hide.push(screen_varios);
};
screen_varios.hide = function(){
	screen_varios.title.html('<button class="close_window" onclick="screen_varios.hide();">x</button>');
    screen_varios.wrapper.html('');
	focus_trivia = true;
    screen_varios.addClass('downed');    
};


screen_varios.title = screen_varios.find('screen_title');
screen_varios.input = screen_varios.find('#search_people');
screen_varios.ajax_search = null;
screen_varios.input.keyup(function(){
	var dis = $(this);
	var val = dis.val();
    var type = dis.data('type');
    
    if(screen_varios.ajax_search!=null){
    	screen_varios.ajax_search.abort();
        screen_varios.ajax_search = null;
    }
    
    var data = 	{
                    action: 'search_followers',
                    app: 'La voz de Dios',
                    pais: pais,
                    timeOffset: timeOffset,
                    id_user: user_id_search,
                    s: val,
                    user_login: user_login,
                    user_pass: user_pass,
                    type: type
                };
    
    console.log(urlws);
    console.log(data);
    
            
    screen_varios.wrapper.html('<br><img width="10%" style="margin: 0 auto; display: block;" src="img/loader.gif"/><br><br>');
    screen_varios.ajax_search = $.ajax({
    	url: urlws,
        dataType: 'text',
        type: 'post',
        data: data,
        success: function(a,b,c){
            screen_varios.wrapper.html(a);
        },
        error: function(a,b,c){
        	console.log(b+' '+c);
        },
        complete: function(a,b,c){
        	console.log(a);
        }
    });
    
});


var user_id_search = null;

function show_followers(id_user){
	screen_varios.title.html('<button class="close_window" onclick="screen_varios.hide();">x</button>Seguidores');
	screen_varios.show();
    screen_varios.wrapper.html('<br><img width="10%" style="margin: 0 auto; display: block;" src="img/loader.gif"/><br><br>');
    screen_varios.input.data('type','seguidores');
    user_id_search = id_user;
    console.log(id_user+" followers");
    $.ajax({
    	url: urlws,
        dataType: 'text',
        type: 'post',
        data: {
        	action: 'get_followers',
            app: 'La voz de Dios',
            pais: pais,
            user_login: user_login,
            user_pass: user_pass,
            timeOffset: timeOffset,
            id_user: user_id_search
        },
        success: function(a,b,c){
            screen_varios.wrapper.html(a);
        },
        error: function(a,b,c){
        	console.log(b+' '+c);
        },
        complete: function(a,b,c){
        }
    });
}

function show_following(id_user){
	screen_varios.title.html('<button class="close_window" onclick="screen_varios.hide();">x</button>Seguidos');
	screen_varios.show();
    screen_varios.wrapper.html('<br><img width="10%" style="margin: 0 auto; display: block;" src="img/loader.gif"/><br><br>');
    screen_varios.input.data('type','seguidos');
    screen_varios.input.val('');
    user_id_search = id_user;
    console.log(id_user+" followers");
    $.ajax({
    	url: urlws,
        dataType: 'text',
        type: 'post',
        data: {
        	action: 'get_following',
            app: 'La voz de Dios',
            pais: pais,
            user_login: user_login,
            user_pass: user_pass,
            timeOffset: timeOffset,
            id_user: user_id_search
        },
        success: function(a,b,c){
            screen_varios.wrapper.html(a);
        },
        error: function(a,b,c){
        	console.log(b+' '+c);
        },
        complete: function(a,b,c){
        }
    });
}

function show_friends_search(){	
    screen_varios.input.val('');
    screen_varios.input.data('type','people');
    screen_varios.title.html('<button class="close_window" onclick="screen_varios.hide();">x</button>Buscar amigos');
    screen_varios.wrapper.html('<br><br><img width="10%" style="margin: 0 auto; display: block;" src="img/loader.gif"/><br><br>');
    screen_varios.show();
    //ejecutamos la función de facebook.
    FB.api(
        '/me/friends',
        { fields: 'installed' },
        function(response) {
            if (response.error) {
            	console.log("error amigos facebok: "+JSON.stringify(response))
            	screen_varios.wrapper.html('');
            } else {
                var fb_friends = [];
		//recorro la respuesta de Facebook y guardo los id’s de facegook en el arreglo fb_friends vienen en formato 12348764538.
           	jQuery.each(response.data,function(idx,val){
                	if(val.installed==false) return true;
                    fb_friends.push(val.id);
                });
           
           	console.log(fb_friends);
           	//si viene vacío muestro en la pantalla que no hay mara.
                if(fb_friends.length == 0){
           	screen_varios.wrapper.html('<br><br><p style="text-align: center;">No se encontraron amigos</p>');
                    return true;
                }
           
                
           
		//ejecuto la función que mira los amigos esta en functions-movil de LVD.
                jQuery.ajax({
                    url: urlws,
                    dataType: 'html',
                    type: 'post',
                    data: {
                        action: 'get_already_friends_lvd',
                        app: 'La voz de Dios',
                        user_login: user_login,
                        user_pass: user_pass,
                        timeOffset: timeOffset,
                        friends_id: fb_friends,
                    },
                    success: function(a,b,c){
                        screen_varios.wrapper.html(a);
                        
                    },
                    error: function(a,b,c){
                        screen_varios.wrapper.html('<br><br><p style="text-align: center;">Ocurrio un imprevisto, intenta de nuevo.</p>');
                    },
                    complete: function(a,b,c){
                        
                    }
                });
            }
        }
    );    
}