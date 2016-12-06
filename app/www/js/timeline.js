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

var refresh_interval = 120000;

function check_new_feed(){
	var highest_id = null;
	if(screen_timeline.wrapper.find('post').first().attr('data-id') != "") {
		highest_id = screen_timeline.wrapper.find('post').first().data('id');
		}
	else {
		highest_id = screen_timeline.wrapper.find('post').first().next().data('id');
		}
	console.log("highest_id "+highest_id);
	var filtro = "todos";
    if(jQuery("#filtro_feeds_select").length > 0) filtro = jQuery("#filtro_feeds_select").val();
	
	$.ajax({
    	url: urlws,
        dataType: 'text',
        type: 'post',
        data: {
        	action: 'check_new_feed',
            app: 'La voz de Dios',
            user_login: user_login,
            user_pass: user_pass,            
            hid: highest_id,
            timeOffset: timeOffset,
            filtro: filtro
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

var ajax_feed = null;
var hago_scroll = false;
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
        	action: 'get_feeds',
            app: 'La voz de Dios',
            user_login: user_login,
            user_pass: user_pass,
            pais: pais,
            offset: offset,
            filtro: filtro,
            width: $(window).width(),
            timeOffset: timeOffset
        },
        success: function(a,b,c){
        	if(offset==0) screen_timeline.wrapper.html(a);
        	else {
            	$("#loadmore").remove();
            	screen_timeline.wrapper.append(a);
            }
        	//console.log(a);
        },
        error: function(a,b,c){
        	console.log(b+' '+c);
        },
        complete: function(a,b,c){ ajax_feed = null;
        	$(".button_share").click(function(){
                var img_url = $(this).data('share');
                console.log(img_url);
                if(img_url==""){
                    var id = $(this).data('id');
                    img_url = $("#content"+id).text();
                    console.log(img_url);
                    window.plugins.socialsharing.share(img_url);
                }else{
                	window.plugins.socialsharing.share(null,null,img_url,add_points('share'),function(){ console.log('no lo bajo');});
                }
                return false;
            });
            
            $(".button_comment").click(function(){
                show_single(true,$(this).data("id"));
                screen_single.wrapper[0].scrollTop = screen_single.wrapper.height();
                hago_scroll = true;
                return false;
            });
            $(".button_like").click(function(){
                return false;
            });
            
            screen_timeline.wrapper.find("iframe").each(function(){
                var dis = $(this);
                dis.attr('width',"100%");
                dis.attr('height',jQuery(window).width()*0.8);
            });
            
            return true;            
        }
    });
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
        	action: action,
            app: 'La voz de Dios',
            post_id: post_id,
            user_id: user_id,
            pais: pais,
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
    $("#myModal").modal();
    /*
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
    );*/
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
var active_form_report = '';
var name_input_report = '';
function id_type_report(){
	switch($('input[name=denun]:checked', '#denuncia_opciones').val()){
		case "1":
			$("#denuncia_opciones").css("display","none");
			$("#form_inapropiado").css("display","block");
			$("#form_polemica").css("display","none");
			$("#form_irrelevante").css("display","none");
			
			$("#continuar_report").css("display","none");
			$("#send_report").css("display","inline");
			$("#return_report").css("display","inline");
			name_input_report = 'inap';
			active_form_report="#form_inapropiado";
			$("#report_messages").html("");
			break;
		case "2":
			$("#denuncia_opciones").css("display","none");
			$("#form_inapropiado").css("display","none");
			$("#form_polemica").css("display","block");
			$("#form_irrelevante").css("display","none");
			
			$("#continuar_report").css("display","none");
			$("#send_report").css("display","inline");
			$("#return_report").css("display","inline");
			name_input_report = 'pol';
			active_form_report="#form_polemica";
			$("#report_messages").html("");
			break;
		case "3":
			$("#denuncia_opciones").css("display","none");
			$("#form_inapropiado").css("display","none");
			$("#form_polemica").css("display","none");
			$("#form_irrelevante").css("display","block");
			
			$("#continuar_report").css("display","none");
			$("#send_report").css("display","inline");
			$("#return_report").css("display","inline");
			name_input_report = 'irrel';
			active_form_report="#form_irrelevante";
			$("#report_messages").html("");
			break;
		default:
			$("#report_messages").html("<p>Parece que no has escogido ninguna opción</p>");
	}
}
function return_report(){
	$("#denuncia_opciones").css("display","block");
	$("#form_inapropiado").css("display","none");
	$("#form_polemica").css("display","none");
	$("#form_irrelevante").css("display","none");
	
	$("#continuar_report").css("display","inline");
	$("#send_report").css("display","none");
	$("#return_report").css("display","none");
	$("#report_messages").html("");
}
var ajax_report = null;
function send_report(){
	if(ajax_report!=null) return false;
	var post_id = obj_report.data('id');
    var user_id = obj_report.data('user_id');
    var action = 'report';
    console.log(user_id+" "+post_id);
    if(obj_report.hasClass('reported')){
        obj_report.removeClass('reported');
        action = 'unreport';
    }else{
    	obs_report = $('input[name="'+name_input_report+'"]:checked', ''+active_form_report).val();
        console.log("motivo: "+obs_report);
    	if(obs_report==undefined){
        	$("#report_messages").html("<p>Parece que no has escogido ninguna opción</p>");
        	return false;
        }
    	obj_report.addClass('reported');
        action = 'report';
    }
    
    	
	    ajax_report = $.ajax({
	    	url: urlws,
	        dataType: 'text',
	        type: 'post',
	        data: {
	        	action: action,
	            app: 'La voz de Dios',
	            post_id: post_id,
	            user_id: user_id,
	            pais: pais,
	            timeOffset: timeOffset,
	            motivo: obs_report
	        },
	        success: function(a,b,c){
	        	console.log(a);
	        },
	        error: function(a,b,c){
	        	console.log(b+' '+c);
	        },
	        complete: function(a,b,c){
	        	obj_report = null;
	        	ajax_report = null;
	        }
	    });
	    $("#myModal").modal("hide");
	    return_report();
    
}

/*
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
        	action: action,
            app: 'La voz de Dios',
            post_id: post_id,
            user_id: user_id,
            pais: pais,
            timeOffset: timeOffset,
            motivo: obs_report
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
*/
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
                        action: 'remove_post_ws',
                        app: 'La voz de Dios',
                        user_login: user_login,
                        user_pass: user_pass,
                        pais: pais,
                        timeOffset: timeOffset,
                        post_id: victim
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