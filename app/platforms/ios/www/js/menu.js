var screen_config = $("#screen_config");
screen_config.show = function(){focus_trivia = false; screen_config.removeClass('lefted');};
screen_config.hide = function(){focus_trivia = true; screen_config.addClass('lefted');};
//screen_config[0].addEventListener('touchmove',function(e){e.preventDefault();},false);


function logout() {
    if(jQuery(".logout").hasClass("loading")) return false;
    jQuery(".logout").addClass("loading");
    if(FBSTATUS){
    	FB.logout(function(response) {
    		setTimeout(function(){window.location = window.location;},2000);
	    });
    }else{
    	setTimeout(function(){window.location = window.location;},2000);
    }
    window.localStorage.removeItem("user_login");
    window.localStorage.removeItem("user_pass");
    user_token = null;
	pushNotification.unregister(successHandler, errorHandler, {});
}

function invite(){
    window.plugins.socialsharing.share('Hola, te invito a descargar el APP VOZ DE DIOS para alimentar y fortalecer nuestra fe. '+url_share,null,null,null,function(){ add_points('invite'); console.log('no lo bajo');});
}
