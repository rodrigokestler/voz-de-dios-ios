var screen_info = $("#screen_info");
screen_info.wrapper = screen_info.find('wrapper');
screen_info.scroller = screen_info.find('scroller');
screen_info.show = function(){screen_info.removeClass('uped');};
screen_info.hide = function(){screen_info.addClass('uped');};
screen_info.promos = {};
screen_info.slider = null;

var screen_promos = $("#screen_promos");
screen_promos.wrapper = screen_promos.find('wrapper');
screen_promos.scroller = screen_promos.find('scroller');
screen_promos.promos = {};
screen_promos.slider = null;


var promo_id_actual = null;
var img_promo_actual = '';
var url_promo_actual = '';

function get_4_info(){
    screen_info.slider = null;
    screen_info.scroller.attr('style','');
    screen_info.scroller.css('width','100%');
    screen_info.scroller.html('<br><br><img width="10%" style="margin: 0 auto; display: block;" src="img/loader.gif"/><br><br>');
    jQuery.ajax({
        url: urlws,
        dataType: 'json',
        type: 'post',
        data: {
            action: 'get_diapos_freemium',
            app: 'La voz de Dios',
            timeOffset: timeOffset
        },
        success: function(a,b,c){
        	console.log(a);
            screen_info.promos = a;
        },
        error: function(a,b,c){
            console.log(b+' '+c);
        },
        complete: function(a,b,c){
        	console.log(a);
            var width = $(window).width()*0.9;
            screen_info.scroller.html('');
            screen_info.scroller.css('width',(width*screen_info.promos.length)+'px');
            $.each(screen_info.promos,function(idx,val){
                screen_info.scroller.append('<div class="slide_" style="width: '+width+'px !important;" data-id="'+val.id+'" data-thumb="'+val.thumb+'"> <div style="width: 100%; height: 100%;"><img style="opacity: 0; display: block;" width="'+(width*0.9)+'px" onload="on_load(this);" src="'+val.image+'"/></div> </div>');
            });
            setTimeout(function(){
                screen_info.slider = new IScroll('#wrapper_info', {
                    scrollX: true,
                    scrollY: false,
                    momentum: false,
                    snap: true,
                    snapSpeed: 400,
                    keyBindings: true
                });
            },500);
        }
    });

}

function get_2_info(){
            
    screen_info.slider = null;
    screen_info.scroller.attr('style','');
    screen_info.scroller.css('width','100%');
    screen_info.scroller.html('<br><br><img width="10%" style="margin: 0 auto; display: block;" src="img/loader.gif"/><br><br>');
    jQuery.ajax({
        url: urlws,
        dataType: 'json',
        type: 'post',
        data: {
            action: 'get_diapos_premium',
            app: 'La voz de Dios',
            timeOffset: timeOffset
        },
        success: function(a,b,c){
        	console.log(a);
            screen_info.promos = a;
        },
        error: function(a,b,c){
            console.log(b+' '+c);
        },
        complete: function(a,b,c){
        	console.log(a);
            var width = $(window).width()*0.9;
            screen_info.scroller.html('');
            screen_info.scroller.css('width',(width*screen_info.promos.length)+'px');
            $.each(screen_info.promos,function(idx,val){
                screen_info.scroller.append('<div class="slide_" style="width: '+width+'px !important;" data-id="'+val.id+'" data-thumb="'+val.thumb+'"> <div style="width: 100%; height: 100%;"><img style="opacity: 0; display: block;" width="'+(width*0.9)+'px" onload="on_load(this);" src="'+val.image+'"/></div> </div>');
            });
            setTimeout(function(){
                screen_info.slider = new IScroll('#wrapper_info', {
                    scrollX: true,
                    scrollY: false,
                    momentum: false,
                    snap: true,
                    snapSpeed: 400,
                    keyBindings: true
                });
            },500);
        }
    });
}

function get_tribus_info(){
            
    screen_info.slider = null;
    screen_info.scroller.attr('style','');
    screen_info.scroller.css('width','100%');
    screen_info.scroller.html('<br><br><img width="10%" style="margin: 0 auto; display: block;" src="img/loader.gif"/><br><br>');
    jQuery.ajax({
        url: urlws,
        dataType: 'json',
        type: 'post',
        data: {
            action: 'get_diapos_tribus',
            app: 'La voz de Dios',
            timeOffset: timeOffset
        },
        success: function(a,b,c){
        	console.log(a);
            screen_info.promos = a;
        },
        error: function(a,b,c){
            console.log(b+' '+c);
        },
        complete: function(a,b,c){
        	console.log(a);
            var width = $(window).width()*0.9;
            screen_info.scroller.html('');
            screen_info.scroller.css('width',(width*screen_info.promos.length)+'px');
            $.each(screen_info.promos,function(idx,val){
                screen_info.scroller.append('<div class="slide_" style="width: '+width+'px !important;" data-id="'+val.id+'" data-thumb="'+val.thumb+'"> <div style="width: 100%; height: 100%;"><img style="opacity: 0; display: block;" width="'+(width*0.9)+'px" onload="on_load(this);" src="'+val.image+'"/></div> </div>');
            });
            setTimeout(function(){
                screen_info.slider = new IScroll('#wrapper_info', {
                    scrollX: true,
                    scrollY: false,
                    momentum: false,
                    snap: true,
                    snapSpeed: 400,
                    keyBindings: true
                });
            },500);
        }
    });
}

function show_info(ac){
	if(ac=="premium"){
    	get_2_info();
    	screen_info.show();
    }else if(ac=="freemium"){
    	get_4_info();
    	screen_info.show();
    }else{
    	get_tribus_info();
    	screen_info.show();
    }
}

function get_promos(){
	if(screen_promos.interval!=null){
        clearInterval(screen_promos.interval);
        screen_promos.interval = null;
    }
    screen_promos.scroller.css('width','100%');
    screen_promos.scroller.attr('style','');
	screen_promos.scroller.html('<br><br><img width="10%" style="margin: 0 auto; display: block;" src="img/loader.gif"/><br><br>');
	$.ajax({
    	url: urlws,
        dataType: 'json',
        type: 'post',
        data: {
        	action: 'get_promos',
            app: 'La voz de Dios',
            timeOffset: timeOffset,
            user_login: user_login,
            user_pass: user_pass
        },
        success: function(a,b,c){
        	console.log("Promos: "+JSON.stringify(a));
        	screen_promos.promos = a;
        },
        error: function(a,b,c){
        	console.log(b+' '+c);
        },
        complete: function(a,b,c){
            var width = $(window).width();
            console.log(width);
            screen_promos.scroller.html('');
            screen_promos.scroller.css('width',(width*screen_promos.promos.length)+'px');            
            screen_promos.wrapper.css('height',(width)+'px');
            $.each(screen_promos.promos,function(idx,val){
            	var button = '<button class="share_promo" onclick="participar('+val.id+',\''+val.url+'\',this,\''+val.image+'\');">Participar</button>';
            	if(val.estoy_participando=="true"){
                	button = '<button style="width: 40%; float: left; margin-left: 5%;" class="share_promo" onclick="no_participar('+val.id+',\''+val.url+'\',this,\''+val.image+'\');">Dejar de participar</button><button style="width: 40%; float: right; margin-right: 5%;" class="share_promo" onclick="share_promo(\''+val.url+'\',\''+val.image+'\');">Compartir</button>';
                }
                
            
            	screen_promos.scroller.append(
                	'<div class="slide" style="width: '+width+'px !important; height: '+width+'px !important; overflow: hidden;" data-id="'+val.id+'" data-thumb="'+val.thumb+'"> '
                		+ '<div style="width: 100%; height: 100%;  pointer-events: none;">'
                        	+ '<div style="width: 100%; height: 100%; overflow: hidden;  pointer-events: none;">'
                			+ '<img style="opacity: 0; display: block; pointer-events: none;" width="100%;" height="100%" onload="on_load(this);" src="'+val.image+'"/>'
                            + '</div>'                            
                        + '</div>'
                    + '</div>'                    
                );
            });     
            
            if($('.nelll').length > 0) $('.nelll').remove();
            
            $('<div class="nelll" style="width: 100%; height: '+width+'px; z-index: 10;"></div><br class="nelll">'
	            +'<button class="share_promo nelll" onclick="show_modal_participar()">Participar</button>'
	            +'<img class="nelll" style="z-index: 100; display: block; pointer-events: none; position: absolute; top: '+(width/2.2)+'px; left:  5px;" width="5%;" src="img/larr.png"/>'
	            +'<img class="nelll" style="z-index: 100; display: block; pointer-events: none; position: absolute; top: '+(width/2.2)+'px; right: 5px;" width="5%;" src="img/rarr.png"/>'
            ).insertAfter(screen_promos.wrapper);    
            
            
            setTimeout(function(){
            	screen_promos.slider = new IScroll('#wrapper_promos', {
                    scrollX: true,
                    scrollY: false,
                    momentum: false,
                    snap: true,
                    eventPassthrough: true,
                    snapSpeed: 400                    
                });
            },1000);
        }
    });
}

function show_modal_participar(){
	console.log(user_data.data.premium+" hola");
    if(user_data.data.premium == undefined){
        navigator.notification.confirm(
            'Para participar de todas las promociones debes convertirte en Miembro Premier, lo que te permitirá además, descargar música cristiana e inspiradoras imágenes a tu celular.',
            function onConfirm(buttonIndex) {
                if(buttonIndex==1){
                    scroll_suscripcion = true;
                    show_perfil(true,user_data.ID);
                }
            },            // callback to invoke with index of button pressed
            'Voz de Dios',           // title
            ['Continuar']     // buttonLabels
        );
    }else{
    	navigator.notification.alert('Ya estas participando en todas nuestras promociones.', null, 'Voz de Dios','ok');
    }
}

function participar(promo_id,img_url,obj,img){
	promo_id_actual = promo_id;
    img_promo_actual = img_url;
    url_promo_actual = img;
	if(user_data.data.premium == undefined){
        navigator.notification.confirm(
            'Para participar de ésta y todas las promociones debes unirte al club móvil Voz de Dios. Este club te permitirá además descargar música cristiana e inspiradoras imágenes de fe.',
            function onConfirm(buttonIndex) {
            	if(buttonIndex==1){
                	scroll_suscripcion = true;
                	show_perfil(true,user_data.ID);
                }
            },            // callback to invoke with index of button pressed
            'Voz de Dios',           // title
            ['Continuar','Ahora no']     // buttonLabels
        );
        return false;
    }
    
    if(jQuery('.share_promo').hasClass('loading')) return false;
    jQuery(obj).addClass('loading');
    
	$.ajax({
    	url: urlws,
        dataType: 'text',
        type: 'post',
        data: {
        	action: 'participar',
            app: 'La voz de Dios',
            user_login: user_login,
            user_pass: user_pass,
            timeOffset: timeOffset,
            id_promo: promo_id_actual
        },
        success: function(a,b,c){
        	if(a=="ok"){
            	jQuery('.share_promo').remove();
                jQuery('<button style="width: 40%; float: left; margin-left: 5%;" class="share_promo" onclick="no_participar('+promo_id_actual+',\''+img_promo_actual+'\',this,\''+url_promo_actual+'\');">Dejar de participar</button><button style="width: 40%; float: right; margin-right: 5%;" class="share_promo" onclick="share_promo(\''+img_promo_actual+'\',\''+url_promo_actual+'\');">Compartir</button>').insertAfter('#br_before');
            }
        },
        error: function(a,b,c){
        	console.log(b+' '+c);
        },
        complete: function(a,b,c){
        	if(jQuery('.share_promo').length > 0 ) jQuery('.share_promo').removeClass('loading');
            promo_id_actual = null;
        }
    });
}

function no_participar(promo_id,img,obj){
	promo_id_actual = promo_id;
    if(jQuery('.share_promo').hasClass('loading')) return false;
    jQuery(obj).addClass('loading');
    
	$.ajax({
    	url: urlws,
        dataType: 'text',
        type: 'post',
        data: {
        	action: 'no_participar',
            app: 'La voz de Dios',
            user_login: user_login,
            user_pass: user_pass,
            timeOffset: timeOffset,
            id_promo: promo_id_actual
        },
        success: function(a,b,c){
        	console.log();
        	if(a=="ok"){
           		jQuery('.share_promo').remove();
                jQuery('<button class="share_promo" onclick="participar('+promo_id_actual+',\''+img_promo_actual+'\',this,\''+url_promo_actual+'\');">Participar</button>').insertAfter('#br_before');
            }
        },
        error: function(a,b,c){
        	console.log(b+' '+c);
        },
        complete: function(a,b,c){
        	if(jQuery('.share_promo').length > 0 ) jQuery('.share_promo').removeClass('loading');
            promo_id_actual = null;
        }
    });
}

var button_share_promo = null;
function share_promo(src,url){
	if(button_share_promo!=null) return false;
    console.log(src);
	button_share_promo = 1;
    var msj = 'Te invito a descargar el APP VOZ DE DIOS para formar parte de la gran comunidad de creyentes';
    window.plugins.socialsharing.share(null,null,url,src,function(){ console.log('bien bajado'); button_share_promo = null;},function(){ console.log('no lo bajo'); button_share_promo = null;});
    return false;
}