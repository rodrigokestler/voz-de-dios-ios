var $ = jQuery;

//pantallas
//SCREEN AYUDA
var screen_ayuda = $("#screen_ayuda");
var screen_sugerencias = $("#screen_sugerencia");
var screen_fallas = $("#screen_falla");
var screen_acercade = $("#screen_acercade");

var screen_promos = $("#screen_promos");
screen_promos.wrapper = screen_promos.find('wrapper');
screen_promos.scroller = screen_promos.find('scroller');
screen_promos.promos = {};
screen_promos.slider = null;

//sobrepuestas
var screen_login = $("#screen_login");
screen_login.show = function(){
	focus_trivia = false; 
	screen_login.removeClass('lefted');	
};
screen_login.hide = function(){focus_trivia = true; screen_login.addClass('lefted');};

var screen_faqs = $("#screen_faqs");
var h2_top = $('#dejar_premier_h2').position().top;
screen_faqs.wrapper = screen_faqs.find('wrapper');
screen_faqs.show = function(){
	focus_trivia = false; 
	screen_faqs.removeClass('downed');
	screen_to_hide.push(screen_faqs);	
};
screen_faqs.hide = function(){focus_trivia = true; screen_faqs.addClass('downed');};

var screen_reglamento = $("#screen_reglamento");
screen_reglamento.show = function(){
	focus_trivia = false; 
	screen_reglamento.removeClass('downed');
	screen_to_hide.push(screen_reglamento);
};
screen_reglamento.hide = function(){focus_trivia = true;  screen_reglamento.addClass('downed');};


var screen_config = $("#screen_config");
screen_config.show = function(){
	focus_trivia = false; 
	screen_config.removeClass('lefted');
	screen_to_hide.push(screen_config);	
};
screen_config.hide = function(){focus_trivia = true; screen_config.addClass('lefted');};


var screen_terms = $("#screen_terms");
screen_terms.wrapper = screen_terms.find('wrapper');
screen_terms.show = function(){
	focus_trivia = false;
    var pais = $("#operador")[0].selectedIndex;
    if(pais==0){
    	navigator.notification.alert('Debes seleccionar un operador', null, 'Voz de Dios','ok');
    	return false;
    }
    var tel = $("#tel").val();
    if(tel==""){
    	navigator.notification.alert('Debes ingresar un número de teléfono', null, 'Voz de Dios','ok');
        return false;
    }
    pais--;
    console.log(pais);
    screen_terms.wrapper.html(terms_conds[pais]);
    screen_terms.removeClass('downed');	
};
screen_terms.hide = function(){focus_trivia = true; screen_terms.addClass('downed');};


var screen_registro = $("#screen_registro");
screen_registro.wrapper = screen_registro.find('wrapper');
screen_registro.show = function(){
	screen_registro.removeClass('downed');	
	screen_to_hide.push(screen_registro);
};
screen_registro.hide = function(){screen_registro.addClass('downed');};

//6. Ayuda

screen_ayuda.show = function(){
	console.log("Entro show ayuda");
    focus_trivia = false;
    screen_ayuda.removeClass('downed');
    screen_to_hide.push(screen_ayuda);
}
screen_ayuda.hide = function(){
	console.log("entro salir ayuda");
    focus_trivia = true;
    screen_ayuda.addClass('downed');
}
screen_fallas.show = function(){
    focus_trivia = false;
    screen_fallas.removeClass('righted');
    screen_to_hide.push(screen_fallas);
}
screen_fallas.hide = function(){
    focus_trivia = true;
    screen_fallas.addClass('righted');
}
screen_sugerencias.show = function(){
    focus_trivia = false;
    screen_sugerencias.removeClass('righted');
    screen_to_hide.push(screen_sugerencias);
}
screen_sugerencias.hide = function(){
    focus_trivia = true;
    screen_sugerencias.addClass('righted');
}
screen_acercade.show = function(){
    focus_trivia = false;
    screen_acercade.removeClass('righted');
    screen_to_hide.push(screen_acercade);
}
screen_acercade.hide = function(){
    focus_trivia = true;
    screen_acercade.addClass('righted');
}	

//ajax
var urlws = 'http://lvd.pizotesoft.com/';
//urlws = 'http://app.clx.mobi/';

//user login
var user_email = '';
var user_login = "";
var user_pass = "";
var user_img = '';
var user_name = '';
var pais = '';
var user_data = {};
var user_token = null;
var offset = 0;

var ajax_trivia = null;
var cur_screen = "#screen_timeline";

//media
var sonido_correcto = null;

function show_screen(screen){
	var misma = false;
	if(cur_screen==screen) {
    	misma = true;
    }else{
    	if(cur_screen == '#screen_trivia'){
            
            if(puntos_sesion>0 && show_points == true) {
            	navigator.notification.alert('¡Has acumulado '+puntos_sesion+' puntos en trivias! Sigue jugando para demostrar tu conocimiento sobre la biblia.', null, 'Voz de Dios','Ok');
            }
            puntos_sesion = 0;
            show_points = true;
            add_points('equis');
        }
    	cur_screen = screen;
    }

	$("screen").each(function(){
    	var dis = $(this);
        if(dis.hasClass("no_normal")) return true;
        if(!dis.hasClass("hidden")) dis.addClass("hidden");
    });
    
    $(screen).removeClass("hidden");
    $(".button_footer.selected").removeClass("selected");
    
    if(screen=="#screen_trivia"){
    	$("#b1").addClass("selected");
    	if(!misma) get_trivia();
    }else if(screen=="#screen_timeline"){
    	$("#b0").addClass("selected");
    	if(misma) {
        	get_feeds();
        	offset = 0;
        }
    }else if(screen=="#screen_promos"){
    	$("#b3").addClass("selected");
    	if(misma) get_promos();
    }else if(screen=="#screen_perfil"){
    	console.log("entro screen perfil");
    	get_perfil(user_data.ID);
    	$("#b9").addClass("selected");
    	
    }
    
}

function on_load(img){
	var i = $(img);
    i.attr('style','opacity: 1;');
    i.parent().parent().css('background-image','none');
}

function swipedetect(el, callback){
  
    var touchsurface = el,
    swipedir,
    startX,
    startY,
    distX,
    distY,
    threshold = 150, //required min distance traveled to be considered swipe
    restraint = 100, // maximum distance allowed at the same time in perpendicular direction
    allowedTime = 300, // maximum time allowed to travel that distance
    elapsedTime,
    startTime,
    handleswipe = callback || function(swipedir){}
  
    touchsurface.addEventListener('touchstart', function(e){
        var touchobj = e.changedTouches[0];
        swipedir = 'none';
        dist = 0;
        startX = touchobj.pageX;
        startY = touchobj.pageY;
        startTime = new Date().getTime(); // record time when finger first makes contact with surface
        //e.preventDefault();
    }, false)
  
    touchsurface.addEventListener('touchmove', function(e){
        //e.preventDefault(); // prevent scrolling when inside DIV
    }, false)
  
    touchsurface.addEventListener('touchend', function(e){
        var touchobj = e.changedTouches[0]
        distX = touchobj.pageX - startX // get horizontal dist traveled by finger while in contact with surface
        distY = touchobj.pageY - startY // get vertical dist traveled by finger while in contact with surface
        elapsedTime = new Date().getTime() - startTime // get time elapsed
        if (elapsedTime <= allowedTime){ // first condition for awipe met
            if (Math.abs(distX) >= threshold && Math.abs(distY) <= restraint){ // 2nd condition for horizontal swipe met
                swipedir = (distX < 0)? 'left' : 'right' // if dist traveled is negative, it indicates left swipe
            }else{
            	swipedir = 'none';
            }
            /*
            else if (Math.abs(distY) >= threshold && Math.abs(distX) <= restraint){ // 2nd condition for vertical swipe met
                swipedir = (distY < 0)? 'up' : 'down' // if dist traveled is negative, it indicates up swipe
            }
        	*/
        }
        handleswipe(swipedir);
        e.preventDefault();
    }, false)
}

function create_or_login_user_by_facebook_id(){
	$("#button_facebook_connect").addClass("loading");
	$.ajax({
    	url: urlws,
        dataType: 'json',
        type: 'post',
        data: {
        	action: 'create_or_login_user_by_facebook_id',
            app: 'La voz de Dios',
            user_birthday:user_birthday,
            user_gender:user_gender,
            user_email: user_email,
            user_login: user_login,
            user_pass: user_pass,
            user_img: user_img,
            user_name: user_name,
            user_token: user_token,
            user_platform: device.platform,
            user_uuid: device.uuid,
            user_version: device.version,
            pais: pais,
            user: user_token,
            timeOffset: timeOffset
        },
        success: function(a,b,c){
        	console.log(JSON.stringify(a));
            user_data = a;
        },
        error: function(a,b,c){
        	console.log(b+' '+c);
        	user_data = {
    			msj: 'Ocurrió un imprevisto, intenta de nuevo.'
        	};
            //navigator.notification.alert('Ocurrio un imprevisto, intenta de nuevo.', null, 'La voz de Dios','ok');
        },
        complete: function(a,b,c){
        	if(user_data.msj==undefined){
        		window.localStorage.setItem('estado',user_data.data.estado);
    			window.localStorage.setItem("user_login",user_login);
    			window.localStorage.setItem("user_pass",user_pass);
    			user_estado = user_data.data.estado;
    			console.log("estado: "+user_estado);
    			
           		screen_login.hide();
                get_feeds();
                get_promos();
                get_trivia();
                mostrar_diapositivas_gratis();
                if(ir_a_promos_){
           			show_promos_apn();
                }
                //refreshfeed
                screen_timeline.interval = setInterval(function(){
					check_new_feed();
				},refresh_interval);
                screen_timeline.nfeed.fadeOut('fast');
                
                screen_timeline.wrapper.find("iframe").each(function(){
                    var dis = $(this);
                    dis.attr('width',"100%");
                    dis.attr('height',jQuery(window).width()*0.8);
                });
                
            }else{
           		navigator.notification.alert(user_data.msj, null, 'Voz de Dios','ok');
                user_data = {};
            }
            $("#button_facebook_connect").removeClass("loading");
        }
    });
}

var new_user_login = "";
var new_user_pass = "";
var new_user_name = "";
var new_user_country = '';
var new_user_birthday = '';
var new_user_gender = '';
function register(){
	if($("#button_register").hasClass('loading')) return false;

	new_user_login = $("#new_user_login").val();
    new_user_pass = $("#new_user_pass").val();
    new_user_name = $("#new_user_name").val();
    new_user_country = $("#new_user_country").val();
    new_user_birthday = new Date($('#years').val(),$("#months").val()-1,$("#days").val());
    new_user_gender =  $("#genero_register").val();
    
    console.log(new_user_country);
    if(new_user_login == "" || new_user_pass == "" || new_user_name == "" || new_user_country==null || new_user_gender ==null){
    	navigator.notification.alert('Debes definir todos los campos', null, 'Voz de Dios','Ok');
    	return false;
    }

	$("#button_register").addClass("loading");
	$.ajax({
    	url: urlws,
        dataType: 'json',
        type: 'post',
        timeout:10000,
        data: {
        	action: 'register_new_user_ws',
            app: 'La voz de Dios',
            user_birthday: new_user_birthday,
            user_gender: new_user_gender,
            user_email: new_user_login,
            user_login: new_user_login,
            user_pass: new_user_pass,
            user_name: new_user_name,
            user_img: "http://app.clx.mobi/wp-content/uploads/2015/08/Screen-Shot-2015-08-04-at-09.20.56.png",            
            user_token: user_token,
            user_platform: device.platform,
            user_uuid: device.uuid,
            user_version: device.version,
            pais: pais,
            timeOffset: timeOffset
        },
        success: function(a,b,c){
        	console.log(JSON.stringify(a));
            user_data = a;
        },
        error: function(a,b,c){
        	console.log(b+' '+c);
            user_data = {msj: 'Ocurrio un imprevisto, intenta de nuevo!'};
        },
        complete: function(a,b,c){
        	console.log(a);
            $("#button_register").removeClass("loading");
        	if(user_data.msj==undefined){
        		
            	window.localStorage.setItem("user_login",new_user_login);
    			window.localStorage.setItem("user_pass",new_user_pass);
                $("#user_login").val(new_user_login);
                $("#user_pass").val(new_user_pass);
                screen_registro.hide();
                login_normal();
                //nuevo
                if(user_data.data.estado!='freemium' || user_data.data.estado!='premium'){
    				user_data.data.estado = 'freemium';
    			}
    			window.localStorage.setItem('estado',user_data.data.estado);
                
            }else{
            	window.localStorage.setItem("user_login","");
    			window.localStorage.setItem("user_pass","");
           		navigator.notification.alert(user_data.msj, null, 'Voz de Dios','ok');
            }
            new_user_login = "";
            $("#new_user_login").val("");
    		new_user_pass = "";
            $("#new_user_pass").val("");
        }
    });
}

function login_normal(){
	if($("#button_login").hasClass('loading')) return false;
    
    user_login = $("#user_login").val();
    user_pass = $("#user_pass").val();
    
    if(user_login == "" || user_pass == ""){
    	navigator.notification.alert('Debes definir todos los campos', null, 'Voz de Dios','ok');
    	return false;
    }
    
	$("#button_login").addClass("loading");
	$.ajax({
    	url: urlws,
        dataType: 'json',
        type: 'post',
        timeout:10000,
        data: {
        	action: 'login_normal',
            app: 'La voz de Dios',
            user_email:user_login,
            user_login: user_login,
            user_pass: user_pass,
            user_token: user_token,
            user_platform: device.platform,
            user_uuid: device.uuid,
            user_version: device.version,
            pais: pais,
            timeOffset: timeOffset
        },
        success: function(a,b,c){
            user_data = a;
            console.log(user_data);            
        },
        error: function(a,b,c){
        	console.log(b+' '+c);
            user_data = {msj: 'Ocurrio un imprevisto, intenta de nuevo!'};
        },
        complete: function(a,b,c){
        	if(user_data.msj==undefined){
            	window.localStorage.setItem("user_login",user_login);
    			window.localStorage.setItem("user_pass",user_pass);
    			//nuevo
    			/*if(user_data.data.estado!='freemium' || user_data.data.estado!='premium'){
    				user_data.data.estado = 'freemium';
    			}*/
    			window.localStorage.setItem('estado',user_data.data.estado);
    			user_estado = user_data.data.estado;
    			console.log("user estado "+user_estado);
    			//
            	get_feeds();
                get_promos();
                get_trivia();
           		screen_login.hide();
                screen_registro.hide();
                mostrar_diapositivas_gratis();
                if(ir_a_promos_){
           			show_promos_apn();
                }
                //refreshfeed
                screen_timeline.interval = setInterval(function(){
					check_new_feed();
				},refresh_interval);
				screen_timeline.nfeed.fadeOut('fast');
				
				screen_timeline.wrapper.find("iframe").each(function(){
                    var dis = $(this);
                    dis.attr('width',"100%");
                    dis.attr('height',jQuery(window).width()*0.8);
                });
				
            }else{
            	window.localStorage.setItem("user_login","");
    			window.localStorage.setItem("user_pass","");
           		navigator.notification.alert(user_data.msj, null, 'Voz de Dios','ok');
                user_data = {};
            }
            $("#button_login").removeClass("loading");
            $("#user_login").val("");
    		$("#user_pass").val("");
        }
    });
}

function show_write(op){
	
	if(op) {
    	
		screen_write.wrapper.find('#motivador').removeClass('none');
        screen_write.wrapper.find('.instruc_publish').removeClass('none');
		
    	if(user_data.data.premium != undefined){
         	
        }else{
//        	screen_write.wrapper.find('#motivador').addClass('none');
//            screen_write.wrapper.find('.instruc_publish').addClass('none');
        }
        
    	if(jQuery('.attach').length > 0) jQuery('.attach').remove();
        screen_write.wrapper.find('input').val('');
        screen_write.wrapper.find('textarea').val('');
        screen_write.wrapper.find('.nombre_oracion').addClass('none');
        jQuery('#nombre_oracion').addClass('none');
        screen_write.wrapper.find('#motivador').val('');
    	screen_write.show();
    }else screen_write.addClass("downed");
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

var sus_data = null;
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
var ajax_add_points = null;
function add_points(op){
	console.log(op);
	if(ajax_add_points!=null){return false;}
	ajax_add_points = $.ajax({
        url: urlws,
        dataType: 'html',
        type: 'post',
        data: {
            action: 'add_points',
            op: op,
            user_login: user_login,
            user_pass: user_pass,
            app: 'La voz de Dios',
            pais: pais,
            timeOffset: timeOffset
        },
        success: function(a,b,c){
        },
        error: function(a,b,c){
            console.log(b+' '+c);
        },
        complete: function(a,b,c){
        	ajax_add_points = null;
        	
        }
    });

}

function invite(){
	var url = 'http://app.clx.mobi/';
    window.plugins.socialsharing.share('Hola, te invito a descargar el APP VOZ DE DIOS para alimentar y fortalecer nuestra fe. '+url,null,null,null,function(){ add_points('invite'); console.log('no lo bajo');});
}

var screen_zoom = null;
function show_zoom(img){
	var html = '<screen id="screen_zoom" class="no_normal">'+
                    '<wrapper id="img_zoom_wrapper"><div id="img_zoom_scroller"><img width="100%" src="'+img+'"/></div><button style="z-index:10;" class="close_window" onclick="hide_zoom()">x</button></wrapper>'                 
                    +'</screen>';
	screen_zoom = jQuery(html);
    
    jQuery('body').append(screen_zoom);
    
    screen_zoom.hide = function(){
    	hide_zoom();
    };
    
    screen_zoom.zoom = new IScroll('#img_zoom_wrapper', {
		zoom: true,
		scrollX: true,
		scrollY: true,
		mouseWheel: true,
		wheelAction: 'zoom'
	});
    
    screen_to_hide.push(screen_zoom);
    
}

function hide_zoom(){
	screen_zoom.zoom.destroy();
	screen_zoom.remove();
    screen_zoom = null;
}

function get_lost_password(){
	navigator.notification.prompt(
        'Por favor ingresa tu correo electrónico con el que te registraste.',  // message
        function(results) {
        	if(results.buttonIndex==1){
            	var correo = results.input1;
                if(correo==" " || correo=="") return false;
                var partes = correo.split("@");
                if(partes.length!=2) {
                	navigator.notification.alert('El correo no es válido',null,'Voz de Dios','ok');
                	return false;
                }
                $.ajax({
                    url: urlws,
                    dataType: 'html',
                    type: 'post',
                    timeout: 5000,
                    data: {
                        action: 'get_lost_password',
                        app: 'La voz de Dios',
                        correo: correo,
                        pais: pais,
                        timeOffset: timeOffset
                    },
                    success: function(a,b,c){
                       	navigator.notification.alert(a,null,'Voz de Dios','ok');
                    },
                    error: function(a,b,c){
                        navigator.notification.alert('Ocurrió un imprevisto, intenta de nuevo.',null,'Voz de Dios','ok');
                    }
                });
            }
        },                  // callback to invoke
        'Voz de Dios',            // title
        ['Enviar','Cancelar'],             // buttonLabels
        ' '                 // defaultText
    );
}

