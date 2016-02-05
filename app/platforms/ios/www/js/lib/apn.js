var pushNotification;
var ir_a_promos_ = false;

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

// iOS
function onNotificationAPN (event) {
    if ( event.alert )
    {
        if(event.foreground == "0"){
        	if(jQuery.isEmptyObject(user_data)){
            	ir_a_promos_ = true;
            }else{
            	ir_a_promos_ = false;
                show_promos_apn();
            }
        	
        }else{
        	ir_a_promos_ = false;
        	navigator.notification.confirm(
                'Acaban de publicar una nueva promoción, ¿Deseas verla?',
                function(btn){
                    if(btn==1){
                        show_promos_apn();
                    }
                },
                'La voz de Dios',
                ['Sí, vamos','Cancelar']     // buttonLabels
            );
        	
        
        }
    }
    console.log('hola');
}

function tokenHandler (result) {
    // Your iOS push server needs to know the token before it can push to this device
    // here is where you might want to send it the token for later use.
    console.log('APN token = ' + result);
    user_token = result;
    FB.init({ appId: "825295254244111", nativeInterface: CDV.FB, useCachedDialogs: false });
}
// result contains any error description text returned from the plugin call
function errorHandler (error) {
    console.log('APN error = ' + error);
    FB.init({ appId: "825295254244111", nativeInterface: CDV.FB, useCachedDialogs: false });
}

function setPushes(){
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
}