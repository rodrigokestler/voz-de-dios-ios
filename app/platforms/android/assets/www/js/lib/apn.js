var pushNotification;
var script = '';

function show_promos_apn(){
	screen_grupos.hide();
    screen_single_grupo.hide();
    screen_config.hide();
    screen_single.hide();
    screen_perfil.hide();
    screen_perfil_ext.hide();
    screen_consuelo.hide();
    screen_terms.hide();
    screen_registro.hide();
    screen_faqs.hide();    
    screen_write.hide();             
    ir_a_promos_ = false;
    jQuery("#noti_script").html(script);
}

function exec_noti(){
	show_screen("#screen_promos");
}

var ir_a_promos_ = false;

function onNotification(e) {    
    switch( e.event )
    {
    case 'registered':
        if ( e.regid.length > 0 )
        {
        	console.log('device token :) = ' + e.regid);
            user_token = e.regid;
            var login = window.localStorage.getItem("user_login");
    		var pass = window.localStorage.getItem("user_pass");
    		if(login != "" && isNaN(login)) {
    			jQuery("#user_login").val(login);
    		    jQuery("#user_pass").val(pass);
    			login_normal();
    		}else if(login != "") {    			
    			FB.init({ appId: "825295254244111", nativeInterface: CDV.FB, useCachedDialogs: false });            
    		}
        }
    break;

    case 'message':    	    	
        script = e.payload.script;
        if ( e.foreground ){        	
        	navigator.notification.confirm(
    			e.payload.alert+', ¿Deseas ir?',
                function(btn){
                    if(btn==1){
                        show_promos_apn();
                    }
                },
                'La voz de Dios',
                ['Si, vamos!','Ahora no']
            );
        }else{
            if ( e.coldstart )
            {
            	ir_a_promos_ = true;
            }
            else
            {
            	ir_a_promos_ = false;
                show_promos_apn();
            }
        }       
    break;

    case 'error':        
        console.log('device token error = ' + e.msg);        
        var login = window.localStorage.getItem("user_login");
		var pass = window.localStorage.getItem("user_pass");
		if(login != "" && isNaN(login)) {
			jQuery("#user_login").val(login);
		    jQuery("#user_pass").val(pass);
			login_normal();
		}else if(login != "") FB.init({ appId: "825295254244111", nativeInterface: CDV.FB, useCachedDialogs: false });
    break;

    default:
    	console.log('SEPA!!');        
	    var login = window.localStorage.getItem("user_login");
		var pass = window.localStorage.getItem("user_pass");
		if(login != "" && isNaN(login)) {
			jQuery("#user_login").val(login);
		    jQuery("#user_pass").val(pass);
			login_normal();
		}else if(login != "") FB.init({ appId: "825295254244111", nativeInterface: CDV.FB, useCachedDialogs: false });        
    break;
  }
}

function tokenHandler (result) {
    // Your iOS push server needs to know the token before it can push to this device
    // here is where you might want to send it the token for later use.
    console.log('device token = ' + result);
    user_token = result;
    FB.init({ appId: "825295254244111", nativeInterface: CDV.FB, useCachedDialogs: false });
}
// result contains any message sent from the plugin call
function successHandler (result) {
    console.log('result = ' + result);
    user_token = result;
    FB.init({ appId: "825295254244111", nativeInterface: CDV.FB, useCachedDialogs: false });
}
// result contains any error description text returned from the plugin call
function errorHandler (error) {
    console.log('error = ' + error);
    FB.init({ appId: "825295254244111", nativeInterface: CDV.FB, useCachedDialogs: false });
}

function setPushes(){
	if ( device.platform == 'android' || device.platform == 'Android' || device.platform == "amazon-fireos" ){
        pushNotification.register(
        successHandler,
        errorHandler,
        {
            "senderID":"823470517331",
            "ecb":"onNotification"
        });
    } else if ( device.platform == 'blackberry10'){
        pushNotification.register(
        successHandler,
        errorHandler,
        {
            invokeTargetId : "replace_with_invoke_target_id",
            appId: "replace_with_app_id",
            ppgUrl:"replace_with_ppg_url", //remove for BES pushes
            ecb: "pushNotificationHandler",
            simChangeCallback: replace_with_simChange_callback,
            pushTransportReadyCallback: replace_with_pushTransportReady_callback,
            launchApplicationOnPush: true
        });
    } else {
        pushNotification.register(
        	tokenHandler,
        	errorHandler,
            {
                "badge":"true",
                "sound":"true",
                "alert":"true",
                "ecb":"onNotificationAPN"
            }
        );
        
        console.log('pasa por aqui');
    }
}