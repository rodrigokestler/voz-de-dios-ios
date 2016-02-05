var screen_trivia = $("#screen_trivia");
screen_trivia.wrapper = screen_trivia.find('wrapper');

var screen_consuelo = $("#screen_consuelo");
screen_consuelo.wrapper = screen_consuelo.find('wrapper');
screen_consuelo.show = function(){
	screen_consuelo.removeClass('downed');
	screen_to_hide.push(screen_consuelo);	
};
screen_consuelo.hide = function(){
	screen_consuelo.wrapper.html('');
	screen_consuelo.addClass('downed');
};

var preguntas_pop = 0;

var timer = null;
var count_timer = 10;
var focus_trivia = true;
function get_trivia(){
	screen_trivia.wrapper.html('<br><br><img width="10%" style="margin: 0 auto; display: block;" src="img/loader.gif"/><br><br>');
    clearInterval(timer);
    timer = null;
    count_timer = 10;
    
    if(ajax_trivia!=null){
    	ajax_trivia.abort();
        ajax_trivia = null;
    }
    
	ajax_trivia = $.ajax({
    	url: urlws,
        dataType: 'html',
        type: 'post',
        data: {
        	action: 'get_trivia',
			user_login: user_login,
            user_pass: user_pass,
            pais: pais,
            app: 'La voz de Dios',
            timeOffset: timeOffset
        },
        success: function(a,b,c){
        	screen_trivia.wrapper.html(a);
        	preguntas_pop++;
        },
        error: function(a,b,c){
        	console.log(b+' '+c);
        },
        complete: function(a,b,c){ ajax_trivia = null;
        	
	        if(preguntas_pop==10 && user_data.data.premium == undefined){
	        	preguntas_pop=0;
	        	focus_trivia = false;
	        	navigator.notification.confirm(
	                'Acumula puntos dobles en cada trivia acertada, conviértete en Miembro Premier.',
	                function onConfirm(buttonIndex) {
	                    if(buttonIndex==1){
	                        scroll_suscripcion = true;
	                        show_perfil(true,user_data.ID);
	                    }else{
	                    	focus_trivia = true;
	                    }
	                },            // callback to invoke with index of button pressed
	                'Voz de Dios',           // title
	                ['Sí, vamos','Ahora no']     // buttonLabels
	            );
	        }
        
        
        	if(jQuery('#msj_consuelo').length > 0){
                var html_consuelo = jQuery('#msj_consuelo');
                var width = jQuery(window).width();
                html_consuelo.find("iframe").each(function(){
                    var dis = jQuery(this);                    
                    dis.attr("width","100%");
                    dis.attr("height",parseInt(width*0.8)+"px");
                });
                html_consuelo.find("img").each(function(){
                    var dis = jQuery(this);                    
                    dis.attr("width","100%");
                    dis.attr("height","");
                });
                screen_consuelo.wrapper.html(html_consuelo.html());
           
                count_timer = 20;
                timer = setInterval(function(){
                	if(cur_screen!="#screen_trivia") return false;
                    console.log(focus_trivia);
                    if(!focus_trivia) return false;
                	count_timer--;
                    $(".trivia_timer").html(count_timer);
                    $(".trivia_timer").addClass('breath_1');
                    setTimeout(function(){
                    	$(".trivia_timer").removeClass('breath_1');
                    },300);
                    if(count_timer==0){
                        navigator.vibrate(1000);
                        setTimeout(function(){
                            show_consuelo(true);
                        },1000);
                        clearInterval(timer);
                        timer = null;
                        count_timer = 10;
                    }
                },1000);
            }
        }
    });
}

function show_consuelo(op){
	if(op){
        screen_consuelo.removeClass("downed");
    }else{
    	get_trivia();
    	screen_consuelo.addClass("downed");
    }
}

function verificar(obj){

	if(jQuery(".breath").length > 0 || jQuery(".shake").length > 0) return false;

    var dis = jQuery(obj);
    var resp = dis.data("resp");
    var sel  = dis.data("este");
    dis.attr('onclick','');
    
	clearInterval(timer);
    timer = null;
    count_timer = 10;
    
    if(sel==resp) {
        $.ajax({
            url: urlws,
            dataType: 'html',
            type: 'post',
            data: {
                action: 'add_points',
                user_login: user_login,
                user_pass: user_pass,
                app: 'La voz de Dios',
                pais: pais,
                timeOffset: timeOffset
            },
            success: function(a,b,c){
                console.log(a);
            	$("#punteo").html(a);
            },
            error: function(a,b,c){
                console.log(b+' '+c);
            },
            complete: function(a,b,c){
            }
        });
        dis.addClass("breath");
    	//sonido_correcto.play();        
    	dis.attr("style","background-color: #90EE90");
        setTimeout(function(){
        	get_trivia();
        },1000);
    }else {
    	dis.addClass("shake");
    	dis.attr("style","background-color: #e86a6a");
        navigator.vibrate(1000);
        setTimeout(function(){
        	show_consuelo(true);
        },1000);
    }
}
