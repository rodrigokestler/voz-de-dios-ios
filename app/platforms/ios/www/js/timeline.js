var refresh_interval = 120000;
var ajax_feed = null;
var hago_scroll = false;

var screen_timeline = $("#screen_timeline");
screen_timeline.wrapper = screen_timeline.find('wrapper');
screen_timeline.wrapper.on('scroll', function(event) {
	if(ajax_feed != null) return false;
	var st = $(this).scrollTop();
    var ih = $(this).innerHeight();
    if(st + ih >= this.scrollHeight) {
        screen_timeline.wrapper.append('<div id="loadmore"><br><br><img width="10%" style="margin: 0 auto; display: block;" src="img/loader.gif"/><br><br></div>');
        offset = $("post").length;
        console.log(offset);
    	get_feeds();
    }else if(st < -80){
    	offset = -1;
        screen_timeline.wrapper.scrollTop -= 40;
    	screen_timeline.wrapper.prepend('<div id="loadmore"><br><br><img width="10%" style="margin: 0 auto; display: block;" src="img/loader.gif"/><br><br></div>');
        get_feeds();
        return false;
    }
});
screen_timeline.nfeed = screen_timeline.find('nfeed');


function check_new_feed(){
	var highest_id = null;
	if(screen_timeline.wrapper.find('post').first().attr('data-id') != "") highest_id = screen_timeline.wrapper.find('post').first().data('id');
	else highest_id = screen_timeline.wrapper.find('post').first().next().data('id');

    var filtro = "todos";
    if(jQuery("#filtro_feeds_select").length > 0) filtro = jQuery("#filtro_feeds_select").val();
    
    offset = 0;

	$.ajax({
    	url: urlws,
        dataType: 'text',
        type: 'post',
        data: {
        	action: 	'check_new_feed',
            app: 		cat_name,
            user_login: user_login,
            user_pass: 	user_pass,
            hid: 		highest_id,
            timeOffset: timeOffset,
            filtro: 	filtro
        },
        success: function(a,b,c){
        	console.log("Check: "+a);
        	if(a=='true'){
           		console.log("hay nuevos posts");
                screen_timeline.nfeed.fadeIn('fast');
            }else {
           		console.log("nada nuevo");
                screen_timeline.nfeed.fadeOut('fast');
            }
        },
        error: function(a,b,c){
        	console.log(b+' '+c);
        },
        complete: function(a,b,c){ ajax_feed = null;
           console.log("Check: "+JSON.stringify(a));
        }
    });
}

function refresh_from_nfeed(){
	screen_timeline.nfeed.fadeOut('fast');
	offset = -1;
    screen_timeline.wrapper.scrollTop -= 40;
    screen_timeline.wrapper.prepend('<div id="loadmore"><br><br><img width="10%" style="margin: 0 auto; display: block;" src="img/loader.gif"/><br><br></div>');
    get_feeds();
    screen_timeline.wrapper.animate({scrollTop: 0},1000,null);
}

function get_feeds(){
    
    var filtro = "todos";
    if(jQuery("#filtro_feeds_select").length > 0) filtro = jQuery("#filtro_feeds_select").val();
    
    if(offset == -1) {
        offset = 0;
    }else if(offset==0){
    	screen_timeline.wrapper.html('<br><br><img width="10%" style="margin: 0 auto; display: block;" src="img/loader.gif"/><br><br>');
    }
    
	ajax_feed = $.ajax({
    	url: urlws,
        dataType: 'html',
        type: 'post',
        data: {
        	action: 	'get_feeds',
            app: 		cat_name,
            user_login: user_login,
            user_pass: 	user_pass,
            offset: 	offset,
            filtro: 	filtro,
            width: 		$(window).width(),
            timeOffset: timeOffset
        },
        success: function(a,b,c){
        	if(offset==0) screen_timeline.wrapper.html(a);
        	else {
            	$("#loadmore").remove();
            	screen_timeline.wrapper.append(a);
            }
        },
        error: function(a,b,c){
        	screen_timeline.wrapper.append('Occurió un imprevista, intenta de nuevo.');
        },
        complete: function(a,b,c){ ajax_feed = null;
            screen_timeline.wrapper.find("iframe").each(function(){
                var dis = $(this);
                dis.attr('width',"100%");
                dis.attr('height',jQuery(window).width()*0.8);
            });
            
            return true;
        }
    });
}

function button_share(obj){
    var img_url = $(obj).data('share');
    console.log(img_url);
    if(img_url==""){
        var id = $(obj).data('id');
        img_url = $("#content"+id).text();
        console.log(img_url);
        window.plugins.socialsharing.share(img_url);
    }else{
        window.plugins.socialsharing.share(null,null,img_url,add_points('share'),function(){ console.log('no lo bajo');});
    }
    return false;
}
            
function button_comment(obj){
    show_single(true,$(obj).data("id"));
    screen_single.wrapper[0].scrollTop = screen_single.wrapper.height();
    hago_scroll = true;
    return false;
}

function alike(obj){
	var dis = $(obj);
    var post_id = dis.data('id');
    var user_id = dis.data('user_id');
    var action = 'like';
    var text = dis.text();
    if(text=="") text = 0;
    var val = parseInt(dis.text());
    console.log(user_id+" "+post_id);
    if(dis.hasClass('liked')){
        dis.removeClass('liked');
        action = 'unlike';
        if(val>0) val--;
    }else{
    	dis.addClass('liked');
        action = 'like';
        val++;
        
    }
    dis.text(val);
    $.ajax({
    	url: urlws,
        dataType: 'text',
        type: 'post',
        data: {
        	action: 	action,
            app: 		cat_name,
            post_id: 	post_id,
            user_id: 	user_id,
            timeOffset: timeOffset
        },
        success: function(a,b,c){
        	console.log(a);
        },
        error: function(a,b,c){
        	console.log(b+' '+c);
        },
        complete: function(a,b,c){}
    });
    
}

var obj_report = null;
var obs_report = "";
function report(obj){
	obj_report = $(obj);
    
    if(obj_report.hasClass('reported')){
    	send_report();
    	return false;
    }
    
    navigator.notification.confirm(
    	'¿Por qué estás denunciando este contenido?',
        function(btn){
        	if(btn==1){
            	no_me_gusta();
            }else if(btn==2){
            	polemica();
            }else if(btn==3){
            	irrelevante();
            }
        },
        'Voz de Dios',
        ['Es inapropiado','Genera polémica','Es irrelevante','Cancelar']
    );
}

function no_me_gusta(){
	navigator.notification.confirm(
    	'¿Podrias detallar la naturaleza de tu denuncia?',
        function(btn){
        	if(btn==1){
            	obs_report = "Es pornográfico";
                send_report();
            }else if(btn==2){
            	obs_report = "Lenguaje obsceno";
                send_report();
            }else if(btn==3){
            	obs_report = "Es discriminatorio o sarcástico";
                send_report();
            }else if(btn==4){
            	obs_report = "Promueve drogas y/o armas";
                send_report();
            }else if(btn==5){
            	obs_report = "Promueve prácticas antinaturales";
                send_report();
            }
        },
        'Denuncia',
        ['Es pornográfico','Lenguaje obsceno','Es discriminatorio o sarcástico','Promueve drogas y/o armas','Promueve prácticas antinaturales','Cancelar']
    );
}

function polemica(){
	navigator.notification.confirm(
    	'¿Podrias detallar la naturaleza de tu denuncia?',
        function(btn){
        	if(btn==1){
            	obs_report = "Atenta contra principios y valores";
                send_report();
            }else if(btn==2){
            	obs_report = "Promueve debates religiosos";
                send_report();
            }else if(btn==3){
            	obs_report = "Cuestiona la fe cristiana";
                send_report();
            }else if(btn==4){
            	obs_report = "Ataca a una religión, sexo o étnia";
                send_report();
            }
        },
        'Denuncia',
        ['Atenta contra principios y valores','Promueve debates religiosos','Cuestiona la fe cristiana','Ataca a una religión, sexo o étnia','Cancelar']
    );
}

function irrelevante(){
	navigator.notification.confirm(
    	'¿Podrias detallar la naturaleza de tu denuncia?',
        function(btn){
        	if(btn==1){
            	obs_report = "No contribuye a la comunidad cristiana";
                send_report();
            }else if(btn==2){
            	obs_report = "Contenido humorístico absurdo";
                send_report();
            }else if(btn==3){
            	obs_report = "Promueve venta de otros servicios";
                send_report();
            }
        },
        'Denuncia',
        ['No contribuye a la comunidad','Contenido humorístico absurdo','Promueve venta de otros servicios','Cancelar']
    );
}

function send_report(){
	var post_id = obj_report.data('id');
    var user_id = obj_report.data('user_id');
    var action = 'report';
    console.log(user_id+" "+post_id);
    if(obj_report.hasClass('reported')){
        obj_report.removeClass('reported');
        action = 'unreport';
    }else{
    	obj_report.addClass('reported');
        action = 'report';
    }
    console.log("motivo: "+obs_report);
    $.ajax({
    	url: urlws,
        dataType: 'text',
        type: 'post',
        data: {
        	action: 	action,
            app: 		cat_name,
            post_id: 	post_id,
            user_id: 	user_id,
            timeOffset: timeOffset,
            motivo: 	obs_report
        },
        success: function(a,b,c){
        	console.log(a);
        },
        error: function(a,b,c){
        	console.log(b+' '+c);
        },
        complete: function(a,b,c){
        	obj_report = null;
        }
    });
}

var victim = null;
function remove_post(id_post){
	victim = id_post;
    navigator.notification.confirm(
    	'¿Estás seguro que deseas borrar esta publicación?',
        function(btn){
        	if(btn==1){
            	jQuery("#post-"+victim).fadeOut('fast');
            	jQuery.ajax({
                    url: urlws,
                    dataType: 'text',
                    type: 'post',
                    data: {
                        action: 	'remove_post_ws',
                        app: 		cat_name,
                        user_login: user_login,
                        user_pass: 	user_pass,
                        timeOffset: timeOffset,
                        post_id: 	victim
                    },
                    success: function(a,b,c){
                    	if(a=="ok") jQuery("#post-"+victim).remove();
                        else jQuery("#post-"+victim).fadeIn();
                    },
                    error: function(a,b,c){
                        console.log(b+' '+c);
                    },
                    complete: function(a,b,c){
                    	victim = null;
                    }
                });
            }
        },
        'Voz de Dios',
        ['Si','No']
    );
}