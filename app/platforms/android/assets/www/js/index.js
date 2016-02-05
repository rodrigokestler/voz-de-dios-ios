var timeOffset = 0;
var recordatorio = 0;
var screen_to_hide = [];
var scroll_suscripcion = false;

function recordatorio_fn(){
	if(user_data==null || user_data==undefined || user_data=={}) return false;
	var re = window.localStorage.getItem("recordatorio");
	if(re==null){
		var re = new Date();
        re.setDate(re.getDate()+1);
        window.localStorage.setItem("recordatorio",re.getTime());
    }else{
    	var now = new Date().getTime();
		var diff = (now-re)/1000*60*60*24;
        if(diff >= 1){
        	show_recordatorio();
        }
    }
}

function mostrar_diapositivas_gratis(){
	var re = window.localStorage.getItem("fremium"+user_login);
    if(re==null){
        show_info('freemium');
        window.localStorage.setItem("fremium"+user_login,'ya');
    }
    console.log('pasa por aqui');
}

function show_recordatorio(){		
	navigator.notification.confirm(
        '¿Te gustaría compartir ahora VOZ DE DIOS con algún contacto?',
        function onConfirm(buttonIndex) {
            if(buttonIndex==1){
                invite();
            }
            var re = new Date();
            re.setDate(re.getDate()+1);
            window.localStorage.setItem("recordatorio",re.getTime());
        },
        'Voz de Dios',
        ['Sí, vamos','Cancelar']
    );
}

function backbutton(){
	if(screen_to_hide.length > 0){		
		screen_to_hide.pop().hide();
		SoftKeyboard.hide();
		return false;
	}	
	console.log(screen_login[0].outerHTML);	
	if(screen_login.hasClass('lefted')) {
		cordova.exec(function() {}, function(){}, 'Home', 'goHome', []);
		return false; 		
	}
	navigator.app.exitApp();
	return false;
}

function deviceready() {
	
	var d = new Date()
	var n = d.getTimezoneOffset()/60;
	timeOffset = parseInt(n*-1);
    console.log(timeOffset);

	window.onerror = function(message, url, lineNumber) {
        console.log("Error: "+message+" in "+url+" at line "+lineNumber);
    }
    
    document.addEventListener('resume', recordatorio_fn, false);
    document.addEventListener('backbutton', backbutton, false);    
	
    FastClick.attach(document.body);
    pushNotification = window.plugins.pushNotification;
    setPushes();   
    
  
}

document.addEventListener('deviceready', deviceready, false);
