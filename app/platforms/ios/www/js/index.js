//globales
var $ = jQuery;

var urlws = 'http://lvd.pizotesoft.com/';
var app_name = 'Voz de Dios';
var cat_name = 'La voz de Dios';
var url_share = 'http://lvd.pizotesoft.com/';

var timeOffset = 0;
var recordatorio = 0;
var scroll_suscripcion = false;
var cur_screen = "#screen_timeline";

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
        },            // callback to invoke with index of button pressed
        'Voz de Dios',           // title
        ['Sí, vamos','Cancelar']     // buttonLabels
    );
}

function show_screen(screen){
	var misma = false;
	if(cur_screen==screen) {
    	misma = true;
    }else{
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
    }
    
}

function on_load(img){
	var i = $(img);
    i.attr('style','opacity: 1;');
    i.parent().parent().css('background-image','none');
}

function add_points(op){
	console.log(op);
	$.ajax({
        url: urlws,
        dataType: 'html',
        type: 'post',
        data: {
            action: 	'add_points',
            app: 		cat_name,
            op: 		op,
            user_login: user_login,
            user_pass: 	user_pass,
            timeOffset: timeOffset
        },
        success: function(a,b,c){
        },
        error: function(a,b,c){
            console.log(b+' '+c);
        },
        complete: function(a,b,c){
        	console.log();
        }
    });

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
    
	
    FastClick.attach(document.body);
    
    //FB.init({ appId: "825295254244111", nativeInterface: CDV.FB, useCachedDialogs: false });    
    pushNotification = window.plugins.pushNotification;
    setPushes();
    
    return true;
    
    var el = document.getElementById('screen_timeline');
    swipedetect(el, function(swipedir){
        if (swipedir =='right') screen_config.show();
        else if (swipedir == 'left') screen_config.hide();
    });
    
    el = document.getElementById('screen_config');
    swipedetect(el, function(swipedir){
        if (swipedir =='right') screen_config.show();
        else if (swipedir == 'left') screen_config.hide();
    });
    
    el = document.getElementById('screen_trivia');
    swipedetect(el, function(swipedir){
        if (swipedir =='right') screen_config.show();
        else if (swipedir == 'left') screen_config.hide();
    });
    
    el = document.getElementById('screen_single');
    swipedetect(el, function(swipedir){
        if (swipedir =='right') screen_config.show();
        else if (swipedir == 'left') screen_config.hide();
    });
    
}
document.addEventListener('deviceready', deviceready, false);
