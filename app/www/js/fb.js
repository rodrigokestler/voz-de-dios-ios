var FBSTATUS = false;
var ajax_fb = false;


FB.Event.subscribe('auth.login', function(response) {
	console.log('auth.login event');
});

FB.Event.subscribe('auth.logout', function(response) {
    console.log('auth.logout event');
});

FB.Event.subscribe('auth.sessionChange', function(response) {
    console.log('auth.sessionChange event');
});

FB.Event.subscribe('auth.statusChange', function(response) {
    console.log('auth.statusChange event');
    getLoginStatus();
});

function getLoginStatus() {
	if(ajax_fb) return false;
    FB.getLoginStatus(function(response) {
        if (response.status == 'connected') {
            FBSTATUS = true;
            me();
            console.log('FB conectado');
        } else {
        	FBSTATUS = false;
            console.log('FB desconectado getLoginStatus()');
            
            var uu = window.localStorage.getItem("user_login");
            var pp = window.localStorage.getItem("user_pass");
            
            console.log(uu+"==="+pp);
            
            if(uu!="" && pp!="" && uu!=null && pp!=null){
            	$("#user_login").val(uu);
	    		$("#user_pass").val(pp);
            	login_normal();
            }
    	}
    });
}

function me() {
	if(ajax_fb) return false;
    ajax_fb = true;
    FB.api(
        '/me',
        { fields: 'id, name,email,gender,birthday' },
        function(response) {
            if (response.error) {
                console.log(JSON.stringify(response.error));
                navigator.notification.alert(
                    'No se pudo conectar con facebook, intenta de nuevo.',  // message
                    null,         // callback
                    'Voz de Dios',            // title
                    'ok :('                  // buttonName
                );
            } else {
            	console.log(JSON.stringify(response));
                if(typeof response.birthday != 'undefined'){
                	parts = response.birthday.split("/");
                    user_birthday = new Date(parts[2],parts[0]-1,parts[1]);
                }else{
                	user_birthday = new Date(1915,0,1);
                }
                user_gender = response.gender;
                console.log(JSON.stringify(response));
                user_email = response.email;
                user_login = response.id;
                user_pass = response.id;
                user_name = response.name;
                user_img = 'http://graph.facebook.com/' + user_login + '/picture?type=large';
           		console.log(user_login+" "+user_name+" "+user_img);
           		create_or_login_user_by_facebook_id();
                FBSTATUS = true;
            }
            ajax_fb = false;
        }
    );
}

function fb_logout() {
    
    if(jQuery(".logout").hasClass("loading")) return false;
    
    jQuery(".logout").addClass("loading");
    
    if(FBSTATUS){
    	FB.logout(function(response) {
    		setTimeout(function(){window.location = window.location;},2000);
	    });
    }else{
    	setTimeout(function(){window.location = window.location;},2000);
    }
    pushNotification.unregister(successHandler, errorHandler, {});
    window.localStorage.setItem("user_login","");
    window.localStorage.setItem("user_pass","");
    user_token = null;
	
    
}

function fb_login() {
	try{
	    FB.login(
	        function(response) {
	        	console.log(JSON.stringify(response));
	            if (response.status == "connected"){
	                me();
	            }else {
	             	FBSTATUS = false;
	             	navigator.notification.alert(
	                    'No se pudo conectar con facebook, intenta de nuevo.',  // message
	                    null,         // callback
	                    'Voz de Dios',            // title
	                    'ok :('                  // buttonName
	                );
	            }
	        },
	        { scope: "user_friends, email" }
	    );
	}
	catch(error){}
	finally{
		console.log("finally loginFacebook");
		//$("#button_facebook_connect").removeClass("loading");
	}
}

function facebookWallPost() {
    console.log('Debug 1');
    var params = {
        method: 'feed',
        name: 'Facebook Dialogs',
        link: 'https://developers.facebook.com/docs/reference/dialogs/',
        picture: 'http://fbrell.com/f8.jpg',
        caption: 'Reference Documentation',
        description: 'Dialogs provide a simple, consistent interface for applications to interface with users.'
      };
    console.log(params);
    FB.ui(params, function(obj) { console.log(obj);});
}

function publishStoryFriend() {
    var randNum = Math.floor ( Math.random() * friendIDs.length );

    var friendID = friendIDs[randNum];
    if (friendID == undefined){
        alert('please click the me button to get a list of friends first');
    }else{
        console.log("friend id: " + friendID );
        console.log('Opening a dialog for friendID: ', friendID);
        var params = {
            method: 'feed',
            to: friendID.toString(),
            name: 'Facebook Dialogs',
            link: 'https://developers.facebook.com/docs/reference/dialogs/',
            picture: 'http://fbrell.com/f8.jpg',
            caption: 'Reference Documentation',
            description: 'Dialogs provide a simple, consistent interface for applications to interface with users.'
        };
        FB.ui(params, function(obj) { console.log(obj);});
    }
}