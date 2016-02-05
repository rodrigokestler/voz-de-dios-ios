var terms_conds = [
   '<p>Servicio de suscripción para usuarios CLARO COSTA RICA y con renovación automática semanal de C.1,900 IVA Incluido. Para cancelar suscripción envía mensaje de texto con las palabras SALIR DIOS al 7050.</p>',
   '<p>Servicio de suscripción para usuarios CLARO EL SALVADOR y con renovación automática semanal de $3 ISV Incluido. Para cancelar suscripción envía mensaje de texto con las palabras SALIR CIELO al 7050.</p>',
   '<p>Servicio de suscripción para usuarios CLARO GUATEMALA y con renovación automática semanal de Q28. Para cancelar suscripción envía mensaje de texto con las palabras SALIR DIOS al 7050.</p>',
   '<p>Servicio de suscripción para usuarios CLARO HONDURAS y con renovación automática semanal de L.70 ISV Incluido. Para cancelar suscripción envía un mensaje de texto con las palabras SALIR BIBLIA al 7050.</p>',
   '<p>Servicio de suscripción para usuarios CLARO NICARAGUA y con renovación automática semanal de $3 Imp. Incluido. Para cancelar suscripción envía mensaje de texto con las palabras SALIR DIOS al 7050.</p>'
];

var number_text = [
   'AMEN-7050',
   'CIELO-7050',
   'AMEN-7050',
   'AMEN-7050',
   'AMEN-7050'
];

var screen_perfil = $("#screen_perfil");
screen_perfil.wrapper = screen_perfil.find('wrapper');
screen_perfil.show = function(){screen_perfil.removeClass('downed');};
screen_perfil.hide = function(){
	screen_perfil.wrapper.html('');
	screen_perfil.addClass('downed');
};

var screen_perfil_ext = $("#screen_perfil_ext");
screen_perfil_ext.wrapper = screen_perfil_ext.find('wrapper');
screen_perfil_ext.show = function(){ console.log('hola'); screen_perfil_ext.removeClass('righted');};
screen_perfil_ext.hide = function(){
	screen_perfil_ext.wrapper.html('');
	screen_perfil_ext.addClass('righted');
};

function show_perfil(op,user_id,event){
	if(user_id==1||user_id==20||user_id==19) return false;
	console.log(user_id+" ID profile");
	if(op){
        screen_config.addClass("left");
        screen_perfil.removeClass("downed");
        get_perfil(user_id);
    }else{
    	if(ajax_perfil!=null){
        	ajax_perfil.abort();
            ajax_perfil = null;
        }
    	screen_perfil.addClass("downed");
    }
    return false;
}

var ajax_perfil = null;
function get_perfil(user_id){
	if(user_id==1||user_id==20||user_id==19) return false;
	screen_perfil.wrapper.html('<br><br><img width="10%" style="margin: 0 auto; display: block;" src="img/loader.gif"/><br><br>');
    screen_perfil.find('screen_title').html('<button class="close_window" onclick="screen_perfil.hide()">x</button>');
	ajax_perfil = $.ajax({
    	url: urlws,
        dataType: 'html',
        type: 'post',
        data: {
        	action: 	'get_perfil',
            app: 		cat_name,
            user_login: user_login,
            user_pass: 	user_pass,
            user_id: 	user_id,
            timeOffset: timeOffset
        },
        success: function(a,b,c){
        	screen_perfil.wrapper.html(a);
        },
        error: function(a,b,c){
        	console.log(b+' '+c);
        },
        complete: function(a,b,c){ ajax_perfil = null;
        
        
        	if(scroll_suscripcion == true){
            	scroll_suscripcion = false;
            	screen_perfil.wrapper.animate(
                	{
                        scrollTop: jQuery(screen_perfil.wrapper).height()+1000
                    },
                    1000,
                    null
                );
            }
        
        }
    });
}

var sms_ = null;
function enviarSMS(numero,frase){
	
	if(sms_==null){
		navigator.notification.alert('Debes seleccionar un operador', null, app_name,'ok');
    	return false;
    }
	
	var options = {
        replaceLineBreaks: false, // true to replace \n by a new line, false by default
        android: {
            intent: 'INTENT'  // send SMS with the native android SMS messaging
            //intent: '' // send SMS without open any other app
        }
    };
	var pais = $("#operador")[0].selectedIndex;
	var success = function () {
    	console.log('Message sent successfully');
    	send_suscription();
    };
    var error = function (e) {
    	console.log('Message Failed:' + e);
    	send_suscription();
    };
    sms.send(sms_[1], sms_[0], options, success, error);
}

function exit_suscription(op){
	focus_trivia = false;    
    sms_ = number_salir[op].split('-');
    var options = {
        replaceLineBreaks: false, // true to replace \n by a new line, false by default
        android: {
            intent: 'INTENT'  // send SMS with the native android SMS messaging
            //intent: '' // send SMS without open any other app
        }
    };
	var success = function () {
    	console.log('Message sent successfully');
    	send_desuscription();
    };
    var error = function (e) {
    	console.log('Message Failed:' + e);
    	send_desuscription();
    };
    sms.send(sms_[1], sms_[0], options, success, error);
}

function show_terms_new(){
	focus_trivia = false;
    var pais = $("#operador")[0].selectedIndex;
    if(pais==0){
    	$("#operador").next().html("Si no encuentras a tu operador es porque este servicio no está aún disponible para ese operador. Esta nota desaparece cuando selecciona un operador.");
    	sms_ = null;
    	return false;
    }    
    pais--;
    console.log(pais);
    sms_ = number_text[pais].split('-');
    $("#tel").attr("style","");
    $("#check_number").attr("style","text-align: center;");
    if(jQuery("#send_suscription").length > 0) jQuery("#send_suscription").attr("style","display: none !important; text-align: center;");            
    $(".terms_intruc").html(terms_conds[pais]);
    screen_perfil.wrapper.animate(
    	{
            scrollTop: jQuery(screen_perfil.wrapper).height()+1000
        },
        1000,
        null
    );
}

function check_number(){
	if($("#check_number").hasClass("loading")) return false;
		
	var tel = $("#tel").val();
	var ope = $("#operador").val();
    
	if(tel=="" || ope==""){
		return false;
	}
    
    $("#check_number").addClass("loading");
    console.log(tel+" "+ope);
    $.ajax({
        url: urlws,
        dataType: 'html',
        type: 'post',
        data: {
            action: 	'update_meta_app',
            app: 		cat_name,
            user_login: user_login,
            user_pass: 	user_pass,
            tel: 		tel,
            ope: 		ope,
            timeOffset: timeOffset          
        },
        success: function(a,b,c){
            console.log(a);
            screen_perfil.wrapper.append(a);
        },
        error: function(a,b,c){
            console.log(b+' '+c);
        },
        complete: function(a,b,c){
        	$("#check_number").removeClass("loading");  
        	if(typeof hide_check_number != 'undefined'){
        		$("#check_number").attr("style","display: none !important;");
        	}
        	
        }
    });
}

var ajax_perfil_ext = null;
function get_perfil_ext(user_id){
	if(user_id==1||user_id==20||user_id==19) return false;
    screen_perfil_ext.show();
	screen_perfil_ext.wrapper.html('<br><br><img width="10%" style="margin: 0 auto; display: block;" src="img/loader.gif"/><br><br>');
    screen_perfil_ext.find('screen_title').html('<button class="close_window" onclick="screen_perfil_ext.hide()">&larr;</button>');
	ajax_perfil_ext = $.ajax({
    	url: urlws,
        dataType: 'html',
        type: 'post',
        data: {
        	action: 	'get_perfil_ext',
            app: 		cat_name,
            user_login: user_login,
            user_pass: 	user_pass,
            user_id: 	user_id,
            timeOffset: timeOffset
        },
        success: function(a,b,c){
        	screen_perfil_ext.wrapper.html(a);
        },
        error: function(a,b,c){
        	console.log(b+' '+c);
        },
        complete: function(a,b,c){ ajax_perfil_ext = null;
        }
    });
}

/*funciones para cambiar la foto*/

function cambiar_foto(){
	if(IMG_URI_PROFILE!=null){
    	return false;
    }

	if(isNaN(user_login)){
    	navigator.notification.confirm(
            '¿Desde dónde deseas seleccionar la foto?',
            function(btn){
                if(btn==1){
                    useCameraProfile();
                }else if(btn==2){
                    useFileProfile();
                }
            },
            app_name,
            ['Cámara','Álbum','Cancelar']
        );
    }else{
    	navigator.notification.alert('Tu foto se obtiene de facebook, se actualiza sola.',null,app_name,'ok');
    }
}

/*FOTO CONTROLLES*/
var IMG_URI_PROFILE = null;
var LAST_IMG = null;
function fotoSeleccionadaProfile(imageURI){
	LAST_IMG = jQuery(".user_pic").find('img').attr('src');
	IMG_URI_PROFILE = imageURI;
    jQuery(".user_pic").find('img').attr('src',IMG_URI_PROFILE);
    //subirfoto y guardarla
    
    var url = urlws;
    
    var options = new FileUploadOptions();
    var params = {};
    
    options.mimeType = 'image/jpeg';
    params.image_user = "true";
    params.video_user = "false";
    
    options.fileKey  = "file";
    options.fileName = IMG_URI_PROFILE.substr(IMG_URI_PROFILE.lastIndexOf('/')+1);
    options.chunkedMode = false;
    
    params.action ='update_image_ws';
    params.user_login = user_login;
    params.user_pass = user_pass;
    params.app = 'La voz de Dios';
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
        IMG_URI_PROFILE,
        encodeURI(url),
        function(r) {
        	console.log(r);
            LAST_IMG = null;
			IMG_URI_PROFILE = null;
        },
        function(error) {
        	console.log(r);
            jQuery(".user_pic").find('img').attr('src',LAST_IMG);
            LAST_IMG = null;
			IMG_URI_PROFILE = null;
            navigator.notification.alert('Ocurrio un imprevisto, intenta de nuevo.',null,app_name,'ok');
        }, options
    );
    
}

function onFailProfile(){
	IMG_URI_PROFILE = null;
}

function useCameraProfile(){
    navigator.camera.getPicture(
    	fotoSeleccionadaProfile,
        onFailProfile,
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

function useFileProfile(){
	navigator.camera.getPicture(
    	fotoSeleccionadaProfile,
        onFailProfile,
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

/*follow*/

function afollow(obj){
	var dis = $(obj);
    var user_id = dis.data('user_id');
    var me_id = dis.data('me_id');
    var action = 'follow';
    
    if(dis.hasClass('follow')){
        dis.removeClass('follow');
        dis.html("seguir");
        action = 'unfollow';
    	var ss = parseInt($("#seguidores1").html());
        ss--;
        $("#seguidores1").html(ss);
        ss = parseInt($("#seguidos0").html());
        ss--;
        $("#seguidos0").html(ss);
    }else{
    	dis.addClass('follow');
        dis.html("dejar de seguir");
        action = 'follow';
        var ss = parseInt($("#seguidores1").html());
        ss++;
        $("#seguidores1").html(ss);
        ss = parseInt($("#seguidos0").html());
        ss++;
        $("#seguidos0").html(ss);
    }
    
    $.ajax({
    	url: urlws,
        dataType: 'text',
        type: 'post',
        data: {
        	action: 	action,
            app: 		cat_name,
            me_id: 		me_id,
            user_id: 	user_id,
            timeOffset: timeOffset
        },
        success: function(a,b,c){
        	console.log(a);
        },
        error: function(a,b,c){
        	console.log(b+' '+c);
        },
        complete: function(a,b,c){
        	screen_varios.input.keyup();
        }
    });
    
}

var sus_data = null;
function send_suscription(){
	if($("#send_suscription").hasClass('loading')) return false;
    
    var tel = $("#tel").val();
    var operador = $("#operador").val();
    
	$("#send_suscription").addClass("loading");
	$.ajax({
    	url: urlws,
        dataType: 'text',
        type: 'post',
        data: {
        	action: 'send_suscription',
            app: 'La voz de Dios',
            user_login: user_login,
            user_pass: user_pass,
            operador: operador,
            tel: tel,
            timeOffset: timeOffset
        },
        success: function(a,b,c){
        	console.log(a);
            if(a!="") user_data.data.premium = a;
            else{
           		user_data.data.premium = null;
            	delete user_data.data.premium;
            }
        },
        error: function(a,b,c){
        	console.log(b+' '+c);
            user_data.data.premium = null;
            delete user_data.data.premium;
        },
        complete: function(a,b,c){
        	console.log(a);
            if(user_data.data.premium != undefined){
           		navigator.notification.alert("Ahora participas automáticamente de todas nuestras promociones, acumulas dobles puntos en trivias acertadas, puedes compartir peticiones de oración y adicionalmente, cada semana recibirás vía mensaje de texto un acceso para descargar música cristiana e inspiradoras imágenes de fe.",
                function(){
                	show_perfil(true,user_data.ID);
                    show_info('premium');
                    get_feeds();
                }, '¡Felicidades ya eres Miembro Premier!','ok');
            }else{
           		navigator.notification.alert("Ocurrio un imprevisto, intenta de nuevo.", null, 'Voz de Dios','ok');
            }
            $("#send_suscription").removeClass("loading");
        }
    });
}

function send_desuscription(){
	
    $.ajax({
        url: urlws,
        dataType: 'text',
        type: 'post',
        data: {
            action: 'send_desuscription',
            app: 'La voz de Dios',
            user_login: user_login,
            user_pass: user_pass,			            
            timeOffset: timeOffset
        },
        success: function(a,b,c){        	
            if(a=="ok"){
                user_data.data.premium = null;
                delete user_data.data.premium;
            }
        },
        error: function(a,b,c){
            console.log(b+' '+c);			            
        },
        complete: function(a,b,c){
            console.log(a);
            if(user_data.data.premium == undefined){
                navigator.notification.alert("Tu suscripcion ha sido cancelada", show_perfil(true,user_data.ID), 'Voz de Dios','ok');
            }else{
                navigator.notification.alert("Ocurrio un imprevisto, intenta de nuevo.", null, 'Voz de Dios','ok');
            }
            $("#send_desuscription").removeClass("loading");
        }
    });
}
