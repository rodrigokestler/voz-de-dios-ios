//user login
var user_login = "";
var user_pass = "";
var user_img = '';
var user_name = '';
var user_data = {};
var user_token = null;
var offset = 0;

//register data
var new_user_login = "";
var new_user_pass = "";
var new_user_name = "";

//sobrepuestas
var screen_login = $("#screen_login");
screen_login.show = function(){focus_trivia = false; screen_login.removeClass('lefted');};
screen_login.hide = function(){focus_trivia = true; screen_login.addClass('lefted');};


var screen_registro = $("#screen_registro");
screen_registro.wrapper = screen_registro.find('wrapper');
screen_registro.show = function(){
	if(screen_registro.find('.loading').length > 0) return false;
	screen_registro.removeClass('downed');
};
screen_registro.hide = function(){
	if(screen_registro.find('.loading').length > 0) return false;
	screen_registro.addClass('downed');
};


function create_or_login_user_by_facebook_id(){
	if(screen_login.find('.loading').length > 0) return false;
    
	$("#button_facebook_connect").addClass("loading");
	$.ajax({
    	url: urlws,
        dataType: 'json',
        type: 'post',
        data: {
        	action: 		'create_or_login_user_by_facebook_id',
            app: 			cat_name,
            user_login: 	user_login,
            user_pass: 		user_pass,
            user_img: 		user_img,
            user_name: 		user_name,
            user_token: 	user_token,
            user_platform: 	device.platform,
            user_uuid: 		device.uuid,
            user_version: 	device.version,
            timeOffset: 	timeOffset
        },
        success: function(a,b,c){
        	console.log(JSON.stringify(a));
            user_data = a;
        },
        error: function(a,b,c){
        	console.log(b+' '+c);
        },
        complete: function(a,b,c){
        	if(user_data.msj==undefined){
            	get_feeds();
           
                screen_timeline.interval = setInterval(function(){
					check_new_feed();
				},refresh_interval);
                screen_timeline.nfeed.fadeOut('fast');
           
                screen_login.hide();
                screen_registro.hide();
            }else{
           		navigator.notification.alert('Usuario y/o contraseña incorrectos', null, app_name,'ok');
                user_data = {};
            }
            $("#button_facebook_connect").removeClass("loading");
        }
    });
}

function login_normal(){
	if(screen_login.find('.loading').length > 0) return false;
    
    user_login = $("#user_login").val();
    user_pass = $("#user_pass").val();
    
    if(user_login == "" || user_pass == ""){
    	navigator.notification.alert('Debes definir todos los campos', null, app_name,'ok');
    	return false;
    }
    
	$("#button_login").addClass("loading");
	$.ajax({
    	url: urlws,
        dataType: 'json',
        type: 'post',
        data: {
        	action: 		'login_normal',
            app: 			cat_name,
            user_login: 	user_login,
            user_pass: 		user_pass,
            user_token: 	user_token,
            user_platform: 	device.platform,
            user_uuid: 		device.uuid,
            user_version: 	device.version,
            timeOffset: 	timeOffset
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
           		get_feeds();
                screen_timeline.interval = setInterval(function(){
					check_new_feed();
				},refresh_interval);
                screen_timeline.nfeed.fadeOut('fast');
           
            	screen_login.hide();
                screen_registro.hide();
           
            }else{
            	window.localStorage.removeItem("user_login");
    			window.localStorage.removeItem("user_pass");
           		navigator.notification.alert(user_data.msj, null, app_name,'ok');
                user_data = {};
            }
            $("#button_login").removeClass("loading");
            $("#user_login").val("");
    		$("#user_pass").val("");
        }
    });
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
                	navigator.notification.alert('El correo no es válido',null,app_name,'ok');
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
                       	navigator.notification.alert(a,null,app_name,'ok');
                    },
                    error: function(a,b,c){
                        navigator.notification.alert('Ocurrió un imprevisto, intenta de nuevo.',null,app_name,'ok');
                    }
                });
            }
        },                  // callback to invoke
        'Voz de Dios',            // title
        ['Enviar','Cancelar'],             // buttonLabels
        ' '                 // defaultText
    );
}

function register(){
	if(screen_registro.find('.loading').length > 0) return false;

	new_user_login 	= $("#new_user_login").val();
    new_user_pass 	= $("#new_user_pass").val();
    new_user_name 	= $("#new_user_name").val();
    
    if(new_user_login == "" || new_user_pass == "" || new_user_name == ""){
    	navigator.notification.alert('Debes definir todos los campos', null, app_name,'ok');
    	return false;
    }

	$("#button_register").addClass("loading");
	$.ajax({
    	url: urlws,
        dataType: 'json',
        type: 'post',
        data: {
        	action: 		'register_new_user_ws',
            app: 			cat_name,
            user_login: 	new_user_login,
            user_pass: 		new_user_pass,
            user_name: 		new_user_name,
            user_img: 		"http://lvd.pizotesoft.com/wp-content/uploads/2015/08/Screen-Shot-2015-08-04-at-09.20.56.png",
            user_token: 	user_token,
            user_platform: 	device.platform,
            user_uuid: 		device.uuid,
            user_version: 	device.version,
            timeOffset: 	timeOffset
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
                login_normal();
                screen_registro.hide();
            }else{
            	window.localStorage.removeItem("user_login");
    			window.localStorage.removeItem("user_pass");
           		navigator.notification.alert(user_data.msj, null, app_name,'ok');
            }
            new_user_login = "";
            $("#new_user_login").val("");
    		new_user_pass = "";
            $("#new_user_pass").val("");
        }
    });
}

