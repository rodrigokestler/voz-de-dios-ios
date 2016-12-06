var ajax_suscription_web = null;
var ref = null;
var altaweb = {
	
    app_name: 'Voz de Dios',
    
    url_alta : 'http://146.82.89.83/websubscription2/responsive.aspx?idGrupo=147',
    
    key_pin: 'websubscription2/Pin.aspx',
    
    key_success: 'welcome.html',
    
    key_error: 'error.html',
    
    alert_message: 'Necesitas tener una conexión activa a internet para poder suscribirte, ¿deseas enviar un msj para suscribirte?',
    
    enviar_sms: function(){
    	//codigo para enviar msj.
    	enviarSMS();
        
    },
    
    send_suscription: function(){
    	//aqui el codigo para enviar que muestre las cosas premium.
    	if(ajax_suscription_web==null){
    		ajax_suscription_web = $.ajax({
                url: urlws,
                dataType: 'html',
                type: 'post',
                data: {
                    action: 'send_suscription',
                    user_login: user_login,
                    user_pass: user_pass,
                    app: 'La voz de Dios'
                },
                success: function(a,b,c){
                    console.log("send suscription: "+a);
                    if(user_estado=='freemium'){
    	                window.localStorage.setItem('estado','premium');
    	                user_estado = 'premium';
    	                console.log(user_estado);
    	                //$('#impresion').html("<p style='font-weight:bold;'>Ya eres miembro PREMIER y puedes disfrutar de todos sus beneficios.</p>");
    	                $('#impresion').html('<span id="impresion"><p style="font-weight:bold;">Ya eres miembro PREMIER y puedes disfrutar de todos sus beneficios.</p><button id="send_suscription" onclick="screen_faqs.show();screen_faqs.wrapper.scrollTop(h2_top);">Dejar de ser miembro premier</button></span>');
    	                $("#operador").next().html(""); 
                	}else if(user_estado=='premium'){
                		window.localStorage.setItem('estado','freemium');
    	                user_estado = 'freemium';
    	                console.log(user_estado);
    	                $('#impresion').html('<span id="impresion"><button id="send_suscription" onclick="altaweb.register();">Continuar</button></span>');
    	                $("#operador").next().html("");
                	}
                },
                error: function(a,b,c){
                    console.log(b+' '+c);
                },
                complete: function(a,b,c){
                	ajax_suscription_web = null;
                }
            });
    	}
    },
    
    get_url_based_on_contype: function(){
    	var urlpin = window.localStorage.getItem('urlpin');
        console.log("dejo cargado: "+urlpin);
    	if(urlpin!=null && urlpin!="") return urlpin;
    
    	var networkState = navigator.connection && navigator.connection.type;
        if(networkState!=Connection.UNKNOWN && networkState!=Connection.NONE) return this.url_alta;
        else return "";
    },
    
    register: function(){
    	
    	var url = this.get_url_based_on_contype();

        if(url==""){
        	navigator.notification.alert(this.alert_message, this.enviar_sms, [this.app_name], ["ok"])
        	return false;
        }
        var width = jQuery(window).width();
        var height = jQuery(window).height();
        ref = window.open(url,'_blank','clearsessioncache=yes,location=no,closebuttoncaption=Regresar,resizable=no,height='+height+',width='+width);

        ref.addEventListener(
            'loadstop',
            function(event){//lblPrefijo
            	ref.executeScript({file:'https://ajax.googleapis.com/ajax/libs/jquery/1.12.0/jquery.min.js'},function(){});
            	ref.executeScript({code:'document.getElementById("lblPrefijo").innerHTML ="'+pre_fijo+'";document.getElementById("ddlOperador").value ="'+operador_iframe+'";document.getElementById("txtMsisdn").value = "'+no_telefono+'";'},function(){});
            }//ddlOperador
        );
        ref.addEventListener(
        	'loadstart',
        	 load_start
        );
        
    }
};
var load_start = function(event) {
	console.log("Carga esta url: "+event.url);
	if(event.url.indexOf(altaweb.key_pin) >= 0){
    	window.localStorage.setItem('urlpin',event.url);
        console.log("entro key_pin");
    }else if(event.url.indexOf(altaweb.key_success) >= 0){
    	window.localStorage.removeItem('urlpin');
        ref.removeEventListener('loadstart', load_start);
        setTimeout(function(){
        	ref.close();
        },3000);
        console.log("entro key_success");
        altaweb.send_suscription();
    }else if(event.url.indexOf(altaweb.key_error) >= 0){
        console.log("entro key_error");
        setTimeout(function(){
        	ref.close();
        },3000);
    }
};
function updateNumberOfDays() {
    $('#days').html('');
    month = $('#months').val();
    year = $('#years').val();
    days = daysInMonth(month, year);

    for (i = 1; i < days + 1 ; i++) {
        $('#days').append($('<option />').val(i).html(i));
    }
    new_user_birthday = new Date($('#years').val(),$("#months").val()-1,$("#days").val());
    console.log(new_user_birthday);

}

function daysInMonth(month, year) {
    return new Date(year, month, 0).getDate();
}

function dateDiff(dateold, datenew) {
    var ynew = datenew.getFullYear();
    var mnew = datenew.getMonth();
    var dnew = datenew.getDate();
    var yold = dateold.getFullYear();
    var mold = dateold.getMonth();
    var dold = dateold.getDate();
    var diff = ynew - yold;
    if (mold > mnew) diff--;
    else {
        if (mold == mnew) {
            if (dold > dnew) diff--;
        }
    }
    return diff;
}

var agregar_options = function(){
    for (i = new Date().getFullYear() ; i > 1900; i--) {
        $('#years').append($('<option />').val(i).html(i));
    }

    for (i = 1; i < 13; i++) {
        $('#months').append($('<option />').val(i).html(i));
    }
    updateNumberOfDays();

    $('#years, #months').change(function () {

        updateNumberOfDays();

    });

//});
};