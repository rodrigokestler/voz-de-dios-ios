
var screen_grupos = $("#screen_grupos");
screen_grupos.wrapper = screen_grupos.find('wrapper');
screen_grupos.title = screen_grupos.find('screen_title');
screen_grupos.show = function(){
	screen_grupos.removeClass('downed');	
	screen_to_hide.push(screen_grupos);
};
screen_grupos.hide = function(){
	screen_grupos.wrapper.html('');
    screen_grupos.input.val('');
	screen_grupos.addClass('downed');
};
screen_grupos.ajax_search = null;

var screen_single_grupo = $("#screen_single_grupo");
screen_single_grupo.wrapper = screen_single_grupo.find('wrapper');
screen_single_grupo.title = screen_single_grupo.find('screen_title');
screen_single_grupo.show = function(){
	screen_single_grupo.removeClass('righted');
	screen_to_hide.push(screen_single_grupo);	
};
screen_single_grupo.hide = function(){
	screen_single_grupo.wrapper.html('');
	screen_single_grupo.addClass('righted');
};


var nombre_nuevo_grupo = '';
var grupo_actual = 0;

screen_grupos.input = screen_grupos.find('#search_grupos');
screen_grupos.input.keyup(function(){
	var dis = $(this);
	var val = dis.val();
    
    if(screen_grupos.ajax_search!=null){
    	screen_grupos.ajax_search.abort();
        screen_grupos.ajax_search = null;
    }
    
    var data = 	{
        action: 'search_grupos',
        app: 'La voz de Dios',
        pais: pais,
        timeOffset: timeOffset,
        id_user: user_id_search,
        s: val,
        user_login: user_login,
        user_pass: user_pass,
    };
    
    console.log(urlws);
    console.log(data);
    
            
    screen_grupos.wrapper.html('<br><img width="10%" style="margin: 0 auto; display: block;" src="img/loader.gif"/><br><br>');
    screen_grupos.ajax_search = $.ajax({
    	url: urlws,
        dataType: 'text',
        type: 'post',
        data: data,
        success: function(a,b,c){
            screen_grupos.wrapper.html(a);
        },
        error: function(a,b,c){
        	console.log(b+' '+c);
        },
        complete: function(a,b,c){
            screen_grupos.ajax_search = null;
        }
    });
    
});

function add_grupo(){
	if(jQuery('.add_grupo').hasClass('loading')) return false;
	jQuery('.add_grupo').addClass('loading');
	navigator.notification.prompt(
        'Ingrese el nombre de la tribu',
        function onPrompt(results) {
            if(results.buttonIndex == 1 && results.input1 != ""){
            	nombre_nuevo_grupo = results.input1;
                create_grupo();
                return false;
            }
            jQuery('.add_grupo').removeClass('loading');
        },
        'Nueva tribu',
        ['Crear','Cancelar'],
        ''
    );
}

function create_grupo(){
	var data = 	{
        action: 'create_grupo',
        app: 'La voz de Dios',
        pais: pais,
        timeOffset: timeOffset,
        user_login: user_login,
        user_pass: user_pass,
        nombre_grupo: nombre_nuevo_grupo
    };
    
    screen_grupos.ajax_search = $.ajax({
    	url: urlws,
        dataType: 'text',
        type: 'post',
        data: data,
        success: function(a,b,c){
            screen_grupos.wrapper.html(a);
            jQuery('.add_grupo').remove();
        },
        error: function(a,b,c){
        	jQuery('.add_grupo').removeClass('loading');
        	console.log(b+' '+c);
            user_data.data.grupo = null;
            delete user_data.data.grupo;
            navigator.notification.alert('Ocurrio un imprevisto, intenta de nuevo', null, 'Voz de Dios','ok');
        },
        complete: function(a,b,c){
        	
        }
    });
}

function delete_grupo(obj){
	var dis = $(obj);
    
    if(dis.hasClass('loading')) return false;
    dis.addClass('loading')
    
    var grupo_id = dis.data('grupo_id');
    var me_id = dis.data('me_id');
    var action = 'follow';
    
    var data = 	{
        action: 'delete_grupo',
        app: 'La voz de Dios',
        pais: pais,
        timeOffset: timeOffset,
        user_login: user_login,
        user_pass: user_pass,
        grupo_id: grupo_id
    };
    
    $.ajax({
    	url: urlws,
        dataType: 'text',
        type: 'post',
        data: data,
        success: function(a,b,c){
            screen_single_grupo.wrapper.append(a);
        },
        error: function(a,b,c){
        	console.log(b+' '+c);
        },
        complete: function(a,b,c){
        	console.log(a);
			if($('.button_delete_grupo').length) $('.button_delete_grupo').removeClass('loading');
        }
    });
    
}

function show_my_grupos(){

	var present = window.localStorage.getItem('ya_tribus');
    if(present==null){
    	show_info('tribus');
        window.localStorage.setItem('ya_tribus','ya');
    }

	screen_grupos.wrapper.html('<br><img width="10%" style="margin: 0 auto; display: block;" src="img/loader.gif"/><br><br>');
    screen_grupos.show();
    if(user_data.data.grupo == undefined) screen_grupos.title.html('<button class="close_window" onclick="screen_grupos.hide();">x</button>Tribus<button class="add_grupo" onclick="add_grupo();">Crear grupo</button>');
    else screen_grupos.title.html('<button class="close_window" onclick="screen_grupos.hide();">x</button>Tribus');
    
    
    var data = 	{
        action: 'get_my_grupo',
        app: 'La voz de Dios',
        pais: pais,
        timeOffset: timeOffset,
        user_login: user_login,
        user_pass: user_pass,
    };
    
    $.ajax({
    	url: urlws,
        dataType: 'text',
        type: 'post',
        data: data,
        success: function(a,b,c){
            screen_grupos.wrapper.html(a);
        },
        error: function(a,b,c){
        	console.log(b+' '+c);
        },
        complete: function(a,b,c){

        }
    });
}

function show_single_grupo(grupo_id){
    grupo_actual = grupo_id;
    screen_single_grupo.show();
    
    var data = 	{
        action: 'get_single_grupo',
        app: 'La voz de Dios',
        pais: pais,
        timeOffset: timeOffset,
        grupo_id: grupo_id,
        user_login: user_login,
        user_pass: user_pass,
    };
            
    screen_single_grupo.wrapper.html('<br><img width="10%" style="margin: 0 auto; display: block;" src="img/loader.gif"/><br><br>');
    $.ajax({
    	url: urlws,
        dataType: 'text',
        type: 'post',
        data: data,
        success: function(a,b,c){
            screen_single_grupo.wrapper.html(a);
        },
        error: function(a,b,c){
        	console.log(b+' '+c);
        },
        complete: function(a,b,c){

        }
    });
}

function ajoin(obj){
	var dis = $(obj);
    
    if(dis.hasClass('loading')) return false;
    
    var grupo_id = dis.data('grupo_id');
    var me_id = dis.data('me_id');
    var action = 'follow';
    
    if(dis.hasClass('join')){
        dis.removeClass('join');
        dis.html("uniser al grupo");
        action = 'unjoin_grupo';
    	var ss = parseInt($("#miembros").html());
        ss--;
        $("#miembros").html(ss);
    }else{
    	dis.addClass('join');
        dis.html("dejar de seguir");
        action = 'join_grupo';
        var ss = parseInt($("#miembros").html());
        ss++;
        $("#miembros").html(ss);
    }
    
    dis.addClass("loading");
    
    $.ajax({
    	url: urlws,
        dataType: 'text',
        type: 'post',
        data: {
        	action: action,
            app: 'La voz de Dios',
            me_id: me_id,
            grupo_id: grupo_id,
            pais: pais,
            timeOffset: timeOffset,
            user_login: user_login,
            user_pass: user_pass
        },
        success: function(a,b,c){
        	screen_single_grupo.append(a);
        },
        error: function(a,b,c){
        	console.log(b+' '+c);
        },
        complete: function(a,b,c){
        	screen_grupos.input.keyup();
        }
    });
    
}

/*funciones para cambiar la foto*/

function cambiar_foto_grupo(){
	if(IMG_URI_PROFILE_GRUPO!=null){
    	return false;
    }
	
    navigator.notification.confirm(
        'Deseas actualizar tu foto, ¿de donde la tomamos?',
        function(btn){
            if(btn==1){
                useCameraProfile_grupo();
            }else if(btn==2){
                useFileProfile_grupo();
            }
        },
        'Voz de Dios',
        ['Camara','Album','Cancelar']
    );
    
}

var IMG_URI_PROFILE_GRUPO = null;
var LAST_IMG_GRUPO = null;
function fotoSeleccionadaProfile_grupo(imageURI){
	LAST_IMG_GRUPO = jQuery(".grupo_pic").find('img').attr('src');
	IMG_URI_PROFILE_GRUPO = imageURI;
    jQuery(".grupo_pic").find('img').attr('src',IMG_URI_PROFILE_GRUPO);
    //subirfoto y guardarla
    
    var url = urlws;
    
    var options = new FileUploadOptions();
    var params = {};
    
    options.mimeType = 'image/jpeg';
    params.image_user = "true";
    params.video_user = "false";
    
    options.fileKey  = "file";
    options.fileName = IMG_URI_PROFILE_GRUPO.substr(IMG_URI_PROFILE_GRUPO.lastIndexOf('/')+1);
    options.chunkedMode = false;
    
    params.action ='update_image_ws_grupo';
    params.user_login = user_login;
    params.user_pass = user_pass;
    params.app = 'La voz de Dios';
    params.grupo_id = grupo_actual;
    options.params = params;
    
    
    
    var ft = new FileTransfer();
    ft.onprogress = function(progressEvent) {
        if (progressEvent.lengthComputable) {
            console.log(parseInt(progressEvent.loaded / progressEvent.total * 100)+"%");
        } else {
            console.log("otro");
        }
    };
    
    ft.upload(
        IMG_URI_PROFILE_GRUPO,
        encodeURI(url),
        function(r) {
        	console.log(r);
            LAST_IMG = null;
			IMG_URI_PROFILE_GRUPO = null;
        },
        function(error) {
        	console.log(r);
            jQuery(".grupo_pic").find('img').attr('src',LAST_IMG_GRUPO);
            LAST_IMG_GRUPO = null;
			IMG_URI_PROFILE_GRUPO = null;
            navigator.notification.alert('Ocurrio un imprevisto, intenta de nuevo.',null,'Voz de Dios','ok');
        }, options
    );
    
}

function onFailProfile_grupo(){
	IMG_URI_PROFILE_GRUPO = null;
}

function useCameraProfile_grupo(){
    navigator.camera.getPicture(
    	fotoSeleccionadaProfile_grupo,
        onFailProfile_grupo,
        { 	quality: 49,
        	destinationType: navigator.camera.DestinationType.FILE_URI,
            sourceType: navigator.camera.PictureSourceType.CAMERA,
            encodingType : navigator.camera.EncodingType.JPEG,
            allowEdit : true,
            targetWidth : 320,
    		targetHeight : 320,
            correctOrientation: true
        }
    );
}

function useFileProfile_grupo(){
	navigator.camera.getPicture(
    	fotoSeleccionadaProfile_grupo,
        onFailProfile_grupo,
     	{
        	quality: 49,
        	destinationType: navigator.camera.DestinationType.FILE_URI,
		    sourceType: navigator.camera.PictureSourceType.SAVEDPHOTOALBUM,
            encodingType : navigator.camera.EncodingType.JPEG,
            allowEdit : true,
            targetWidth : 320,
    		targetHeight : 320,
            correctOrientation: true
        }
    );
}

function publicar_grupo_redes(src,url){
	window.plugins.socialsharing.share(null,null,url,src,function(){ console.log('bien bajado'); button_share_promo = null;},function(){ console.log('no lo bajo'); button_share_promo = null;});
}

function publicar_grupo_muro(name){
	$(".pgmbutton").addClass('loading');
    var si = false;
	$.ajax({
        url: urlws,
        dataType: 'html',
        type: 'post',
        data: {
            action: 'publish_post',
            app: 'La voz de Dios',
            user_login: user_login,
            user_pass: user_pass,
            content: '¡Los invito a unirse a mi TRIBU <strong>"'+name+'"</strong> para construir juntos el TEMPLO DE DIOS!',
            title: '¡Te invito a mi tribu!',
            pais: pais,
            plegaria: 0,
            timeOffset: timeOffset
        },
        success: function(a,b,c){
           	si = true;
        },
        error: function(a,b,c){
           
        },
        complete: function(a,b,c){
        	if(si){
                offset = 0;
                get_feeds();
                jQuery(".pgmbutton").removeClass('loading');
           		navigator.notification.alert('Tu mensaje ha sido publicado con éxito.', null, 'Voz de Dios');
            }else{
           		navigator.notification.alert('Ocurrio un imprevisto, intenta de nuevo', null, 'Voz de Dios');
            }                     
        }
    });
}
