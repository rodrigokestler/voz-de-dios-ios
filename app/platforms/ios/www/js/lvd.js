/*
	INDEX
 1. Screen Timeline
 2. Screen Trivia
 3. Screen Promos
 4. Screen Single
 5. Screen Config
 6. Screen Ayuda
 7. Screen Falla
 8. Screen Sugerencia
 9. Screen Acerca de
 10. Screen Perfil
	10.1 Altas Web
 11. Screen Grupos
 12. Screen Single Grupo
 13. Screen Write
 14. Screen Consuelo
 15. Screen Login
	15. Facebook
 16. Screen Registro
 17. Screen Terms
 18. Screen Reglamento
 19. Screen Faqs
 20. Screen Varios
 21. Screen Info
 22. Modal
 23. Controller
 
 */
var $ = jQuery;
//var urlws = 'http://lvd.pizotesoft.com/';
urlws = 'http://vdd.clx.mobi/';
var h2_top = $('#dejar_premier_h2').position().top;
//1. Screen Timeline
//Variables
var screen_timeline = $("#screen_timeline");
screen_timeline.nfeed = screen_timeline.find('nfeed');
//var refresh_interval = 3000;
var refresh_interval = 120000;
var ajax_feed = null;
var hago_scroll = false;
var obj_report = null;
var obs_report = "";
var active_form_report = '';
var name_input_report = '';
var ajax_report = null;
var victim = null;
var offset = 0;
screen_timeline.wrapper = screen_timeline.find('wrapper');


//Funciones
screen_timeline.wrapper.on('scroll', function(event) {
                           if(ajax_feed != null) return false;
                           var st = $(this).scrollTop();
                           var ih = $(this).innerHeight();
                           if(st + ih >= this.scrollHeight) {
                           
                           if($('.loadmore').length==0){
                           screen_timeline.wrapper.append('<div class="loadmore"><br><br><img width="10%" style="margin: 0 auto; display: block;" src="img/loader.gif"/><br><br></div>');
                           offset = $("post").length;
                           console.log(offset);
                           get_feeds();
                           }
                           }else if(st < -80){
                           offset = -1;
                           screen_timeline.wrapper.scrollTop -= 40;
                           screen_timeline.wrapper.prepend('<div class="loadmore"><br><br><img width="10%" style="margin: 0 auto; display: block;" src="img/loader.gif"/><br><br></div>');
                           get_feeds();
                           return false;
                           }
                           });

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

function update_select_dropdown(){
    
    screen_timeline.wrapper = screen_timeline.find('wrapper');
    var filtro = "todos"; //"todos"
    if(jQuery("#filtro_feeds_select").length > 0) filtro = jQuery("#filtro_feeds_select").val();
    console.log(jQuery("#filtro_feeds_select").length);
    console.log(filtro);
    $("#filtro_feeds_select").addClass('loading');
    if(filtro==''){
        filtro='todos';
    }
    if(ajax_feed_dropdown==null){
        ajax_feed_dropdown = $.ajax({
                                    url: urlws,
                                    dataType: 'html',
                                    type: 'post',
                                    data: {
                                    action: 'ilc_update_select',
                                    app: 'I love concerts',
                                    user_login: user_login,
                                    user_pass: user_pass,
                                    pais: pais,
                                    offset: offset,
                                    filtro: filtro,
                                    width: $(window).width(),
                                    timeOffset: timeOffset
                                    },
                                    success: function(a,b,c){
                                    
                                    $("#que_quieres_ver").detach();
                                    $("#filtro_feeds_select").detach();
                                    screen_timeline.wrapper.prepend(a);
                                    
                                    },
                                    error: function(a,b,c){
                                    console.log(b+' '+c);
                                    },
                                    complete: function(a,b,c){
                                    $("#filtro_feeds_select").removeClass('loading');
                                    ajax_feed_dropdown = null;
                                    
                                    }
                                    });
    }
}

var ajax_get_feeds = null;

function get_feeds(){
    
    var filtro = "todos";
    if(jQuery("#filtro_feeds_select").length > 0){
        filtro = jQuery("#filtro_feeds_select").val();
    }
    var filtro_text = jQuery("#filtro_feeds_select option:selected").text();
    console.log(filtro);
    console.log(filtro_text);
    console.log(offset);
    if(filtro==''){
        filtro='todos';
    }
    if(offset == -1) {
        offset = 0;
    }else if(offset==0){
        screen_timeline.wrapper.html('<br><br><img width="10%" style="margin: 0 auto; display: block;" src="img/loader.gif"/><br><br>');
    }
    var no_update=0;
    if(arguments.length==1){
        no_update =1;
    }else{
        no_update = 0
    }
    
    if(ajax_get_feeds==null){
        
        ajax_get_feeds = $.ajax({
                                url: urlws,
                                dataType: 'html',
                                type: 'post',
                                data: {
                                
                                action: 'get_feeds2', //antes get_feeds
                                app: 'La voz de Dios',
                                user_login: user_login,
                                user_pass: user_pass,
                                pais: pais,
                                offset: offset,
                                filtro: filtro,
                                width: $(window).width(),
                                timeOffset: timeOffset,
                                update:no_update,
                                filtro_text:filtro_text
                                },
                                success: function(a,b,c){
                                $(".loadmore").remove();
                                if(offset==0) {
                                screen_timeline.wrapper.html(a);
                                }else {
                                
                                screen_timeline.wrapper.append(a);
                                }
                                },
                                error: function(a,b,c){
                                console.log(b+' '+c);
                                },
                                complete: function(a,b,c){ ajax_feed = null;
                                /*
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
                                 });*/
                                $(".button_share").click(function(){
                                                         var data_share = $(this).data('share');
                                                         var type = $(this).data('type');
                                                         console.log(data_share);
                                                         console.log(type);
                                                         if(type=='imagen'){
                                                         window.plugins.socialsharing.share(null,null,data_share,add_points('share'),function(){ console.log('no lo bajo');});
                                                         
                                                         }else{
                                                         window.plugins.socialsharing.share(data_share,null,null,add_points('share'),function(){ console.log('no lo bajo');});
                                                         
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
                                ajax_get_feeds=null;
                                //return true;
                                
                                }
                                });
    }
}
/*
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
 */

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

function cancel_report(){
    $('input[name="denun"]:checked', '#denuncia_opciones').prop('checked', false);
    return_report();
    return true;
}

function report(obj){
    obj_report = $(obj);
    
    if(obj_report.hasClass('reported')){
        send_report();
        return false;
    }
    $("#myModal").modal();
    
}


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
    //console.log("ENTRA RETURN REPORT");
    
    $("#denuncia_opciones").css("display","block");
    $("#form_inapropiado").css("display","none");
    $("#form_polemica").css("display","none");
    $("#form_irrelevante").css("display","none");
    
    $("#continuar_report").css("display","inline");
    $("#send_report").css("display","none");
    $("#return_report").css("display","none");
    $("#report_messages").html("");
    
    
    
}

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
    
    //return_report();
    clean_report();
    
}

function clean_report(){
    //limpia formularios de denuncia
    $('#denuncia_opciones').trigger("reset");
    $('#form_irrelevante').trigger("reset");
    $('#form_polemica').trigger("reset");
    $('#form_inapropiado').trigger("reset");
    return_report();
}

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
//END Screen Timeline
//-----------------------------------------------------------------------
//2. Screen Trivia
//Variables
var sonido_correcto = null;
var ajax_trivia = null;
var screen_trivia = $("#screen_trivia");
screen_trivia.wrapper = screen_trivia.find('wrapper');

var preguntas_pop = 0;
var timer = null;
var count_timer = 10;
var focus_trivia = true;
var puntos_sesion = 0;
var show_points = true;


//Funciones


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
                         
                         if(preguntas_pop==10 && user_estado=='freemium'){
                         preguntas_pop=0;
                         focus_trivia = false;
                         navigator.notification.confirm(
                                                        'Acumula puntos dobles en cada trivia acertada, conviértete en Miembro Premier.',
                                                        function onConfirm(buttonIndex) {
                                                        if(buttonIndex==1){
                                                        window.plugins.flurry.logEventWithParameters('Si, vamos',{desde:'trivias'},function(){},function(){});
                                                        scroll_suscripcion = true;
                                                        //show_perfil(true,user_data.ID);
                                                        show_screen('#screen_perfil');
                                                        show_points = false;
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
        if(user_estado=='freemium'){
            puntos_sesion +=2;
        }else{
            puntos_sesion +=4;
        }
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
//END Screen Trivia
//-----------------------------------------------------------------------
// 3. Screen Promos
//Variables
var screen_promos = $("#screen_promos");
screen_promos.wrapper = screen_promos.find('wrapper');
screen_promos.scroller = screen_promos.find('scroller');
screen_promos.promos = {};
screen_promos.slider = null;
var button_share_promo = null;
var promo_id_actual = null;
var img_promo_actual = '';
var url_promo_actual = '';
var share_text_promo = '';
//Funciones

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
           pais: pais,
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
           var height = $(window).height();
           
           screen_promos.scroller.html('');
           screen_promos.find('info').html('');
           screen_promos.scroller.css('width',(width)+'px');//*screen_promos.promos.length)+'px');
           //screen_promos.scroller.css('overflow-x','scroll');
           screen_promos.wrapper.css('height',"92%");//(width)+'px');
           if(screen_promos.promos[0]!="sin_pais" && screen_promos.promos[0]!='sin_promo'){
           
           
           $.each(screen_promos.promos,function(idx,val){
                  
                  var button = '<button id="boton'+val.id+'" class="share_promo" onclick="window.plugins.flurry.logEvent(\'Participar Promo\',function(){},function(){});participar('+val.id+',\''+val.content+'\');">Participar</button>';
                  if(val.estoy_participando=="true"){
	                	button = '<button id="boton'+val.id+'" style="width: 43%; float: left; margin-left: 5%;" class="share_promo" onclick="window.plugins.flurry.logEvent(\'Compartir Promo\',function(){},function(){});no_participar('+val.id+',\''+val.content+'\');">Dejar de participar</button><button id="boton_share'+val.id+'"style="width: 40%; float: right; margin-right: 5%;" class="share_promo" onclick="share_promo(\''+val.content+'\');">Compartir</button>';
                  }
                  
                  
                  screen_promos.scroller.append('<div class="slide_" style="float:left; width: '+(width)+'px !important;" id="'+val.id+'" data-id="'+val.id+'" data-thumb="'+val.thumb+'"> '+
                                                '<div style="width: '+(width-10)+'px; height: '+(width+60)+'px;margin:0 5px;">'+
                                                '<img style="opacity: 0; display: block; margin: 0 5px; width=100%!important; height:100%;" onload="on_load(this);" src="'+val.image+'"/>' +
                                                '<br id="br'+val.id+'">'+button+
                                                '</div> </div>');
                  
                  
                  });
           //if($('.nelll').length > 0) $('.nelll').remove();
           /*
            $('<img class="nelll" style="z-index: 100; display: block; pointer-events: none; position: absolute; top: '+(width/2)+'px; left:  5px;" width="5%;" src="img/larr.png"/>'
            +'<img class="nelll" style="z-index: 100; display: block; pointer-events: none; position: absolute; top: '+(width/2)+'px; right: 5px;" width="5%;" src="img/rarr.png"/>'
            ).insertAfter(screen_promos.wrapper);*/
           /* if(promo!=undefined){
            console.log($("#"+promo).offset().left)
            screen_promos.wrapper.animate({scrollLeft:""+$("#"+promo).offset().left},300);
            }*/
           
           
           }else if(screen_promos.promos[0]=="sin_pais"){
           //if($('.nelll').length > 0) $('.nelll').remove();
           screen_promos.scroller.html('<p style="text-align:center;margin-top:20%;">Debes seleccionar un operador en tu perfil para ver promociones de tu país.</p>');
           }else if(screen_promos.promos[0]=="sin_promo"){
           console.log("entro sin promo");
           screen_promos.scroller.append('<div class="slide_" style="float:left; width: '+(width)+'px !important;" > '+
                                         '<div style="width: '+(width-10)+'px; height: '+(width+60)+'px;margin:0 5px;">'+
                                         '<img style="opacity: 0; display: block; margin: 0 5px; width=100%!important; height:100%;" onload="on_load(this);" src="img/sin-promocion.jpg"/>' +
                                         '<br>'+
                                         '</div> </div>');
           }
           promos_ajax = null;
           }
           });
}

function show_modal_participar(){
    if(typeof user_data.data.premium == 'undefined'){
        navigator.notification.confirm(
                                       'Para participar de todas las promociones debes convertirte en Miembro Premier, lo que te permitirá además, descargar música cristiana e inspiradoras imágenes a tu celular.',
                                       function onConfirm(buttonIndex) {
                                       if(buttonIndex==1){
                                       window.plugins.flurry.logEventWithParameters('Si, vamos',{desde:'Participar Promos'},function(){},function(){});
                                       
                                       scroll_suscripcion = true;
                                       show_screen('#screen_perfil');
                                       }
                                       },            // callback to invoke with index of button pressed
                                       'Voz de Dios',           // title
                                       ['Continuar','Cancelar']     // buttonLabels
                                       );
    }else{
        navigator.notification.alert('Ya estas participando en todas nuestras promociones.', null, 'Voz de Dios','ok');
    }
}

//function participar(promo_id,img_url,obj,img){
function participar(promo_id,text){
    promo_id_actual = promo_id;
    //img_promo_actual = img_url;
    //url_promo_actual = img;
    share_text_promo = text;
    if(user_estado == 'freemium'){
        navigator.notification.confirm(
                                       'Para participar de ésta y todas las promociones debes unirte al club móvil Voz de Dios. Este club te permitirá además descargar música cristiana e inspiradoras imágenes de fe.',
                                       function onConfirm(buttonIndex) {
                                       if(buttonIndex==1){
                                       scroll_suscripcion = true;
                                       show_screen('#screen_perfil');
                                       }
                                       },            // callback to invoke with index of button pressed
                                       'Voz de Dios',           // title
                                       ['Continuar','Cancelar']     // buttonLabels
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
           pais: pais,
           timeOffset: timeOffset,
           id_promo: promo_id_actual
           },
           success: function(a,b,c){
           if(a=="ok"){
           jQuery('.share_promo').remove();
           //jQuery('<button style="width: 40%; float: left; margin-left: 5%;" class="share_promo" onclick="no_participar('+promo_id_actual+',\''+share_text_promo+'\',this,\''+url_promo_actual+'\');">Dejar de participar</button><button style="width: 40%; float: right; margin-right: 5%;" class="share_promo" onclick="share_promo(\''+img_promo_actual+'\',\''+url_promo_actual+'\');">Compartir</button>').insertAfter('#br'+promo_id_actual);
           jQuery('<button style="width: 40%; float: left; margin-left: 5%;" class="share_promo" onclick="no_participar('+promo_id_actual+',\''+share_text_promo+'\');">Dejar de participar</button><button style="width: 40%; float: right; margin-right: 5%;" class="share_promo" onclick="share_promo(\''+share_text_promo+'\');">Compartir</button>').insertAfter('#br'+promo_id_actual);
           
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

//function no_participar(promo_id,img,obj){
function no_participar(promo_id,text){
    promo_id_actual = promo_id;
    share_text_promo = text;
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
           pais: pais,
           timeOffset: timeOffset,
           id_promo: promo_id_actual
           },
           success: function(a,b,c){
           console.log();
           if(a=="ok"){
           jQuery('.share_promo').remove();
           //jQuery('<button class="share_promo" onclick="participar('+promo_id_actual+',\''+img_promo_actual+'\',this,\''+url_promo_actual+'\');">Participar</button>').insertAfter('#br'+promo_id_actual);
           jQuery('<button class="share_promo" onclick="participar('+promo_id_actual+',\''+share_text_promo+'\');">Participar</button>').insertAfter('#br'+promo_id_actual);
           
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
function share_promo(src){
    if(button_share_promo!=null) return false;
    button_share_promo = 1;
    //window.plugins.socialsharing.share(null,null,src,function(){ console.log('bien bajado'); button_share_promo = null;},function(){ console.log('no lo bajo'); button_share_promo = null;});
    window.plugins.socialsharing.share(src,null,null,function(){ console.log('bien bajado'); button_share_promo = null;},function(){ console.log('no lo bajo'); button_share_promo = null;});
    
    return false;
}
// END Screen Promos
//-----------------------------------------------------------------------
//4. Screen Single
//Variables
var screen_single = $("#screen_single");
screen_single.wrapper = screen_single.find('wrapper');
var textInput = document.getElementById('#commenttxt');
var new_comment = null;
//Funciones
screen_single.show = function(){
    screen_single.removeClass('righted');
    screen_to_hide.push(screen_single);
};
screen_single.hide = function(){
    screen_single.wrapper.html("");
    screen_single.addClass('righted');
};

function show_single(op,id){
    console.log(op+" "+id);
    if(op) {
        screen_single.show();
        screen_single.wrapper.html('<br><br><img width="10%" style="margin: 0 auto; display: block;" src="img/loader.gif"/><br><br>');
        $.ajax({
               url: urlws,
               dataType: 'text',
               type: 'post',
               data: {
               action: 'get_single_flurry', //antes get_single
               app: 'La voz de Dios',
               user_login: user_login,
               user_pass: user_pass,
               post_id: id,
               pais: pais,
               timeOffset: timeOffset
               
               },
               success: function(a,b,c){
               screen_single.wrapper.html(a);
               },
               error: function(a,b,c){
               console(b+' '+c);
               },
               complete: function(a,b,c){
               
               screen_single.comments = screen_single.find('comments');
               
               screen_single.wrapper.find(".button_share").click(function(){
                                                                 var img_url = $(this).data('share');
                                                                 if(img_url==""){
                                                                 var id = $(this).data('id');
                                                                 img_url = $("#content"+id).text();
                                                                 window.plugins.socialsharing.share(img_url);
                                                                 }else{
                                                                 window.plugins.socialsharing.share(null,null,img_url,add_points('share'),function(){ console.log('no lo bajo');});
                                                                 }
                                                                 return false;
                                                                 });
               screen_single.wrapper.find(".button_like").click(function(){
                                                                return false;
                                                                });
               screen_single.wrapper.find("iframe").each(function(){
                                                         var dis = $(this);
                                                         dis.attr('width',"100%");
                                                         dis.attr('height',jQuery(window).width()*0.8);
                                                         });
               if(hago_scroll){
               screen_single.wrapper.animate(
                                             {
                                             scrollTop: jQuery(screen_single.wrapper).height()
                                             },
                                             1000,
                                             null
                                             );
               jQuery(".input_comment").focus();
               SoftKeyboard.show();
               hago_scroll = false;
               }
               }
               });
    }else {
        screen_single.hide();
    }
}
function send_comment(){
    if($("#loading_comment").length > 0) return false;
    var comment = jQuery(".input_comment").val();
    var post_id = jQuery(".input_comment").data('post_id');
    var desde_f = jQuery('.input_comment').data('desde');
    if(comment=="")return false;
    new_comment = jQuery('<comment id="loading_comment" data-id=""><br><br><img width="10%" style="margin: 0 auto; display: block;" src="img/loader.gif"/><br><br></comment>');
    screen_single.comments.prepend(new_comment);
    $.ajax({
           url: urlws,
           dataType: 'text',
           type: 'post',
           data: {
           action: 'comment_post',
           app: 'La voz de Dios',
           user_login: user_login,
           user_pass: user_pass,
           comment: comment+"||||||||||||||",
           post_id: post_id,
           pais: pais,
           timeOffset: timeOffset
           },
           success: function(a,b,c){
           window.plugins.flurry.logEventWithParameters('Comentario',{estado:user_estado,desde:desde_f},function(){console.log('comentario flurry');},function(){console.log('comentario flurry error');});
           console.log(JSON.stringify(a));
           new_comment.remove();
           new_comment = null;
           if(jQuery(".no-comments").length > 0){
           jQuery(".no-comments").remove();
           }
           screen_single.comments.prepend(a);
           var button = jQuery('post[data-id="'+post_id+'"]').find('.button_comment');
           var val = parseInt(button.html());
           val++;
           button.html(val);
           screen_single.wrapper.animate(
                                         {
                                         scrollTop: jQuery("comments").scrollTop()
                                         },
                                         1000,
                                         function(){
                                         screen_single.find('textarea').focus();
                                         SoftKeyboard.show();
                                         }
                                         );
           },
           error: function(a,b,c){
           console.log(b+' '+c);
           },
           complete: function(a,b,c){
           jQuery(".input_comment").val('');
           }
           });
    
}
function remove_comment(id_post){
    victim = id_post;
    navigator.notification.confirm(
                                   '¿Deseas borrar este comentario?',
                                   function(btn){
                                   if(btn==1){
                                   jQuery("#comment-"+victim).fadeOut();
                                   jQuery.ajax({
                                               url: urlws,
                                               dataType: 'text',
                                               type: 'post',
                                               data: {
                                               action: 'remove_comment_ws',
                                               app: 'La voz de Dios',
                                               user_login: user_login,
                                               user_pass: user_pass,
                                               pais: pais,
                                               timeOffset: timeOffset,
                                               comment_id: victim
                                               },
                                               success: function(a,b,c){
                                               if(a=="ok") {
                                               var pid = jQuery("#comment-"+victim).data('post_id');
                                               console.log(pid);
                                               jQuery("#comment-"+victim).remove();
                                               var button_comment = jQuery(pid).find(".button_comment");
                                               var val = parseInt(button_comment.html());
                                               val--;
                                               button_comment.html(val);
                                               }else jQuery("#comment-"+victim).fadeIn();
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
var screen_zoom = null;
function show_zoom(img){
    window.plugins.flurry.logEventWithParameters('Zoom Single Foto',{estado:user_estado},function(){},function(){});
    
    var html = '<screen id="screen_zoom" class="no_normal">'+
    '<wrapper id="img_zoom_wrapper"><div id="img_zoom_scroller"><img width="100%" src="'+img+'"/></div><button style="z-index:10;" class="close_window" onclick="hide_zoom()">x</button></wrapper>'
    +'</screen>';
    screen_zoom = jQuery(html);
    
    jQuery('body').append(screen_zoom);
    
    screen_zoom.hide = function(){
        hide_zoom();
    };
    
    screen_zoom.zoom = new IScroll('#img_zoom_wrapper', {
                                   zoom: true,
                                   scrollX: true,
                                   scrollY: true,
                                   mouseWheel: true,
                                   wheelAction: 'zoom'
                                   });
    
    screen_to_hide.push(screen_zoom);
    
}

function hide_zoom(){
    screen_zoom.zoom.destroy();
    screen_zoom.remove();
    screen_zoom = null;
}
//END Screen Single
//-----------------------------------------------------------------------
//5. Screen Config
//Variables
var screen_config = $("#screen_config");
//Funciones
screen_config.show = function(){
    focus_trivia = false;
    screen_config.removeClass('lefted');
    screen_to_hide.push(screen_config);
};
screen_config.hide = function(){
    focus_trivia = true; screen_config.addClass('lefted');
};
// END screen Config
//-----------------------------------------------------------------------
//6. Screen Ayuda
//Variables
var screen_ayuda = $("#screen_ayuda");
//Funciones
screen_ayuda.show = function(){
    console.log("Entro show ayuda");
    focus_trivia = false;
    screen_ayuda.removeClass('downed');
    screen_to_hide.push(screen_ayuda);
    window.plugins.flurry.logEvent('Ver Ayuda',function(){},function(){});
}
screen_ayuda.hide = function(){
    console.log("entro salir ayuda");
    focus_trivia = true;
    screen_ayuda.addClass('downed');
}
// END Screen Ayuda
//-----------------------------------------------------------------------
//7. Screen Falla
//Variables
var screen_fallas = $("#screen_falla");

//Funciones
screen_fallas.show = function(){
    focus_trivia = false;
    screen_fallas.removeClass('righted');
    screen_to_hide.push(screen_fallas);
}
screen_fallas.hide = function(){
    focus_trivia = true;
    screen_fallas.addClass('righted');
}
var ajax_falla = false;
var callback = function(){};
$("#enviar_falla").click(function(){
                         var n = $('input[name="falla"]:checked', '#form_falla').length;
                         var comentario =$('#textarea_form_falla').val();
                         if(n==0){
                         navigator.notification.alert("Parece que se te ha olvidado seleccionar un tipo de falla",callback,'Voz de Dios','Aceptar');
                         return false;
                         }
                         if(comentario.length<1){
                         navigator.notification.alert("Por favor cuéntanos un poco más acerca de tu falla",callback,'Voz de Dios','Aceptar');
                         return false;
                         }
                         if(!ajax_falla){
                         ajax_falla = true;
                         var tipo_falla = $('input[name="falla"]:checked', '#form_falla').val();
                         var comentario =$('#textarea_form_falla').val();
                         jQuery(".publish").addClass('loading');
                         $.ajax({
                                url: urlws,
                                dataType: 'html',
                                type: 'post',
                                data: {
                                action: 'post_falla',
                                app: 'La voz de Dios',
                                user_login: user_login,
                                user_pass: user_pass,
                                tipo_falla:tipo_falla,
                                comentario:comentario
                                },
                                success: function(a,b,c){
                                navigator.notification.alert("Gracias! Tu mensaje ha sido enviado.",callback,'Voz de Dios','Aceptar');
                                $('#textarea_form_falla').val('');
                                $('input[name="falla"]:checked', '#form_falla').prop('checked', false);
                                window.plugins.flurry.logEvent('Enviar Falla',function(){},function(){});
                                },
                                error: function(a,b,c){
                                console.log(b+' '+c);
                                navigator.notification.alert("Ha ocurrido un error. Por favor intenta de nuevo, es importante para nosotros.",callback,'Voz de Dios','Aceptar');
                                },
                                complete: function(a,b,c){
                                ajax_falla = false;
                                jQuery(".publish").removeClass('loading');
                                $('#textarea_form_falla').val('');
                                }
                                });
                         }
                         
                         });
// END Screen Falla
//-----------------------------------------------------------------------
//8. Screen Sugerencia
//Variables
var screen_sugerencias = $("#screen_sugerencia");
//Funciones
screen_sugerencias.show = function(){
    focus_trivia = false;
    screen_sugerencias.removeClass('righted');
    screen_to_hide.push(screen_sugerencias);
}
screen_sugerencias.hide = function(){
    focus_trivia = true;
    screen_sugerencias.addClass('righted');
}

var ajax_sugerencia = false;
$("#enviar_sugerencia").click(function(){
                              console.log("entro sugerencia");
                              
                              var sugerencia =$('#textarea_form_sugerencia').val();
                              if(sugerencia.length<1){
                              navigator.notification.alert("Parece que se te ha olvidado escribir una sugerencia",callback,'Voz de Dios','Aceptar');
                              return false;
                              }
                              
                              if(!ajax_sugerencia){
                              ajax_sugerencia = true;
                              var sugerencia =$('#textarea_form_sugerencia').val();
                              jQuery(".publish").addClass('loading');
                              console.log('antes ajax');
                              
                              
                              $.ajax({
                                     url: urlws,
                                     dataType: 'html',
                                     type: 'post',
                                     data: {
                                     action: 'post_sugerencia',
                                     app: 'La voz de Dios',
                                     user_login: user_login,
                                     user_pass: user_pass,
                                     sugerencia:sugerencia
                                     },
                                     success: function(a,b,c){
                                     navigator.notification.alert("Gracias! Tu mensaje ha sido enviado.",callback,'Voz de Dios','Aceptar');
                                     $('#textarea_form_sugerencia').val('');
                                     window.plugins.flurry.logEvent('Enviar Sugerencia',function(){},function(){});
                                     },
                                     error: function(a,b,c){
                                     console.log(b+' '+c);
                                     navigator.notification.alert("Ha ocurrido un error. Por favor intenta de nuevo, es importante para nosotros.",callback,'Voz de Dios','Aceptar');
                                     },
                                     complete: function(a,b,c){
                                     ajax_sugerencia = false;
                                     jQuery(".publish").removeClass('loading');
                                     
                                     }
                                     });
                              }
                              
                              });
// END Screen Sugerencia
//-----------------------------------------------------------------------
//9. Screen Acerca de
//Variables
var screen_acercade = $("#screen_acercade");
//Funciones
screen_acercade.show = function(){
    focus_trivia = false;
    screen_acercade.removeClass('righted');
    screen_to_hide.push(screen_acercade);
    window.plugins.flurry.logEvent('Ver Acerca De',function(){},function(){});
}
screen_acercade.hide = function(){
    focus_trivia = true;
    screen_acercade.addClass('righted');
}

// END Screen Acerca de
//-----------------------------------------------------------------------
//10. Screen Perfil
//Variables
var terms_conds = [
                   '<p>Servicio de suscripción para usuarios CLARO COSTA RICA y con renovación automática semanal de C.1,900 IVA Incluido. Para cancelar suscripción envía mensaje de texto con las palabras SALIR DIOS al 7050.</p>',
                   '<p>Servicio de suscripción para usuarios CLARO EL SALVADOR y con renovación automática semanal de $3 ISV Incluido. Para cancelar suscripción envía mensaje de texto con las palabras SALIR CIELO al 7050.</p>',
                   '<p>Servicio de suscripción para usuarios CLARO GUATEMALA y con renovación automática semanal de Q28. Para cancelar suscripción envía mensaje de texto con las palabras SALIR DIOS al 7050.</p>',
                   '<p>Servicio de suscripción para usuarios CLARO HONDURAS y con renovación automática semanal de L.70 ISV Incluido. Para cancelar suscripción envía un mensaje de texto con las palabras SALIR BIBLIA al 7050.</p>',
                   '<p>Servicio de suscripción para usuarios CLARO NICARAGUA y con renovación automática semanal de $3 Imp. Incluido. Para cancelar suscripción envía mensaje de texto con las palabras SALIR DIOS al 7050.</p>',
                   '<p>Servicio de suscripción para usuarios CLARO REPÚBLICA DOMINICANA y con renovación automática diaria de RD$10+Impuestos. Para cancelar tu suscripción envía mensaje de texto con las palabras SALIR al 2335.</p>'
                   
                   ];

var number_text = [
                   'AMEN-7050',
                   'CIELO-7050',
                   'AMEN-7050',
                   'AMEN-7050',
                   'AMEN-7050',
                   'AMEN-7050'
                   ];

var number_salir = [
                    'SALIR DIOS-7050',
                    'SALIR CIELO-7050',
                    'SALIR DIOS-7050',
                    'SALIR BIBLIA-7050',
                    'SALIR DIOS-7050',
                    'SALIR DIOS-7050'
                    ];

var screen_perfil = $("#screen_perfil");
screen_perfil.wrapper = screen_perfil.find('wrapper');

var ajax_perfil = null;
var ajax_meta = null;
var no_telefono = '';
var operador_iframe ='';
var pre_fijo = '';
var sms_ = null;
//Funciones

screen_perfil.show = function(){
    /*
    	screen_perfil.removeClass('downed');
    	screen_to_hide.push(screen_perfil);
    	*/
};
screen_perfil.hide = function(){
    /*
    	screen_perfil.wrapper.html('');
    	screen_perfil.addClass('downed');
    	*/
};

var screen_perfil_ext = $("#screen_perfil_ext");
screen_perfil_ext.wrapper = screen_perfil_ext.find('wrapper');
screen_perfil_ext.show = function(){
    screen_perfil_ext.removeClass('righted');
    screen_to_hide.push(screen_perfil_ext);
};
screen_perfil_ext.hide = function(){
    screen_perfil_ext.wrapper.html('');
    screen_perfil_ext.addClass('righted');
};
/*
 function show_perfil(op,user_id,event){
 if(user_id==1||user_id==20||user_id==19) return false;
 console.log(user_id+" ID profile");
 if(op){
 screen_config.addClass("left");
 screen_perfil.removeClass("downed");
 get_perfil(user_id);
 }else{
 if(ajax_perfil!=null){
 ajax_perfil.abort();
 ajax_perfil = null;
 }
 screen_perfil.addClass("downed");
 }
 return false;
 }*/


function get_perfil_anterior(user_id){
    if(user_id==1||user_id==20||user_id==19) return false;
    //screen_to_hide.push(screen_perfil);
    screen_perfil.wrapper.html('<br><br><img width="10%" style="margin: 0 auto; display: block;" src="img/loader.gif"/><br><br>');
    //screen_perfil.find('screen_title').html('<button class="close_window" onclick="screen_perfil.hide()">x</button>');
    ajax_perfil = $.ajax({
                         url: urlws,
                         dataType: 'html',
                         type: 'post',
                         data: {
                         action: 'get_perfil2', //antes get_perfil
                         app: 'La voz de Dios',
                         user_login: user_login,
                         user_pass: user_pass,
                         pais: pais,
                         user_id: user_id,
                         timeOffset: timeOffset
                         },
                         success: function(a,b,c){
                         //alert(a);
                         screen_perfil.wrapper.html(a);
                         },
                         error: function(a,b,c){
                         console.log(b+' '+c);
                         },
                         complete: function(a,b,c){
                         ajax_perfil = null;
                         
                         if(scroll_suscripcion == true){
                         scroll_suscripcion = false;
                         screen_perfil.wrapper.animate(
                                                       {
                                                       scrollTop: jQuery(screen_perfil.wrapper).height()
                                                       },
                                                       1000,
                                                       null
                                                       );
                         }
                         
                         $("#tel").on('keyup',function (e) {
                                      var tel = $('#tel').val();
                                      if (!(/^\d+$/.test(tel))) {
                                      $('#tel').val(tel.substring(0,tel.length-1));
                                      navigator.notification.alert('Por favor ingresa solamente números',null,'Voz de Dios','Ok');
                                      return false;
                                      }
                                      });
                         
                         $('.user_meta').change(function(){
                                                
                                                var tel = $('#tel').val();
                                                if(tel.length<8){
                                                navigator.notification.alert('Tu no. de teléfono no está completo',null,'Voz de Dios','Ok');
                                                return false;
                                                }else if(tel.length>8){
                                                navigator.notification.alert('Has ingresado un número de teléfono muy largo',null,'Voz de Dios','Ok');
                                                return false;
                                                }else if(tel=='00000000'){
                                                navigator.notification.alert('Parece que tu número de teléfono no es correcto',null,'Voz de Dios','Ok');
                                                return false;
                                                }
                                                
                                                console.log("entro");
                                                $("#perfil_loader").addClass('loading');
                                                $("#perfil_loader").css("display","block");
                                                $('#operador').next().html('');
                                                
                                                var operador = $("#operador").val();//[0].selectedIndex;
                                                if(operador=='Claro-Guatemala'){
                                                operador_iframe = '1882';
                                                pre_fijo = '502 -';
                                                }else if(operador=='Claro-El Salvador'){
                                                operador_iframe = '2107';
                                                pre_fijo = '503 -';
                                                }else if(operador=='Claro-Honduras'){
                                                operador_iframe = '2168';
                                                pre_fijo = '504 -';
                                                }else if(operador=='Claro-Nicaragua'){
                                                operador_iframe = '2785';
                                                pre_fijo = '505 -';
                                                }else if(operador=='Claro-Costa Rica'){
                                                operador_iframe = '4231';
                                                pre_fijo = '506 -';
                                                }
                                                no_telefono = $('#tel').val();
                                                var tel = $('#tel').val();
                                                var pais = $('#operador')[0].selectedIndex;
                                                console.log(operador+"-"+tel);
                                                if(operador!='' && tel!=''){
                                                if(ajax_meta==null){
                                                ajax_meta = $.ajax({
                                                                   url: urlws,
                                                                   dataType: 'html',
                                                                   type: 'post',
                                                                   data: {
                                                                   action: 'update_meta_app',
                                                                   user_login: user_login,
                                                                   user_pass: user_pass,
                                                                   operador:operador,
                                                                   tel:tel,
                                                                   app: 'La voz de Dios',
                                                                   pais: pais,
                                                                   timeOffset: timeOffset
                                                                   },
                                                                   success: function(a,b,c){
                                                                   console.log("update_meta: "+a);
                                                                   if(a=='1'){
                                                                   window.localStorage.setItem('estado','premium');
                                                                   user_estado = 'premium';
                                                                   //$('#impresion').html("<p style='font-weight:bold;'>Ya eres miembro PREMIER y puedes disfrutar de todos sus beneficios.</p>");
                                                                   $('#impresion').html('<span id="impresion"><p style="font-weight:bold;">Ya eres miembro PREMIER y puedes disfrutar de todos sus beneficios.</p><button id="send_suscription" onclick="screen_faqs.show();screen_faqs.wrapper.scrollTop(h2_top);">Dejar de ser miembro premier</button></span>');
                                                                   $("#operador").next().html("");
                                                                   $('#datos-para-freemium').hide();
                                                                   }else{
                                                                   window.localStorage.setItem('estado','freemium');
                                                                   user_estado = 'freemium';
                                                                   //$('#impresion').html('<button id="send_suscription" onclick="altaweb.register();">Subscribir</button>');
                                                                   focus_trivia = false;
                                                                   $('#datos-para-freemium').show();
                                                                   $('#impresion').html('<span id="impresion"><button id="send_suscription" onclick="altaweb.register();">Continuar</button></span>');
                                                                   $("#operador").next().html("");
                                                                   if(pais==0){
                                                                   $("#operador").next().html("Si no encuentras a tu operador es porque este servicio no está aún disponible para ese operador.");
                                                                   sms_ = null;
                                                                   
                                                                   }else{
                                                                   pais--;
                                                                   console.log(pais);
                                                                   sms_ = number_text[pais].split('-');
                                                                   $("#operador").next().html(terms_conds[pais]);
                                                                   }
                                                                   }
                                                                   },
                                                                   error: function(a,b,c){
                                                                   console.log(b+' '+c);
                                                                   },
                                                                   complete: function(a,b,c){
                                                                   $("#perfil_loader").removeClass('loading');
                                                                   $("#perfil_loader").css("display","none");
                                                                   ajax_meta = null;
                                                                   }
                                                                   });
                                                }
                                                }else{
                                                $('#impresion').html('<p>Por favor llena ambos campos.</p>');
                                                }
                                                });
                         }
                         });
}

function get_perfil(user_id){
    if(user_id==1||user_id==20||user_id==19) return false;
    //screen_to_hide.push(screen_perfil);
    screen_perfil.wrapper.html('<br><br><img width="10%" style="margin: 0 auto; display: block;" src="img/loader.gif"/><br><br>');
    //screen_perfil.find('screen_title').html('<button class="close_window" onclick="screen_perfil.hide()">x</button>');
    ajax_perfil = $.ajax({
                         url: urlws,
                         dataType: 'html',
                         type: 'post',
                         data: {
                         action: 'get_perfil2', //antes get_perfil
                         app: 'La voz de Dios',
                         user_login: user_login,
                         user_pass: user_pass,
                         pais: pais,
                         user_id: user_id,
                         timeOffset: timeOffset
                         },
                         success: function(a,b,c){
                         //alert(a);
                         screen_perfil.wrapper.html(a);
                         },
                         error: function(a,b,c){
                         console.log(b+' '+c);
                         },
                         complete: function(a,b,c){
                         ajax_perfil = null;
                         
                         if(scroll_suscripcion == true){
                         scroll_suscripcion = false;
                         screen_perfil.wrapper.animate(
                                                       {
                                                       scrollTop: jQuery(screen_perfil.wrapper).height()
                                                       },
                                                       1000,
                                                       null
                                                       );
                         }
                         
                         $("#tel").on('keyup',function (e) {
                                      var tel = $('#tel').val();
                                      if (!(/^\d+$/.test(tel))) {
                                      $('#tel').val(tel.substring(0,tel.length-1));
                                      navigator.notification.alert('Por favor ingresa solamente números',null,'Voz de Dios','Ok');
                                      return false;
                                      }
                                      });
                         
                         $('.user_meta').change(function(){
                                                
                                                var tel = $('#tel').val();
                                                if(tel.length<8){
                                                navigator.notification.alert('Tu no. de teléfono no está completo',null,'Voz de Dios','Ok');
                                                return false;
                                                }else if(tel.length>8){
                                                navigator.notification.alert('Has ingresado un número de teléfono muy largo',null,'Voz de Dios','Ok');
                                                return false;
                                                }else if(tel=='00000000'){
                                                navigator.notification.alert('Parece que tu número de teléfono no es correcto',null,'Voz de Dios','Ok');
                                                return false;
                                                }
                                                
                                                console.log("entro");
                                                $("#perfil_loader").addClass('loading');
                                                $("#perfil_loader").css("display","block");
                                                $('#operador').next().html('');
                                                
                                                var operador = $("#operador").val();//[0].selectedIndex;
                                                
                                                
                                                var tel = $('#tel').val();
                                                var pais = $('#operador')[0].selectedIndex;
                                                console.log(operador+"-"+tel);
                                                if(operador!='' && tel!=''){
                                                if(ajax_meta==null){
                                                ajax_meta = $.ajax({
                                                                   url: urlws,
                                                                   dataType: 'html',
                                                                   type: 'post',
                                                                   data: {
                                                                   action: 'update_meta_app',
                                                                   user_login: user_login,
                                                                   user_pass: user_pass,
                                                                   operador:operador,
                                                                   tel:tel,
                                                                   app: 'La voz de Dios',
                                                                   pais: pais,
                                                                   timeOffset: timeOffset
                                                                   },
                                                                   success: function(a,b,c){
                                                                   console.log("update_meta: "+a);
                                                                   if(operador=='Claro-Guatemala'){
                                                                   no_telefono = '502'+$('#tel').val();
                                                                   altaweb2.endpoint = 'GT';
                                                                   altaweb2.tariff = 1022;
                                                                   }else if(operador=='Claro-El Salvador'){
                                                                   no_telefono = '503'+$('#tel').val();
                                                                   altaweb2.endpoint = 'SV';
                                                                   altaweb2.tariff = 1079;
                                                                   }else if(operador=='Claro-Honduras'){
                                                                   no_telefono = '504'+$('#tel').val();
                                                                   altaweb2.endpoint = 'HN';
                                                                   altaweb2.tariff = 1049;
                                                                   }else if(operador=='Claro-Nicaragua'){
                                                                   no_telefono = '505'+$('#tel').val();
                                                                   altaweb2.endpoint = 'NI';
                                                                   altaweb2.tariff = 1127;
                                                                   }else if(operador=='Claro-Costa Rica'){
                                                                   no_telefono = '506'+$('#tel').val();
                                                                   altaweb2.endpoint = 'CR';
                                                                   altaweb2.tariff = 1037;
                                                                   }
                                                                   if(a=='1'){
                                                                   window.localStorage.setItem('estado','premium');
                                                                   user_estado = 'premium';
                                                                   //$('#impresion').html("<p style='font-weight:bold;'>Ya eres miembro PREMIER y puedes disfrutar de todos sus beneficios.</p>");
                                                                   $('#impresion').html('<span id="impresion"><p style="font-weight:bold;">Ya eres miembro PREMIER y puedes disfrutar de todos sus beneficios.</p><button id="send_suscription" onclick="screen_faqs.show();screen_faqs.wrapper.scrollTop(h2_top);">Dejar de ser miembro premier</button></span>');
                                                                   $("#operador").next().html("");
                                                                   $('#datos-para-freemium').hide();
                                                                   }else{
                                                                   window.localStorage.setItem('estado','freemium');
                                                                   user_estado = 'freemium';
                                                                   //$('#impresion').html('<button id="send_suscription" onclick="altaweb.register();">Subscribir</button>');
                                                                   focus_trivia = false;
                                                                   $('#datos-para-freemium').show();
                                                                   $('#impresion').html(altaweb2.html_get_pin);
                                                                   $("#operador").next().html("");
                                                                   if(pais==0){
                                                                   $("#operador").next().html("Si no encuentras a tu operador es porque este servicio no está aún disponible para ese operador.");
                                                                   sms_ = null;
                                                                   
                                                                   }else{
                                                                   pais--;
                                                                   console.log(pais);
                                                                   sms_ = number_text[pais].split('-');
                                                                   $("#operador").next().html(terms_conds[pais]);
                                                                   }
                                                                   }
                                                                   },
                                                                   error: function(a,b,c){
                                                                   console.log(b+' '+c);
                                                                   },
                                                                   complete: function(a,b,c){
                                                                   $("#perfil_loader").removeClass('loading');
                                                                   $("#perfil_loader").css("display","none");
                                                                   ajax_meta = null;
                                                                   }
                                                                   });
                                                }
                                                }else{
                                                $('#impresion').html('<p>Por favor llena ambos campos.</p>');
                                                }
                                                });
                         }
                         });
}
var sms_ = null;
function enviarSMS(numero,frase){
    
    if(sms_==null){
        navigator.notification.alert('Debes seleccionar un operador', null, 'Voz de Dios','ok');
        return false;
    }
    
    var options = {
    replaceLineBreaks: false, // true to replace \n by a new line, false by default
    android: {
    intent: 'INTENT'  // send SMS with the native android SMS messaging
        //intent: '' // send SMS without open any other app
    }
    };
    var pais = $("#operador")[0].selectedIndex;
    var success = function () {
        console.log('Message sent successfully');
        //send_suscription();
    };
    var error = function (e) {
        console.log('Message Failed:' + e);
        //send_suscription();
    };
    sms.send(sms_[1], sms_[0], options, success, error);
}

function exit_suscription(op){
    focus_trivia = false;
    sms_ = number_salir[op].split('-');
    var options = {
    replaceLineBreaks: false, // true to replace \n by a new line, false by default
    android: {
    intent: 'INTENT'  // send SMS with the native android SMS messaging
        //intent: '' // send SMS without open any other app
    }
    };
    var success = function () {
        console.log('Message sent successfully');
        send_desuscription();
    };
    var error = function (e) {
        console.log('Message Failed:' + e);
        send_desuscription();
    };
    sms.send(sms_[1], sms_[0], options, success, error);
}

function show_terms_new(){
    focus_trivia = false;
    var pais = $("#operador")[0].selectedIndex;
    if(pais==0){
        $("#operador").next().html("Si no encuentras a tu operador es porque este servicio no está aún disponible para ese operador. Esta nota desaparece cuando selecciona un operador.");
        sms_ = null;
        return false;
    }
    pais--;
    console.log(pais);
    sms_ = number_text[pais].split('-');
    $("#tel").attr("style","");
    $("#check_number").attr("style","text-align: center;");
    if(jQuery("#send_suscription").length > 0) jQuery("#send_suscription").attr("style","display: none !important; text-align: center;");
    $(".terms_intruc").html(terms_conds[pais]);
    screen_perfil.wrapper.animate(
                                  {
                                  scrollTop: jQuery(screen_perfil.wrapper).height()
                                  },
                                  1000,
                                  null
                                  );
}

function check_number(){
    if($("#check_number").hasClass("loading")) return false;
    
    var tel = $("#tel").val();
    var ope = $("#operador").val();
    
    if(tel=="" || ope==""){
        return false;
    }
    
    $("#check_number").addClass("loading");
    console.log(tel+" "+ope);
    $.ajax({
           url: urlws,
           dataType: 'html',
           type: 'post',
           data: {
           action: 'update_meta_app',
           user_login: user_login,
           user_pass: user_pass,
           tel: tel,
           ope: ope,
           app: 'La voz de Dios',
           pais: pais,
           timeOffset: timeOffset
           },
           success: function(a,b,c){
           console.log(a);
           screen_perfil.wrapper.append(a);
           },
           error: function(a,b,c){
           console.log(b+' '+c);
           },
           complete: function(a,b,c){
           $("#check_number").removeClass("loading");
           if(typeof hide_check_number != 'undefined'){
           $("#check_number").attr("style","display: none !important;");
           }
           
           }
           });
}

var ajax_perfil_ext = null;
function get_perfil_ext(user_id){
    if(user_id==1||user_id==20||user_id==19) return false;
    screen_to_hide.push(screen_perfil);
    screen_perfil_ext.show();
    screen_perfil_ext.wrapper.html('<br><br><img width="10%" style="margin: 0 auto; display: block;" src="img/loader.gif"/><br><br>');
    screen_perfil_ext.find('screen_title').html('<button class="close_window" onclick="screen_perfil_ext.hide()">&larr;</button>');
    ajax_perfil_ext = $.ajax({
                             url: urlws,
                             dataType: 'html',
                             type: 'post',
                             data: {
                             action: 'get_perfil_ext',
                             app: 'La voz de Dios',
                             user_login: user_login,
                             user_pass: user_pass,
                             pais: pais,
                             user_id: user_id,
                             timeOffset: timeOffset
                             },
                             success: function(a,b,c){
                             screen_perfil_ext.wrapper.html(a);
                             },
                             error: function(a,b,c){
                             console.log(b+' '+c);
                             },
                             complete: function(a,b,c){ ajax_perfil_ext = null;
                             }
                             });
}

function recortar_foto(){
    console.log("RECORTAR FOTOXXX");
    
    $('#foto_user').cropper({
                            background:false,
                            movable: false,
                            rotatable:false,
                            toggleDragModeOnDblclick:false,
                            minCropBoxWidth:160,
                            minCropBoxHeight:160,
                            autoCrop: false,
                            built: function () {
                            show_hide_buttons('show');
                            $(this).cropper('crop');
                            }
                            });
}
function cancelar_imagen(){
    $('#foto_user').cropper('destroy');
    show_hide_buttons('1');
}
function aceptar_imagen(){
    console.log('aceptar');
    var url = $('#foto_user').cropper('getCroppedCanvas').toDataURL();
    //$('#foto_user').cropper('clear');
    $('#foto_user').cropper('destroy');
    fotoSeleccionadaProfile(url);
    show_hide_buttons('1');
}
function show_hide_buttons(action){
    /*
    	if(action=='show'){
     $('#aceptar_recortar').css('display','inline-block');
     $('#cancelar_recortar').css('display','inline-block');
    	}else{
     $('#aceptar_recortar').css('display','none');
     $('#cancelar_recortar').css('display','none');
    	}
    	*/
    if(action=='show'){
        $('#aceptar_recortar').css('visibility','visible');
        $('#cancelar_recortar').css('visibility','visible');
    }else{
        $('#aceptar_recortar').css('visibility','hidden');
        $('#cancelar_recortar').css('visibility','hidden');
    }
}

/*funciones para cambiar la foto*/

function cambiar_foto(){
    if(IMG_URI_PROFILE!=null){
        return false;
    }
    
    if(isNaN(user_login)){
        navigator.notification.confirm(
                                       'Deseas actualizar tu foto, ¿de donde la tomamos?',
                                       function(btn){
                                       if(btn==1){
                                       useCameraProfile();
                                       }else if(btn==2){
                                       useFileProfile();
                                       }
                                       },
                                       'Voz de Dios',
                                       ['Cámara','Álbum','Cancelar']
                                       );
    }else{
        navigator.notification.alert('Tu foto se obtiene de facebook, se actualiza sola.',null,'Voz de Dios','ok');
    }
}

/*FOTO CONTROLLES*/
var IMG_URI_PROFILE = null;
var LAST_IMG = null;
function fotoSeleccionadaProfile(imageURI){
    LAST_IMG = jQuery(".user_pic").find('img').attr('src');
    IMG_URI_PROFILE = imageURI;
    jQuery(".user_pic").find('img').attr('src',IMG_URI_PROFILE);
    //subirfoto y guardarla
    
    var url = urlws;
    
    var options = new FileUploadOptions();
    var params = {};
    
    options.mimeType = 'image/jpeg';
    params.image_user = "true";
    params.video_user = "false";
    
    options.fileKey  = "file";
    options.fileName = IMG_URI_PROFILE.substr(IMG_URI_PROFILE.lastIndexOf('/')+1);
    options.chunkedMode = false;
    
    params.action ='update_image_ws';
    params.user_login = user_login;
    params.user_pass = user_pass;
    params.app = 'La voz de Dios';
    options.params = params;
    
    
    var ft = new FileTransfer();
    ft.onprogress = function(progressEvent) {
        if (progressEvent.lengthComputable) {
            console.log(parseInt(progressEvent.loaded / progressEvent.total * 100)+"%");
        } else {
            console.log("otro");
        }
    };
    
    ft.upload(
              IMG_URI_PROFILE,
              encodeURI(url),
              function(r) {
              console.log(r);
              LAST_IMG = null;
              IMG_URI_PROFILE = null;
              },
              function(error) {
              console.log(r);
              jQuery(".user_pic").find('img').attr('src',LAST_IMG);
              LAST_IMG = null;
              IMG_URI_PROFILE = null;
              navigator.notification.alert('Ocurrio un imprevisto, intenta de nuevo.',null,'Voz de Dios','ok');
              }, options
              );
    
}

function onFailProfile(){
    IMG_URI_PROFILE = null;
}

function useCameraProfile(){
    navigator.camera.getPicture(
                                fotoSeleccionadaProfile,
                                onFailProfile,
                                { 	quality: 49,
                                destinationType: navigator.camera.DestinationType.FILE_URI,
                                sourceType: navigator.camera.PictureSourceType.CAMERA,
                                encodingType : navigator.camera.EncodingType.JPEG,
                                allowEdit : false,
                                targetWidth : 320,
                                targetHeight : 320,
                                correctOrientation: true
                                }
                                );
}

function useFileProfile(){
    navigator.camera.getPicture(
                                fotoSeleccionadaProfile,
                                onFailProfile,
                                {
                                quality: 49,
                                destinationType: navigator.camera.DestinationType.FILE_URI,
                                sourceType: navigator.camera.PictureSourceType.SAVEDPHOTOALBUM,
                                encodingType : navigator.camera.EncodingType.JPEG,
                                allowEdit : false,
                                targetWidth : 320,
                                targetHeight : 320,
                                correctOrientation: true
                                }
                                );
}

/*follow*/

function afollow(obj){
    var dis = $(obj);
    var user_id = dis.data('user_id');
    var me_id = dis.data('me_id');
    var action = 'follow';
    
    if(dis.hasClass('follow')){
        dis.removeClass('follow');
        dis.html("Seguir");
        action = 'unfollow';
        var ss = parseInt($("#seguidores0").html());
        ss--;
        $("#seguidores0").html(ss);
        ss = parseInt($("#seguidos1").html());
        ss--;
        $("#seguidos1").html(ss);
    }else{
        dis.addClass('follow');
        dis.html("Dejar de seguir");
        action = 'follow';
        var ss = parseInt($("#seguidores0").html());
        ss++;
        $("#seguidores0").html(ss);
        ss = parseInt($("#seguidos1").html());
        ss++;
        $("#seguidos1").html(ss);
    }
    
    $.ajax({
           url: urlws,
           dataType: 'text',
           type: 'post',
           data: {
           action: action,
           app: 'La voz de Dios',
           me_id: me_id,
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
           complete: function(a,b,c){
           //screen_varios.input.keyup();
           show_friends_search();
           }
           });
    
}

//10.1 Altas Web

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
                                      //scroll_suscripcion = true;
                                      //show_screen('#screen_perfil');
                                      $('#datos-para-freemium').hide();
                                      }else if(user_estado=='premium'){
                                      window.localStorage.setItem('estado','freemium');
                                      user_estado = 'freemium';
                                      console.log(user_estado);
                                      $('#impresion').html('<span id="impresion"><button id="send_suscription" onclick="altaweb.register();">Continuar</button></span>');
                                      $("#operador").next().html("");
                                      $('#datos-para-freemium').show();
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
    var tel = $('#tel').val();
    if (!(/^\d+$/.test(tel))) {
        navigator.notification.alert('Por favor ingresa solamente números',null,'Voz de Dios','Ok');
        return false;
    }
    if(tel.length<8){
        navigator.notification.alert('Tu no. de teléfono no está completo',null,'Voz de Dios','Ok');
        return false;
    }else if(tel.length>8){
        navigator.notification.alert('Has ingresado un número de teléfono muy largo',null,'Voz de Dios','Ok');
        return false;
    }else if(tel=='00000000'){
        navigator.notification.alert('Parece que tu número de teléfono no es correcto',null,'Voz de Dios','Ok');
        return false;
    }
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
    //new_user_birthday = new Date($('#years').val(),$("#months").val()-1,$("#days").val());
    //console.log(new_user_birthday);
    
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

//10.2 Alta Web 2s

var altaweb2 = {};
altaweb2.tariff = 1022;
altaweb2.endpoint = '';
altaweb2.transid = '';
altaweb2.pin = 0;
altaweb2.ajax = null;
altaweb2.html_insert_pin = '<input type="number" id="pin_input" name="pin_input">'+
'<button id="send_suscription" onclick="altaweb2.send_pin();">Confirmar PIN</button>';
altaweb2.html_get_pin = '<button id="send_suscription" onclick="altaweb2.get_pin();">Continuar</button>';
altaweb2.get_pin = function(){
    window.plugins.flurry.logEvent('Presiono Get Pin');
    var data =  {
    tariff: altaweb2.tariff,
    ani: no_telefono
    };
    
    if(altaweb2.ajax == null && !$('#send_suscription').hasClass('loading')){
        $('#send_suscription').addClass('loading');
        altaweb2.ajax = $.ajax({
                               url: 'http://pauta.clx.tc/api/insia',
                               dataType: 'json',
                               type: 'get',
                               data: data,
                               timeout:10000,
                               success: function(a,b,c){
                               console.log('get pin '+a);
                               
                               try{
                               var resp = JSON.parse(a);
                               altaweb2.transid = resp.TransaID;
                               console.log('trans id '+altaweb2.transid+' error '+resp.error);
                               if(resp.error =='0'){
                               $('#impresion').html(altaweb2.html_insert_pin);
                               window.plugins.flurry.logEvent('Recibio Pin Exitosamente');
                               navigator.notification.alert(
                                                            "Por favor ingresa el pin que se te ha enviado por SMS en este momento",
                                                            null,
                                                            "Voz de Dios",
                                                            "Ok"
                                                            );
                               }else{
                               window.plugins.flurry.logEvent('Error Enviar Pin');
                               navigator.notification.alert(
                                                            "Ha ocurrido un error al enviarte el PIN. Por favor, intenta nuevamente",
                                                            null,
                                                            "Voz de Dios",
                                                            "Ok"
                                                            );
                               }
                               }catch(e){
                               window.plugins.flurry.logEvent('Error Enviar Pin');
                               console.log(e);
                               navigator.notification.alert(
                                                            "Ha ocurrido un error al enviarte el PIN. Por favor, intenta nuevamente",
                                                            null,
                                                            "Voz de Dios",
                                                            "Ok"
                                                            );
                               }
                               },
                               error: function(a,b,c){
                               window.plugins.flurry.logEvent('Error Enviar Pin');
                               console.log('get pin error '+b+' '+c);
                               navigator.notification.alert(
                                                            "Ha ocurrido un error al enviarte el PIN. Por favor, intenta nuevamente",
                                                            null,
                                                            "Voz de Dios",
                                                            "Ok"
                                                            );
                               },
                               complete: function(a,b,c){
                               $('#send_suscription').removeClass('loading');
                               altaweb2.ajax = null;
                               }
                               });
    }
}
altaweb2.send_pin = function(pin){
    window.plugins.flurry.logEvent('Intento Verificar Pin');
    var pin = $('#pin_input').val();
    var data =  {
    tariff: altaweb2.tariff,
    ani: no_telefono.substring(3),
    userpin: pin,
    transid: altaweb2.transid,
    endoint: altaweb2.endpoint
    };
    
    if(altaweb2.ajax == null && !$('#send_suscription').hasClass('loading')){
        $('#send_suscription').addClass('loading');
        altaweb2.ajax = $.ajax({
                               url: 'http://pauta.clx.tc/api/insiapin',
                               dataType: 'json',
                               type: 'get',
                               data: data,
                               timeout:10000,
                               success: function(a,b,c){
                               console.log('get pin '+a);
                               window.plugins.flurry.logEvent('Verifico Pin Exitosamente');
                               try{
                               var resp = JSON.parse(a);
                               
                               if(resp.error =='0'){
                               if(resp.StatusCode==1125){ //pin validation failed
                               window.plugins.flurry.logEvent('Error Verificar Pin');
                               navigator.notification.alert(
                                                            "Ha ocurrido un error al verificar el PIN. Por favor, intenta nuevamente",
                                                            null,
                                                            "Voz de Dios",
                                                            "Ok"
                                                            );
                               $('#impresion').html(altaweb2.html_get_pin);
                               }else if(resp.StatusCode == 1000){ //success
                               window.plugins.flurry.logEvent('Conversion Premier');
                               altaweb2.update_estado_wp();
                               window.localStorage.setItem('estado','premium');
                               user_estado = 'premium';
                               console.log(user_estado);
                               $('#impresion').html('<span id="impresion"><p style="font-weight:bold;">Ya eres miembro PREMIER y puedes disfrutar de todos sus beneficios.</p><button id="send_suscription" onclick="screen_faqs.show();screen_faqs.wrapper.animate( {scrollTop: jQuery(screen_faqs.wrapper).height()},1000, null);">Dejar de ser miembro premier</button></span>');
                               $("#operador").next().html("");
                               $('#datos-para-freemium').hide();
                               }else if(resp.StatusCode == 4002){ //duplicate subscription
                               altaweb2.update_estado_wp();
                               /*navigator.notification.alert(
                                "Parece que ya tenías una subscripción activa anteriormente",
                                null,
                                "I Love Concerts",
                                "Ok"
                                );*/
                               window.localStorage.setItem('estado','premium');
                               user_estado = 'premium';
                               console.log(user_estado);
                               $('#impresion').html('<span id="impresion"><p style="font-weight:bold;">Ya eres miembro PREMIER y puedes disfrutar de todos sus beneficios.</p><button id="send_suscription" onclick="screen_faqs.show();screen_faqs.wrapper.animate( {scrollTop: jQuery(screen_faqs.wrapper).height()},1000, null);">Dejar de ser miembro premier</button></span>');
                               $("#operador").next().html("");
                               $('#datos-para-freemium').hide();
                               }
                               
                               }else{
                               window.plugins.flurry.logEvent('Error Verificar Pin');
                               navigator.notification.alert(
                                                            "Ha ocurrido un error al verificar el PIN. Por favor, intenta nuevamente",
                                                            null,
                                                            "Voz de Dios",
                                                            "Ok"
                                                            );
                               }
                               }catch(e){
                               console.log(e);
                               navigator.notification.alert(
                                                            "Ha ocurrido un error al verificar el PIN. Por favor, intenta nuevamente",
                                                            null,
                                                            "Voz de Dios",
                                                            "Ok"
                                                            );
                               }
                               },
                               error: function(a,b,c){
                               console.log('get pin error '+b+' '+c);
                               navigator.notification.alert(
                                                            "Ha ocurrido un error al verificar el PIN. Por favor, intenta nuevamente",
                                                            null,
                                                            "I Love Concerts",
                                                            "Ok"
                                                            );
                               },
                               complete: function(a,b,c){
                               $('#send_suscription').removeClass('loading');
                               altaweb2.ajax = null;
                               }
                               });
    }
}
altaweb2.update_estado_wp = function(){
    $.ajax({
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
           console.log('send subscription '+a);
           
           },
           error: function(a,b,c){
           console.log(b+' '+c);
           },
           complete: function(a,b,c){
           
           }
           });
}
altaweb2.check_number = function(){
    console.log('entro check number');
    $.ajax({
           url: urlws,
           dataType: 'html',
           type: 'post',
           data: {
           action: 'last_activity2', //antes last_activity
           user_login: user_login,
           user_pass: user_pass,
           app: 'La voz de Dios'
           },
           success: function(a,b,c){
           console.log("last activity: "+a);
           if(a=='1'){
           //window.localStorage.setItem('estado','premium');
           user_estado = 'premium';
           }else{
           //window.localStorage.setItem('estado','freemium');
           user_estado = 'freemium';
           }
           },
           error: function(a,b,c){
           console.log(b+' '+c);
           },
           complete: function(a,b,c){
           
           }
           });
    /*var data = {
     msisdn:no_telefono,
     id_subscription:573
     };
     $.ajax({
     url: 'http://23.96.243.185:8090/api/AppQuery',
     dataType: 'json',
     type: 'get',
     data: data,
     success: function(a,b,c){
     console.log(JSON.stringify(a));
     
     
     },
     error: function(a,b,c){
     console.log('get pin error '+b+' '+c);
     
     },
     complete: function(a,b,c){
     console.log('complete check number');
     }
     });*/
}
// END Screen Perfil
//-----------------------------------------------------------------------
//11. Screen Grupos

//Variables
var screen_grupos = $("#screen_grupos");
screen_grupos.wrapper = screen_grupos.find('wrapper');
screen_grupos.title = screen_grupos.find('screen_title');

var IMG_URI_PROFILE_GRUPO = null;
var LAST_IMG_GRUPO = null;
var nombre_nuevo_grupo = '';
var grupo_actual = 0;
screen_grupos.ajax_search = null;
screen_grupos.input = screen_grupos.find('#search_grupos');
//Funciones


screen_grupos.show = function(){
    screen_grupos.removeClass('downed');
    screen_to_hide.push(screen_grupos);
};
screen_grupos.hide = function(){
    screen_grupos.wrapper.html('');
    screen_grupos.input.val('');
    screen_grupos.addClass('downed');
};

screen_grupos.input.keyup(function(){
                          var dis = $(this);
                          var val = dis.val();
                          
                          if(screen_grupos.ajax_search!=null){
                          screen_grupos.ajax_search.abort();
                          screen_grupos.ajax_search = null;
                          }
                          
                          var data = 	{
                          action: 'search_grupos',
                          app: 'La voz de Dios',
                          pais: pais,
                          timeOffset: timeOffset,
                          id_user: user_id_search,
                          s: val,
                          user_login: user_login,
                          user_pass: user_pass,
                          };
                          
                          console.log(urlws);
                          console.log(data);
                          
                          
                          screen_grupos.wrapper.html('<br><img width="10%" style="margin: 0 auto; display: block;" src="img/loader.gif"/><br><br>');
                          screen_grupos.ajax_search = $.ajax({
                                                             url: urlws,
                                                             dataType: 'text',
                                                             type: 'post',
                                                             data: data,
                                                             success: function(a,b,c){
                                                             screen_grupos.wrapper.html(a);
                                                             },
                                                             error: function(a,b,c){
                                                             console.log(b+' '+c);
                                                             },
                                                             complete: function(a,b,c){
                                                             screen_grupos.ajax_search = null;
                                                             }
                                                             });
                          
                          });

function add_grupo(){
    if(jQuery('.add_grupo').hasClass('loading')) return false;
    jQuery('.add_grupo').addClass('loading');
    navigator.notification.prompt(
                                  'Ingrese el nombre de la tribu',
                                  function onPrompt(results) {
                                  if(results.buttonIndex == 1 && results.input1 != ""){
                                  nombre_nuevo_grupo = results.input1;
                                  create_grupo();
                                  return false;
                                  }
                                  jQuery('.add_grupo').removeClass('loading');
                                  },
                                  'Nueva tribu',
                                  ['Crear','Cancelar'],
                                  ''
                                  );
}

function create_grupo(){
    var data = 	{
    action: 'create_grupo',
    app: 'La voz de Dios',
    pais: pais,
    timeOffset: timeOffset,
    user_login: user_login,
    user_pass: user_pass,
    nombre_grupo: nombre_nuevo_grupo
    };
    
    screen_grupos.ajax_search = $.ajax({
                                       url: urlws,
                                       dataType: 'text',
                                       type: 'post',
                                       data: data,
                                       success: function(a,b,c){
                                       screen_grupos.wrapper.html(a);
                                       jQuery('.add_grupo').remove();
                                       window.plugins.flurry.logEventWithParameters('Crear Tribu',{estado:user_estado},function(){},function(){});
                                       
                                       },
                                       error: function(a,b,c){
                                       jQuery('.add_grupo').removeClass('loading');
                                       console.log(b+' '+c);
                                       user_data.data.grupo = null;
                                       delete user_data.data.grupo;
                                       navigator.notification.alert('Ocurrio un imprevisto, intenta de nuevo', null, 'Voz de Dios','ok');
                                       },
                                       complete: function(a,b,c){
                                       
                                       }
                                       });
}

function delete_grupo(obj){
    var dis = $(obj);
    
    if(dis.hasClass('loading')) return false;
    dis.addClass('loading')
    
    var grupo_id = dis.data('grupo_id');
    var me_id = dis.data('me_id');
    var action = 'follow';
    
    var data = 	{
    action: 'delete_grupo',
    app: 'La voz de Dios',
    pais: pais,
    timeOffset: timeOffset,
    user_login: user_login,
    user_pass: user_pass,
    grupo_id: grupo_id
    };
    
    $.ajax({
           url: urlws,
           dataType: 'text',
           type: 'post',
           data: data,
           success: function(a,b,c){
           screen_single_grupo.wrapper.append(a);
           window.plugins.flurry.logEventWithParameters('Borrar Tribu',{estado:user_estado},function(){},function(){});
           
           },
           error: function(a,b,c){
           console.log(b+' '+c);
           },
           complete: function(a,b,c){
           console.log(a);
           if($('.button_delete_grupo').length) $('.button_delete_grupo').removeClass('loading');
           }
           });
    
}

function show_my_grupos(){
    
    var present = window.localStorage.getItem('ya_tribus');
    if(present==null){
        show_info('tribus');
        window.localStorage.setItem('ya_tribus','ya');
    }
    
    screen_grupos.wrapper.html('<br><img width="10%" style="margin: 0 auto; display: block;" src="img/loader.gif"/><br><br>');
    screen_grupos.show();
    if(user_data.data.grupo == undefined) screen_grupos.title.html('<button class="close_window" onclick="screen_grupos.hide();">x</button>Tribus<button class="add_grupo" onclick="add_grupo();">Crear grupo</button>');
    else screen_grupos.title.html('<button class="close_window" onclick="screen_grupos.hide();">x</button>Tribus');
    
    
    var data = 	{
    action: 'get_my_grupo',
    app: 'La voz de Dios',
    pais: pais,
    timeOffset: timeOffset,
    user_login: user_login,
    user_pass: user_pass,
    };
    
    $.ajax({
           url: urlws,
           dataType: 'text',
           type: 'post',
           data: data,
           success: function(a,b,c){
           screen_grupos.wrapper.html(a);
           },
           error: function(a,b,c){
           console.log(b+' '+c);
           },
           complete: function(a,b,c){
           
           }
           });
}

function show_single_grupo(grupo_id){
    grupo_actual = grupo_id;
    screen_single_grupo.show();
    
    var data = 	{
    action: 'get_single_grupo',
    app: 'La voz de Dios',
    pais: pais,
    timeOffset: timeOffset,
    grupo_id: grupo_id,
    user_login: user_login,
    user_pass: user_pass,
    flurry:'si'
    };
    
    screen_single_grupo.wrapper.html('<br><img width="10%" style="margin: 0 auto; display: block;" src="img/loader.gif"/><br><br>');
    $.ajax({
           url: urlws,
           dataType: 'text',
           type: 'post',
           data: data,
           success: function(a,b,c){
           screen_single_grupo.wrapper.html(a);
           },
           error: function(a,b,c){
           console.log(b+' '+c);
           },
           complete: function(a,b,c){
           
           }
           });
}

function ajoin(obj){
    var dis = $(obj);
    
    if(dis.hasClass('loading')) return false;
    
    var grupo_id = dis.data('grupo_id');
    var me_id = dis.data('me_id');
    var action = 'follow';
    
    if(dis.hasClass('join')){
        dis.removeClass('join');
        dis.html("Unirse a la tribu");
        action = 'unjoin_grupo';
        var accion_flurry = 'Dejar tribu';
        var ss = parseInt($("#miembros").html());
        ss--;
        $("#miembros").html(ss);
    }else{
        dis.addClass('join');
        dis.html("Dejar tribu");
        action = 'join_grupo';
        var accion_flurry = 'Unirse a tribu';
        var ss = parseInt($("#miembros").html());
        ss++;
        $("#miembros").html(ss);
    }
    
    
    dis.addClass("loading");
    
    $.ajax({
           url: urlws,
           dataType: 'text',
           type: 'post',
           data: {
           action: action,
           app: 'La voz de Dios',
           me_id: me_id,
           grupo_id: grupo_id,
           pais: pais,
           timeOffset: timeOffset,
           user_login: user_login,
           user_pass: user_pass
           },
           success: function(a,b,c){
           screen_single_grupo.append(a);
           window.plugins.flurry.logEventWithParameters(accion_flurry,{estado:user_estado},function(){console.log(accion_flurry);},function(){console.log(accion_flurry+'error');});
           },
           error: function(a,b,c){
           console.log(b+' '+c);
           },
           complete: function(a,b,c){
           screen_grupos.input.keyup();
           }
           });
    
}

/*funciones para cambiar la foto*/

function cambiar_foto_grupo(){
    if(IMG_URI_PROFILE_GRUPO!=null){
        return false;
    }
    
    navigator.notification.confirm(
                                   'Deseas actualizar tu foto, ¿de donde la tomamos?',
                                   function(btn){
                                   if(btn==1){
                                   useCameraProfile_grupo();
                                   }else if(btn==2){
                                   useFileProfile_grupo();
                                   }
                                   },
                                   'Voz de Dios',
                                   ['Cámara','Álbum','Cancelar']
                                   );
    
}

function fotoSeleccionadaProfile_grupo(imageURI){
    LAST_IMG_GRUPO = jQuery(".grupo_pic").find('img').attr('src');
    IMG_URI_PROFILE_GRUPO = imageURI;
    jQuery(".grupo_pic").find('img').attr('src',IMG_URI_PROFILE_GRUPO);
    //subirfoto y guardarla
    
    var url = urlws;
    
    var options = new FileUploadOptions();
    var params = {};
    
    options.mimeType = 'image/jpeg';
    params.image_user = "true";
    params.video_user = "false";
    
    options.fileKey  = "file";
    options.fileName = IMG_URI_PROFILE_GRUPO.substr(IMG_URI_PROFILE_GRUPO.lastIndexOf('/')+1);
    options.chunkedMode = false;
    
    params.action ='update_image_ws_grupo';
    params.user_login = user_login;
    params.user_pass = user_pass;
    params.app = 'La voz de Dios';
    params.grupo_id = grupo_actual;
    options.params = params;
    
    
    
    var ft = new FileTransfer();
    ft.onprogress = function(progressEvent) {
        if (progressEvent.lengthComputable) {
            console.log(parseInt(progressEvent.loaded / progressEvent.total * 100)+"%");
        } else {
            console.log("otro");
        }
    };
    
    ft.upload(
              IMG_URI_PROFILE_GRUPO,
              encodeURI(url),
              function(r) {
              console.log(r);
              LAST_IMG = null;
              IMG_URI_PROFILE_GRUPO = null;
              },
              function(error) {
              console.log(r);
              jQuery(".grupo_pic").find('img').attr('src',LAST_IMG_GRUPO);
              LAST_IMG_GRUPO = null;
              IMG_URI_PROFILE_GRUPO = null;
              navigator.notification.alert('Ocurrio un imprevisto, intenta de nuevo.',null,'Voz de Dios','ok');
              }, options
              );
    
}

function onFailProfile_grupo(){
    IMG_URI_PROFILE_GRUPO = null;
}

function useCameraProfile_grupo(){
    navigator.camera.getPicture(
                                fotoSeleccionadaProfile_grupo,
                                onFailProfile_grupo,
                                { 	quality: 49,
                                destinationType: navigator.camera.DestinationType.FILE_URI,
                                sourceType: navigator.camera.PictureSourceType.CAMERA,
                                encodingType : navigator.camera.EncodingType.JPEG,
                                allowEdit : true,
                                targetWidth : 320,
                                targetHeight : 320,
                                correctOrientation: true
                                }
                                );
}

function useFileProfile_grupo(){
    navigator.camera.getPicture(
                                fotoSeleccionadaProfile_grupo,
                                onFailProfile_grupo,
                                {
                                quality: 49,
                                destinationType: navigator.camera.DestinationType.FILE_URI,
                                sourceType: navigator.camera.PictureSourceType.SAVEDPHOTOALBUM,
                                encodingType : navigator.camera.EncodingType.JPEG,
                                allowEdit : true,
                                targetWidth : 320,
                                targetHeight : 320,
                                correctOrientation: true
                                }
                                );
}

function publicar_grupo_redes(src,url){
    //window.plugins.socialsharing.share(null,null,url,src,function(){ console.log('bien bajado'); button_share_promo = null;},function(){ console.log('no lo bajo'); button_share_promo = null;});
    window.plugins.socialsharing.share(src,null,null,null,function(){ console.log('bien bajado'); button_share_promo = null;},function(){ console.log('no lo bajo'); button_share_promo = null;});
    
}

function publicar_grupo_muro(name){
    $(".pgmbutton").addClass('loading');
    var si = false;
    $.ajax({
           url: urlws,
           dataType: 'html',
           type: 'post',
           data: {
           action: 'publish_post',
           app: 'La voz de Dios',
           user_login: user_login,
           user_pass: user_pass,
           content: '¡Los invito a unirse a mi TRIBU <strong>"'+name+'"</strong> para construir juntos el TEMPLO DE DIOS!',
           title: '¡Te invito a mi tribu!',
           pais: pais,
           plegaria: 0,
           timeOffset: timeOffset
           },
           success: function(a,b,c){
           si = true;
           window.plugins.flurry.logEventWithParameters('Publicacion muro invitacion a tribu',{estado:user_estado},function(){},function(){});
           
           },
           error: function(a,b,c){
           
           },
           complete: function(a,b,c){
           if(si){
           offset = 0;
           get_feeds();
           jQuery(".pgmbutton").removeClass('loading');
           navigator.notification.alert('Tu mensaje ha sido publicado con éxito.', null, 'Voz de Dios');
           }else{
           navigator.notification.alert('Ocurrio un imprevisto, intenta de nuevo', null, 'Voz de Dios');
           }
           }
           });
}

//END Screen Grupos
//-----------------------------------------------------------------------
//12. Screen Single Grupo

//Variables
var screen_single_grupo = $("#screen_single_grupo");
screen_single_grupo.wrapper = screen_single_grupo.find('wrapper');
screen_single_grupo.title = screen_single_grupo.find('screen_title');
//Funciones

screen_single_grupo.show = function(){
    screen_single_grupo.removeClass('righted');
    screen_to_hide.push(screen_single_grupo);
};
screen_single_grupo.hide = function(){
    screen_single_grupo.wrapper.html('');
    screen_single_grupo.addClass('righted');
};

//END Screen Single Grupo
//-----------------------------------------------------------------------
//13. Screen Write

//Variables
var screen_write = $("#screen_write");
screen_write.wrapper = screen_write.find('wrapper');
var oraciones = [
                 [
                  '"Padre bueno, me presento delante de ti en agradecimiento por cada bendición que me has dado, hoy quiero clamarte por mi salud, tu sabes lo que estoy sufriendo en estos momentos debido al dolor, pero yo creo Jesús que por tus llagas hemos sido sanados y tu sangre nos limpia de toda enfermedad, te agradezco porque sé que escuchas mi oración y por fe he sido libre de toda dolencia, amén." Señor, mi Dios, te pedí ayuda, y me sanaste; tú, Señor, me salvaste de la muerte; me diste vida, me libraste de morir. Salmos 30:2-3 (DHH)',
                  '"Dios y padre eterno, en los tiempos buenos y en los tiempos malos te doy gracias; hoy te pido por la salud de mi cuerpo, yo sé que no hay nada imposible para ti y que aún las enfermedades incurables son sanadas por tu gran poder, hoy hablo regeneración y vida para mi cuerpo en tu nombre Jesús, gracias por escuchar mi oración y por atender a mi súplica." Pero fue traspasado a causa de nuestra rebeldía, fue atormentado a causa de nuestras maldades; el castigo que sufrió nos trajo la paz, por sus heridas alcanzamos la salud. Isaías 53:5 (DHH)',
                  '"Señor Jesús, gracias por tu sacrificio en la cruz y por haber pagado con tu sangre el precio de nuestras enfermedades, hoy intercedo delante de ti por la salud de _____(nombre)_____, declaro con fe que tu Espíritu Santo toca su cuerpo, su alma y su espíritu, sé que tu me oyes y respondes a la oración del justo, agradezco tu misericordia y que se haga siempre tu voluntad, amén." Y cuando oren con fe, el enfermo sanará, y el Señor lo levantará; y si ha cometido pecados, le serán perdonados. Santiago 5:15 (DHH)'
                  ],
                 [
                  '“Padre, sé que he quebrantado tus leyes y que mis pecados me han separado de ti, estoy sinceramente arrepentido y ahora quiero apartarme de mi pasado pecaminoso y dirigirme hacia ti. Por favor, perdóname y ayúdame a no pecar de nuevo, yo creo que tu hijo Jesús murió por mis pecados, resucitó de la muerte, está vivo y escucha mi oración, hoy lo Invito a que se convierta en el Señor de mi vida, a que gobierne y reine en mi corazón de este día en adelante. Por favor, envía tu Espíritu Santo para que me ayude a obedecerte y a hacer tu voluntad por el resto de mi vida. En el nombre de Jesús oro, amén.” Pues con el corazón se cree para alcanzar la justicia, y con la boca se reconoce a Jesucristo para alcanzar la salvación. Romanos 10:10 (DHH)',
                  '"Señor Jesucristo, creo que eres el Hijo de Dios, reconozco que soy pecador, reconozco que te he fallado y me arrepiento de todo corazón, creo que has muerto por mí y que tu sangre derramada en la cruz me limpia de todos mis pecados, solo tú puedes salvarme, creo que has resucitado para darme vida eterna. Señor sálvame, te abro mi corazón y te recibo para siempre, ven a morar en mí con tu Santo Espíritu, gracias por atender a mi clamor, amén." Si con tu boca reconoces a Jesús como Señor, y con tu corazón crees que Dios lo resucitó, alcanzarás la salvación. Romanos 10:9 (DHH)',
                  '"Dios eterno y misericordioso, te agradezco por haber fijado tus ojos en mi y haberme salvado, hoy quiero clamarte por la vida de _____(nombre)_____, con la autoridad del nombre de Jesús declaro que su alma es librada del infierno y que sus rodillas se doblan ante ti, que reciba tu perdón y tu inmenso amor, abre sus ojos espirituales y que pueda conocerte en espíritu y en verdad, gracias porque sé que respondes, amén." y si mi pueblo, el pueblo que lleva mi nombre, se humilla, ora, me busca y deja su mala conducta, yo lo escucharé desde el cielo, perdonaré sus pecados y devolveré la prosperidad a su país. 2 de Crónicas 7:14 (DHH)'
                  ],
                 [
                  '"Gracias Señor por tu bondad y tu misericordia, hoy te pido que  esta difícil prueba no la tome como un castigo que envías, sino como una oportunidad que me brindas de poderte demostrar que mi amor es serio y que soy consecuente con la fe que profeso, sé que tú tienes planes para mi a través de este proceso y voy a lograr salir victorioso con la ayuda de tu Espíritu Santo, amén."" El Señor es mi poderoso protector; en él confié plenamente, y él me ayudó. Mi corazón está alegre; cantaré y daré gracias al Señor. Salmos 28:7 (DHH)',
                  '"Espíritu Santo, Dios de Amor, mírame en esta circunstancia difícil en que se encuentra mi vida y ten compasión de mí, confiadamente acudo a ti, pues sé que eres Dios de bondad y manantial de amor, te pido que me ayudes a superar esta situación difícil y que lejos de separarme de ti, me haga experimentar con mayor plenitud la omnipotencia de tu amor que limpia, santifica y salva. Haz en mí tu divina voluntad, amén." Tú eres mi protector, mi lugar de refugio, mi libertador, mi Dios, la roca que me protege, mi escudo, el poder que me salva, mi más alto escondite. Salmos 18:2 (DHH)',
                  '"Señor Jesús, tu eres el único que puede ayudarnos en situaciones difíciles, hoy me presento ante ti para clamarte por la vida de _____(nombre)_____, muéstrale el propósito de esta prueba y que logre salir vencedor con la ayuda de tu Espíritu Santo, que pueda fijar sus ojos en ti y no desviarse del camino, fortalece su alma y renueva sus fuerzas en el nombre de Jesús, amén." Tengan valor y firmeza; no tengan miedo ni se asusten cuando se enfrenten con ellas, porque el Señor su Dios está con ustedes y no los dejará ni los abandonará. Deuteronomio 31:6 (DHH)'
                  ],
                 [
                  '"Padre amado, no existe nadie más sabio que tu, hoy te agradezco y te pido que aumentes mi sabiduría para poder tomar las decisiones que se me presentan, entiendo que tu tienes un futuro de esperanza para mi vida y las decisiones que tome van a estar ligadas a ese futuro, ayúdame a descansar en ti y muchas gracias por escuchar mi oración, amén." Si a alguno de ustedes le falta sabiduría, pídasela a Dios, y él se la dará; pues Dios da a todos sin limitación y sin hacer reproche alguno. Santiago 1:5 (DHH)',
                  '"Señor, muchas gracias por tu eterno amor y por derramar tantas bendiciones en mi vida, hoy me presento delante de ti para pedirte que aumentes mi sabiduría, tu palabra dice que te la pidamos si nos hace falta y hoy lo hago con humildad, gracias por oír y atender mi petición, amén." Pues el Señor es quien da la sabiduría; la ciencia y el conocimiento brotan de sus labios. El Señor da su ayuda y protección a los que viven rectamente y sin tacha. Proverbios 2:6-7 (DHH)',
                  '"Mi padre y Dios bueno, tu que lo sabes y lo conoces todo, hoy vengo con un corazón agradecido para pedirte que aumentes la sabiduría de _____(nombre)_____, ayúdalo a dirigirse por la senda de tu justicia y que pueda tomar las decisiones correctas a la luz de tu voluntad, gracias por escuchar mi oración y por fe se que tu obrarás a su favor, amén."  Pido al Dios de nuestro Señor Jesucristo, al glorioso Padre, que les conceda el don espiritual de la sabiduría y se manifieste a ustedes, para que puedan conocerlo verdaderamente. Efesios 1:17 (DHH)'
                  ],
                 [
                  '"Padre, en el nombre de Jesús, vengo ante tu trono de gracia y te presento mi matrimonio, tal como es, tal como está, con sus dificultades, limitaciones y situaciones, lo rindo a tus pies, te pido Señor que así como tu amas a tu iglesia, podamos amarnos con fidelidad y sin limitaciones, quebranto y deshago cada maldición que haya venido a través de nuestra línea sanguínea en el nombre de Jesús, gracias porque sé que tu tomas las riendas de mi matrimonio y descanso en tus promesas, amén." Haya sobre todo mucho amor entre ustedes, porque el amor perdona muchos pecados. 1 de Pedro 4:8 (DHH)',
                  '"Mi buen Dios, tu instituiste el matrimonio como una fuente de bendición y no para maldición, hoy entrego mi matrimonio en tus manos declarando que está bendecido y está bajo tu cobertura Jesús, perdónanos por los pecados generacionales y por tanta desobediencia, rebeldía, corrupción que hemos cometido en tu contra y en contra de la institución del  matrimonio, suplico tu perdón y restauración en el poderoso nombre de Jesús, amén." Yo los amo a ustedes como el Padre me ama a mí; permanezcan, pues, en el amor que les tengo.  Juan 15:9 (DHH)',
                  '"Señor Jesús, tu amor no conoce límites, hoy vengo a pedirte humildemente por el matrimonio de _____(nombre)_____, tu conoces las pruebas y luchas que están atravesando, te pido Espíritu Santo que reafirmes los lazos del amor en esta pareja y los levantes para que ellos sean testimonio de tu amor, entrego sus vidas en tus manos en el nombre del Padre, del hijo y del Espíritu Santo, amén."  Más valen dos que uno, pues mayor provecho obtienen de su trabajo. Y si uno de ellos cae, el otro lo levanta. Eclesiastés 4:9-10 (DHH)'
                  ],
                 [
                  '"Padre amado, muchas gracias por mi familia, que en nuestra casa cuando se hable siempre nos miremos a los ojos y busquemos crecer juntos; que nadie esté sólo, ni en la indiferencia o el aburrimiento; que los problemas de los otros no sean desconocidos o ignorados, que pueda entrar quien tiene necesidad y sea bienvenido. Señor, que en nuestra casa sea importante el trabajo, pero no más importante que la alegría, que el descanso sea paz del corazón y del cuerpo; y que la mayor riqueza sea siempre estar juntos." Cree en el Señor Jesucristo, y serás salvo, tú y tu casa. Hechos 16:31 (DHH)',
                  '"Padre Celestial, gracias porque nos has dado un modelo de vida, te pido que en mi familia reine el amor, la paz y la alegría, ayúdanos a permanecer unidos por la oración en familia en los momentos de gozo y de dolor, enséñanos a ver a Jesucristo en los miembros de nuestra familia especialmente en los momentos de angustia, haz que nos amemos unos a otros cada día más así como Dios nos ama y perdona nuestras faltas y pecados, amén."  Bendeciré a los que te bendigan y maldeciré a los que te maldigan; por medio de ti bendeciré a todas las familias del mundo. Génesis 12:3 (DHH)',
                  '"Bendito seas Señor, porque en tu amor nos creaste para formar parte de una familia, hoy quiero pedirte por la familia de _____(nombre)_____, te pido que protejas y conserves su hogar, enséñales a aceptarse como son, con sus cualidades y defectos, a presentarte sus planes y sueños, a pedir tu ayuda y que sepan llevar tu mensaje de amor a todos los que los rodean, que tu amor los conserve siempre unidos y en paz, por Jesucristo nuestro Señor, amén." Hermanos, en el nombre de nuestro Señor Jesucristo les ruego que todos estén siempre de acuerdo y que no haya divisiones entre ustedes. Vivan en armonía, pensando y sintiendo de la misma manera. 1 de Corintios 1:10 (DHH)'
                  ],
                 [
                  '"Padre Santo, vengo ante ti en este día con un corazón contrito y humillado reconociendo que te necesito; tú conoces mis luchas y los obstáculos que estoy enfrentando, en este momento pongo en tus manos mis finanzas, el fruto del trabajo que me has dado y las bendiciones que han venido a mi vida, por favor no permitas Señor que el devorador se lleve lo que tú me has dado, muéstrame con tu Santo Espíritu cualquier error que esté cometiendo, o cualquier influencia de maldad externa que este obstruyendo tu bendición económica, declaro en el nombre de Jesús que mis finanzas son libres en tus manos, amén." De ti vienen las riquezas y la honra. Tú lo gobiernas todo. La fuerza y el poder están en tu mano, y en tu mano está también el dar grandeza y poder a todos. 1 Crónicas 29:12 (DHH)',
                  '"Amado Padre, gracias por bendecirme y amarme, hoy pongo ante tus pies mi empleo, mis habilidades, mi oficio/profesión, y te pido que abras las puertas para que pueda obtener un salario justo y una ganancia honesta. Así como tú multiplicaste los panes, manda Señor que se multiplique lo que tengo hoy en las manos, y así como tú caminaste sobre las aguas, dame  una revelación para que pueda caminar sobre las tormentas que buscan hundirme en la desesperación; deposito mis finanzas en tus manos y te doy el señorío sobre mi vida, gracias por oír mi oración, amén." Por lo tanto, mi Dios les dará a ustedes todo lo que les falte, conforme a las gloriosas riquezas que tiene en Cristo Jesús. Filipenses 4:19 (DHH)',
                  '"Señor Jesús, me presento delante de ti con agradecimiento, en este día te pido por un poderoso milagro económico para _____(nombre)_____, te clamo por un cambio definitivo y total en su situación financiera, tu conoces lo que está atravesando y sé que por fe que es libre de la esclavitud de las deudas, hoy declaro que cese toda tensión y ansiedad, que entienda tu voluntad y muéstrale el camino que debe tomar para llevar sus finanzas a puerto seguro, todo esto lo pido en el nombre del Padre, del Hijo y del Espíritu Santo, amén." Siempre les he enseñado que así se debe trabajar y ayudar a los que están en necesidad, recordando aquellas palabras del Señor Jesús: “Hay más dicha en dar que en recibir. Hechos 20:35 (DHH)'
                  ],
                 [
                  '"Señor, estoy inmensamente agradecido contigo, gracias por todo lo que la vida nos ofrece y tu amor nos da, gracias por obrar a mi favor y bendecirme de la forma en que lo haces, ayúdame a bendecir a los demás y a compartir lo que tú me has dado con aquellos que lo necesitan, rindo mis preocupaciones a ti y descanso sabiendo que tú me amas" Den gracias a Dios por todo, porque esto es lo que él quiere de ustedes como creyentes en Cristo Jesús. 1 Tesalonicenses 5:18 (DHH)"',
                  '"Padre, tú que me has llamado tu hijo, quiero darte gracias por hacerme participe de las bendiciones de tu Reino, gracias porque en todo momento y situación he visto tu mano poderosa, gracias porque me has hecho libre y renovaste mi manera de pensar, te amo y no me canso de darte gracias Señor Jesús, amén." Lavadas ya mis manos y limpias de pecado, quiero, Señor, acercarme a tu altar, y entonar cantos de alabanza, y proclamar tus maravillas. Salmos 26:6-7 (DHH)'
                  ]
                 ];


var oraciones_select = {
    '0': [
          'Salud propia opción 1',
          'Salud propia opción 2',
          'Salud para otra persona'
          ],
    '1': [
          'Salvación propia opción 1',
          'Salvación propia opción 2',
          'Salvación para otra persona'
          ],
    '2': [
          'Fortaleza propia opción 1',
          'Fortaleza propia opción 2',
          'Fortaleza para otra persona'
          ],
    '3': [
          'Sabiduría propia opción 1',
          'Sabiduría propia opción 2',
          'Sabiduría para otra persona'
          ],
    '4': [
          'Mejorar tu relación opción 1',
          'Mejorar tu relación opción 2',
          'Mejorar la relación de otro'
          ],
    '5': [
          'Tu familia opción 1',
          'Tu familia opción 2',
          'Por la familia de otra persona'
          ],
    '6': [
          'Tu situación económica opción 1',
          'Tu situación económica opción 2',
          'Situación económica de otra persona'
          ],
    '7': [
          'Agradecimiento opción 1',
          'Agradecimiento opción 2'
          ]
};

var titulos = [
               [
                'Por favor únete a mi oración delante de Dios',
                'Por favor acompáñame en mi oración al Padre',
                'Ayúdame por favor a orar por quien lo necesita'
                ],
               [
                'Por favor únete a mi oración delante de Dios',
                'Por favor acompáñame en mi oración al Padre',
                'Ayúdame por favor a orar por quien lo necesita'
                ],
               [
                'Por favor únete a mi oración delante de Dios',
                'Por favor acompáñame en mi oración al Padre',
                'Ayúdame por favor a orar por quien lo necesita'
                ],
               [
                'Por favor únete a mi oración delante de Dios',
                'Por favor acompáñame en mi oración al Padre',
                'Ayúdame por favor a orar por quien lo necesita'
                ],
               [
                'Por favor únete a mi oración delante de Dios',
                'Por favor acompáñame en mi oración al Padre',
                'Ayúdame por favor a orar por quien lo necesita'
                ],
               [
                'Por favor únete a mi oración delante de Dios',
                'Por favor acompáñame en mi oración al Padre',
                'Ayúdame por favor a orar por quien lo necesita'
                ],
               [
                'Por favor únete a mi oración delante de Dios',
                'Por favor acompáñame en mi oración al Padre',
                'Ayúdame por favor a orar por quien lo necesita'
                ],
               [
                'Comparte conmigo este agradecimiento a Dios por sus bendiciones',
                'Agradezcamos juntos a Dios por sus inmensas bendiciones'
                ]
               ];



var motivo_idx = "";
var oracion_idx = "";

//Funciones

screen_write.show = function(){
    if(jQuery(".publish").hasClass('loading')) return false;
    focus_trivia = false;
    jQuery(".publish").removeClass('loading');
    screen_write.removeClass('downed');
    screen_to_hide.push(screen_write);
};
screen_write.hide = function(){
    focus_trivia = true;
    motivo_idx = "";
    oracion_idx = "";
    screen_write.addClass('downed');
};

function removeImg(){
    if(jQuery(".publish").hasClass('loading')) return false;
    if(jQuery(".attach").length > 0) jQuery(".attach").remove();
}

/*VIDEO CONTROLLER*/
var captureSuccess = function(mediaFiles) {
    var i, path, len;
    for (i = 0, len = mediaFiles.length; i < len; i += 1) {
        path = mediaFiles[i].fullPath;
    }
    if(jQuery(".attach").length > 0) jQuery(".attach").remove();
    var html = 	'<video onclick="removeImg()" class="attach" id="video_user" width="50%" height="100px" name="preview" data-src="'+path+'" src="'+path+'"></video>';
    screen_write.wrapper.append(html);
};
var captureError = function(error) {
    //navigator.notification.alert('Error code: ' + error.code, null, 'Capture Error');
};

/*FOTO CONTROLLES*/
function fotoSeleccionada(imageURI){
    if(jQuery(".attach").length > 0) jQuery(".attach").remove();
    var html = 	'<img onclick="removeImg()" class="attach" id="image_user" width="50%"  data-src="'+imageURI+'" src="'+imageURI+'" />';
    screen_write.wrapper.append(html);
}

function useCamera(){
    if(jQuery(".publish").hasClass('loading')) return false;
    navigator.camera.getPicture(
                                fotoSeleccionada,
                                onFail,
                                {
                                quality: 49,
                                destinationType: navigator.camera.DestinationType.FILE_URI,
                                sourceType: navigator.camera.PictureSourceType.CAMERA,
                                encodingType : navigator.camera.EncodingType.JPEG,
                                allowEdit : true,
                                targetWidth : 640,
                                targetHeight : 640,
                                correctOrientation: true
                                }
                                );
}

function useFile(){
    if(jQuery(".publish").hasClass('loading')) return false;
    navigator.camera.getPicture(
                                fotoSeleccionada,
                                onFail,
                                {
                                quality: 49,
                                destinationType: navigator.camera.DestinationType.FILE_URI,
                                sourceType: navigator.camera.PictureSourceType.SAVEDPHOTOALBUM,
                                encodingType : navigator.camera.EncodingType.JPEG,
                                allowEdit : true,
                                targetWidth : 640,
                                targetHeight : 640,
                                correctOrientation: true
                                }
                                );
}

function onFail(message) {
    
}

function get_photo(){
    navigator.notification.confirm(
                                   '¿Desde dónde deseas seleccionar la foto?',
                                   function(btn){
                                   if(btn==1){
                                   useCamera();
                                   }else if(btn==2){
                                   useFile();
                                   }
                                   },
                                   'Voz de Dios',
                                   ['Cámara','Álbum','Cancelar']
                                   );
}

function get_video(){
    // start video capture
    navigator.device.capture.captureVideo(captureSuccess, captureError, {limit:1,duration:60});
}

/*ACCIONES DE PUBLICAR Y LIKE*/
function publish(){
    if(jQuery(".publish").hasClass('loading')) return false;
    var content = jQuery('#post_content').val();
    var title = jQuery('#post_title').val();
    var tipo_post = 'normal';
    var attachment_post = 'ninguno';
    var adjuntos = jQuery('.attach').length;
    console.log('adjuntos '+adjuntos);
    if(content=="" && title=="" && adjuntos == 0){
        navigator.notification.alert('Parece que tu publicación está vacía',null,'Voz de Dios','Ok');
        return false;
    }
    
    jQuery(".publish").addClass('loading');
    
    if(adjuntos > 0){ //cuando hay archivo
        var url = urlws;
        var options = new FileUploadOptions();
        var params = {};
        var IMG_URI = $('.attach').attr('src');
        var id = $('.attach').attr('id');
        
        if(id == "video_user") {
            options.mimeType = 'video/quicktime';
            params.image_user = "false";
            params.video_user = "true";
            attachment_post = 'video';
        }else{
            options.mimeType = 'image/jpeg';
            params.image_user = "true";
            params.video_user = "false";
            attachment_post = 'imagen';
        }
        options.fileKey  = "file";
        options.fileName = IMG_URI.substr(IMG_URI.lastIndexOf('/')+1);
        options.chunkedMode = false;
        
        params.action ='publish_post';
        params.user_login = user_login;
        params.user_pass = user_pass;
        params.content = content;
        params.title = title;
        params.app = 'La voz de Dios';
        if(oracion_idx!= "" && motivo_idx != ""){
            params.plegaria = "1";
            tipo_post = 'plegaria';
        }
        else{
            params.plegaria = "0";
        }
        
        options.params = params;
        
        
        var ft = new FileTransfer();
        ft.onprogress = function(progressEvent) {
            if (progressEvent.lengthComputable) {
                console.log(parseInt(progressEvent.loaded / progressEvent.total * 100)+"%");
            } else {
                console.log("otro");
            }
        };
        
        ft.upload(
                  IMG_URI,
                  encodeURI(url),
                  function(r) {
                  window.plugins.flurry.logEventWithParameters('Publicacion',{estado:user_estado,tipo:tipo_post,attachment:attachment_post},function(){console.log('flurry post');},function(){console.log('flurry post fail');});
                  
                  jQuery(".publish").removeClass('loading');
                  screen_write.hide();
                  removeImg();
                  jQuery('#post_content').val('');
                  jQuery('#post_title').val('');
                  offset = 0;
                  get_feeds();
                  console.log('publish ft.upload');
                  if(plegaria=='0' && user_estado == 'freemium'){
                  
                  navigator.notification.confirm(
                                                 'Conviértete en Miembro Premier para acumular puntos por cada like que obtengas en tus publicaciones',
                                                 function onConfirm(buttonIndex) {
                                                 if(buttonIndex==1){
                                                 window.plugins.flurry.logEventWithParameters('Si, vamos',{desde:'Publicar normal'},function(){},function(){});
                                                 
                                                 scroll_suscripcion = true;
                                                 show_screen('#screen_perfil');
                                                 screen_write.hide();
                                                 }
                                                 
                                                 },
                                                 'Voz de Dios',
                                                 ['Sí, vamos','Ahora no']     // buttonLabels
                                                 );
                  
                  
                  }
                  },
                  function(error) {
                  jQuery(".publish").removeClass('loading');
                  navigator.notification.alert('Ocurio un imprevisto, intente de nuevo.',null,'Voz de Dios','ok');
                  }, options
                  );
    }else{
        var plegaria = "0";
        if(oracion_idx!= "" && motivo_idx != "") {
            plegaria = "1";
            tipo_post = 'plegaria';
        }
        $.ajax({
               url: urlws,
               dataType: 'html',
               type: 'post',
               data: {
               action: 'publish_post',
               app: 'La voz de Dios',
               user_login: user_login,
               user_pass: user_pass,
               content: content,
               title: title,
               pais: pais,
               plegaria: plegaria,
               timeOffset: timeOffset
               },
               success: function(a,b,c){
               window.plugins.flurry.logEventWithParameters('Publicacion',{estado:user_estado,tipo:tipo_post,attachment:attachment_post},function(){console.log('flurry post');},function(){console.log('flurry post fail');});
               
               },
               error: function(a,b,c){
               alert(b+' '+c);
               },
               complete: function(a,b,c){
              	screen_write.hide();
               offset = 0;
               get_feeds();
               jQuery(".publish").removeClass('loading');
               jQuery('#motivador').val("");
               
               jQuery('#nombre_oracion').addClass('none');
               /*
                screen_write.wrapper.find('textarea').val('');
                screen_write.wrapper.find('input').val('');
                */
               jQuery('#post_content').val('');
               jQuery('#post_title').val('');
               if(plegaria=='0' && user_estado == 'freemium'){
               
               navigator.notification.confirm(
                                              'Conviértete en Miembro Premier para acumular puntos por cada like que obtengas en tus publicaciones',
                                              function onConfirm(buttonIndex) {
                                              if(buttonIndex==1){
                                              window.plugins.flurry.logEventWithParameters('Si, vamos',{desde:'Publicar normal'},function(){},function(){});
                                              
                                              scroll_suscripcion = true;
                                              show_screen('#screen_perfil');
                                              screen_write.hide();
                                              }
                                              
                                              },
                                              'Voz de Dios',
                                              ['Sí, vamos','Ahora no']     // buttonLabels
                                              );
               
               
               }
               
               
               }
               });
    }
}



jQuery('#motivador').change(function(){
                            
                            //if(user_data.data.premium == undefined){
                            if(user_estado == 'freemium'){
                            navigator.notification.confirm(
                                                           'Debes ser MIEMBRO PREMIER para poder compartir peticiones de oración, ¿Deseas suscribirte?',
                                                           function onConfirm(buttonIndex) {
                                                           if(buttonIndex==1){
                                                           window.plugins.flurry.logEventWithParameters('Si, vamos',{desde:'Publicar peticion'},function(){},function(){});
                                                           
                                                           scroll_suscripcion = true;
                                                           //show_perfil(true,user_data.ID);
                                                           show_screen('#screen_perfil');
                                                           screen_write.hide();
                                                           }
                                                           jQuery('#motivador').val("");
                                                           },
                                                           'Voz de Dios',
                                                           ['Sí, vamos','Ahora no']     // buttonLabels
                                                           );
                            return false;
                            }
                            
                            
                            var val = jQuery(this).val();
                            motivo_idx = val;
                            if(val!=""){
                            jQuery('#nombre_oracion').html('<option value="">Selecciona oración</option>');
                            var count = 0;
                            jQuery.each(oraciones_select[val],function(idx,value){
                                        jQuery('#nombre_oracion').append('<option value="'+count+'">'+value+'</option>');
                                        count++;
                                        });
                            jQuery('#nombre_oracion').removeClass('none');
                            }else{
                            jQuery('#nombre_oracion').addClass('none');
                            screen_write.wrapper.find('textarea').val('');
                            screen_write.wrapper.find('input').val('');
                            }
                            
                            });

jQuery('#nombre_oracion').change(function(){
                                 oracion_idx = jQuery(this).val();
                                 console.log(motivo_idx+" "+oracion_idx);
                                 if(oracion_idx=='2'){
                                 navigator.notification.prompt(
                                                               'Ingrese el nombre de la persona a quien diriges esta oración',
                                                               function onPrompt(results) {
                                                               if(results.buttonIndex == 1 && results.input1 != ""){
                                                               var orac = oraciones[motivo_idx][oracion_idx]+"";
                                                               var orac_ = orac.replace('_____(nombre)_____','"'+results.input1+'"');
                                                               screen_write.wrapper.find('textarea').val(orac_);
                                                               screen_write.wrapper.find('input').val(titulos[motivo_idx][oracion_idx]);
                                                               return false;
                                                               }else if(results.buttonIndex == 1 && results.input1 == ""){
                                                               jQuery('#nombre_oracion').change();
                                                               }
                                                               
                                                               },
                                                               'Nueva oración',
                                                               ['Aceptar','Cancelar'],
                                                               ''
                                                               );
                                 }else if(oracion_idx!=''){
                                 screen_write.wrapper.find('textarea').val(oraciones[motivo_idx][oracion_idx]);
                                 screen_write.wrapper.find('input').val(titulos[motivo_idx][oracion_idx]);
                                 }else{
                                 screen_write.wrapper.find('textarea').val('');
                                 screen_write.wrapper.find('input').val('');
                                 }
                                 });
function show_write(op){
    
    if(op) {
        
        screen_write.wrapper.find('#motivador').removeClass('none');
        screen_write.wrapper.find('.instruc_publish').removeClass('none');
        
        if(user_data.data.premium != undefined){
            
        }else{
            //        	screen_write.wrapper.find('#motivador').addClass('none');
            //            screen_write.wrapper.find('.instruc_publish').addClass('none');
        }
        
        if(jQuery('.attach').length > 0){ jQuery('.attach').remove();}
        screen_write.wrapper.find('input').val('');
        screen_write.wrapper.find('textarea').val('');
        screen_write.wrapper.find('.nombre_oracion').addClass('none');
        jQuery('#nombre_oracion').addClass('none');
        screen_write.wrapper.find('#motivador').val('');
        screen_write.show();
    }else {screen_write.addClass("downed");}
}
// END Screen Write
//-----------------------------------------------------------------------
//14. Screen Consuelo

//Variables
var screen_consuelo = $("#screen_consuelo");
screen_consuelo.wrapper = screen_consuelo.find('wrapper');
//Funciones
screen_consuelo.show = function(){
    screen_consuelo.removeClass('downed');
    screen_to_hide.push(screen_consuelo);
};
screen_consuelo.hide = function(){
    screen_consuelo.wrapper.html('');
    screen_consuelo.addClass('downed');
};
function show_consuelo(op){
    if(op){
        screen_consuelo.removeClass("downed");
    }else{
        get_trivia();
        screen_consuelo.addClass("downed");
    }
}

// END Screen Consuelo
//-----------------------------------------------------------------------
//15. Screen Login
//Variables
var screen_login = $("#screen_login");
var user_email = '';
var user_login = "";
var user_pass = "";
var user_img = '';
var user_name = '';
var pais = '';
var user_data = {};
var user_token = null;


//Funciones
screen_login.show = function(){
    focus_trivia = false;
    screen_login.removeClass('lefted');
};
screen_login.hide = function(){focus_trivia = true; screen_login.addClass('lefted');};
function create_or_login_user_by_facebook_id(){
    $("#button_facebook_connect").addClass("loading");
    $.ajax({
           url: urlws,
           dataType: 'json',
           type: 'post',
           data: {
           action: 'create_or_login_user_by_facebook_id',
           app: 'La voz de Dios',
           user_birthday:user_birthday,
           user_gender:user_gender,
           user_email: user_email,
           user_login: user_login,
           user_pass: user_pass,
           user_img: user_img,
           user_name: user_name,
           user_token: user_token,
           user_platform: device.platform,
           user_uuid: device.uuid,
           user_version: device.version,
           pais: pais,
           user: user_token,
           timeOffset: timeOffset
           },
           success: function(a,b,c){
           console.log(JSON.stringify(a));
           user_data = a;
           },
           error: function(a,b,c){
           console.log(b+' '+c);
           user_data = {
           msj: 'Ocurrió un imprevisto, intenta de nuevo.'
           };
           //navigator.notification.alert('Ocurrio un imprevisto, intenta de nuevo.', null, 'La voz de Dios','ok');
           },
           complete: function(a,b,c){
           if(user_data.msj==undefined){
           
           window.localStorage.setItem('estado',user_data.data.estado);
           window.localStorage.setItem("user_login",user_login);
           window.localStorage.setItem("user_pass",user_pass);
           user_estado = user_data.data.estado;
           console.log("estado: "+user_estado);
           user_id = user_data.data.ID;
           window.plugins.flurry.setUserID(''+user_id,function(){console.log('set user id');},function(){console.log('set user id fail');});
           
           if(user_data.data.operador=='Claro-Guatemala'){
           no_telefono = '502'+user_data.data.tel;
           altaweb2.endpoint = 'GT';
           altaweb2.tariff = 1022;
           }else if(user_data.data.operador=='Claro-El Salvador'){
           no_telefono = '503'+user_data.data.tel;
           altaweb2.endpoint = 'SV';
           altaweb2.tariff = 1079;
           }else if(user_data.data.operador=='Claro-Honduras'){
           no_telefono = '504'+user_data.data.tel;
           altaweb2.endpoint = 'HN';
           altaweb2.tariff = 1049;
           }else if(user_data.data.operador=='Claro-Nicaragua'){
           no_telefono = '505'+user_data.data.tel;
           altaweb2.endpoint = 'NI';
           altaweb2.tariff = 1127;
           }else if(user_data.data.operador=='Claro-Costa Rica'){
           no_telefono = '506'+user_data.data.tel;
           altaweb2.endpoint = 'CR';
           altaweb2.tariff = 1037;
           }
           
           screen_login.hide();
           get_feeds();
           get_promos();
           get_trivia();
           mostrar_diapositivas_gratis();
           if(ir_a_promos_){
           show_promos_apn();
           }
           //refreshfeed
           screen_timeline.interval = setInterval(function(){
                                                  check_new_feed();
                                                  },refresh_interval);
           screen_timeline.nfeed.fadeOut('fast');
           
           screen_timeline.wrapper.find("iframe").each(function(){
                                                       var dis = $(this);
                                                       dis.attr('width',"100%");
                                                       dis.attr('height',jQuery(window).width()*0.8);
                                                       });
           
           }else{
           navigator.notification.alert(user_data.msj, null, 'Voz de Dios','ok');
           user_data = {};
           }
           $("#button_facebook_connect").removeClass("loading");
           }
           });
}
var ajax_login_normal = null;
function login_normal(){
    if($("#button_login").hasClass('loading')) return false;
    
    user_login = $("#user_login").val();
    user_pass = $("#user_pass").val();
    
    if(user_login == "" || user_pass == ""){
        navigator.notification.alert('Debes definir todos los campos', null, 'Voz de Dios','ok');
        return false;
    }
    
    $("#button_login").addClass("loading");
    if(ajax_login_normal==null && internet==true){
        ajax_login_normal = $.ajax({
                                   url: urlws,
                                   dataType: 'json',
                                   type: 'post',
                                   timeout:10000,
                                   data: {
                                   action: 'login_normal',
                                   app: 'La voz de Dios',
                                   user_email:user_login,
                                   user_login: user_login,
                                   user_pass: user_pass,
                                   user_token: user_token,
                                   user_platform: device.platform,
                                   user_uuid: device.uuid,
                                   user_version: device.version,
                                   pais: pais,
                                   timeOffset: timeOffset
                                   },
                                   success: function(a,b,c){
                                   user_data = a;
                                   console.log(user_data);            
                                   },
                                   error: function(a,b,c){
                                   console.log(b+' '+c);
                                   user_data = {msj: 'Ocurrio un imprevisto, intenta de nuevo!'};
                                   },
                                   complete: function(a,b,c){
                                   ajax_login_normal = null;
                                   if(user_data.msj==undefined){
                                   
                                   window.localStorage.setItem("user_login",user_login);
                                   window.localStorage.setItem("user_pass",user_pass);
                                   //nuevo
                                   /*if(user_data.data.estado!='freemium' || user_data.data.estado!='premium'){
                                    user_data.data.estado = 'freemium';
                                    }*/
                                   window.localStorage.setItem('estado',user_data.data.estado);
                                   user_estado = user_data.data.estado;
                                   console.log("user estado "+user_estado);
                                   user_id = user_data.data.ID;
                                   window.plugins.flurry.setUserID(''+user_id,function(){console.log('set user id');},function(){console.log('set user id fail');});
                                   if(user_data.data.operador=='Claro-Guatemala'){
                                   no_telefono = '502'+user_data.data.tel;
                                   altaweb2.endpoint = 'GT';
                                   altaweb2.tariff = 1022;
                                   }else if(user_data.data.operador=='Claro-El Salvador'){
                                   no_telefono = '503'+user_data.data.tel;
                                   altaweb2.endpoint = 'SV';
                                   altaweb2.tariff = 1079;
                                   }else if(user_data.data.operador=='Claro-Honduras'){
                                   no_telefono = '504'+user_data.data.tel;
                                   altaweb2.endpoint = 'HN';
                                   altaweb2.tariff = 1049;
                                   }else if(user_data.data.operador=='Claro-Nicaragua'){
                                   no_telefono = '505'+user_data.data.tel;
                                   altaweb2.endpoint = 'NI';
                                   altaweb2.tariff = 1127;
                                   }else if(user_data.data.operador=='Claro-Costa Rica'){
                                   no_telefono = '506'+user_data.data.tel;
                                   altaweb2.endpoint = 'CR';
                                   altaweb2.tariff = 1037;
                                   }
                                   //
                                   get_feeds();
                                   get_promos();
                                   get_trivia();
                                   screen_login.hide();
                                   screen_registro.hide();
                                   mostrar_diapositivas_gratis();
                                   if(ir_a_promos_){
                                   show_promos_apn();
                                   }
                                   //refreshfeed
                                   screen_timeline.interval = setInterval(function(){
                                                                          check_new_feed();
                                                                          },refresh_interval);
                                   screen_timeline.nfeed.fadeOut('fast');
                                   
                                   screen_timeline.wrapper.find("iframe").each(function(){
                                                                               var dis = $(this);
                                                                               dis.attr('width',"100%");
                                                                               dis.attr('height',jQuery(window).width()*0.8);
                                                                               });
                                   
                                   }else{
                                   window.localStorage.setItem("user_login","");
                                   window.localStorage.setItem("user_pass","");
                                   navigator.notification.alert(user_data.msj, null, 'Voz de Dios','ok');
                                   user_data = {};
                                   }
                                   $("#button_login").removeClass("loading");
                                   $("#user_login").val("");
                                   $("#user_pass").val("");
                                   }
                                   });
    }else if(internet==false){
        $("#button_login").removeClass("loading");
        navigator.notification.alert('Necesitas una conexión activa de internet para ingresar', null, 'Voz de Dios','Ok');
    }
}

function get_lost_password(){
    navigator.notification.prompt(
                                  'Por favor ingresa tu correo electrónico con el que te registraste.',  // message
                                  function(results) {
                                  if(results.buttonIndex==1){
                                  var correo = results.input1;
                                  if(correo==" " || correo=="") return false;
                                  var partes = correo.split("@");
                                  if(partes.length!=2) {
                                  navigator.notification.alert('El correo no es válido',null,'Voz de Dios','ok');
                                  return false;
                                  }
                                  $.ajax({
                                         url: urlws,
                                         dataType: 'html',
                                         type: 'post',
                                         timeout: 15000,
                                         data: {
                                         action: 'get_lost_password',
                                         app: 'La voz de Dios',
                                         correo: correo,
                                         pais: pais,
                                         timeOffset: timeOffset
                                         },
                                         success: function(a,b,c){
                                         navigator.notification.alert(a,null,'Voz de Dios','Ok');
                                         },
                                         error: function(a,b,c){
                                         navigator.notification.alert('Ocurrió un imprevisto, intenta de nuevo.',null,'Voz de Dios','ok');
                                         }
                                         });
                                  }
                                  },                  // callback to invoke
                                  'Voz de Dios',            // title
                                  ['Enviar','Cancelar'],             // buttonLabels
                                  ' '                 // defaultText
                                  );
}
//15.1 Facebook
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
var already_called_init = false;
function getLoginStatus() {
    if(ajax_fb) return false;
    already_called_init = true;
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
                  },
                  function() {
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
    $("#button_facebook_connect").addClass("loading");
    if(internet){
        $("#button_facebook_connect").addClass("loading");
        //try{
        if(already_called_init){
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
        }else{
            FB.init({ appId: "825295254244111", nativeInterface: CDV.FB, useCachedDialogs: false });
            FB.login(
                     function(response) {
                     console.log(JSON.stringify(response));
                     if (response.status == "connected"){
                     me();
                     }else {
                     $("#button_facebook_connect").removeClass("loading");
                     FBSTATUS = false;
                     navigator.notification.alert(
                                                  'No se pudo conectar con facebook, intenta de nuevo.',  // message
                                                  null,         // callback
                                                  'Voz de Dios',            // title
                                                  'Ok :('                  // buttonName
                                                  );
                     }
                     },
                     { scope: "user_friends,email" });
        }
        //}
        /*catch(error){}
         finally{
         console.log("finally loginFacebook");
         }*/
    }else{
        $("#button_facebook_connect").removeClass("loading");
        navigator.notification.alert('Necesitas una conexión activa de internet para ingresar', null, 'Voz de Dios','Ok');
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
// END Screen Login
//-----------------------------------------------------------------------
//16. Screen Registro
//Variables
var new_user_login = "";
var new_user_pass = "";
var new_user_name = "";
var new_user_country = '';
var new_user_birthday = '';
var new_user_gender = '';
var screen_registro = $("#screen_registro");
screen_registro.wrapper = screen_registro.find('wrapper');
//Funciones
screen_registro.show = function(){
    screen_registro.removeClass('downed');	
    screen_to_hide.push(screen_registro);
};
screen_registro.hide = function(){
    screen_registro.addClass('downed');
};
function register(){
    if($("#button_register").hasClass('loading')) return false;
    
    new_user_login = $("#new_user_login").val();
    new_user_pass = $("#new_user_pass").val();
    new_user_name = $("#new_user_name").val();
    new_user_country = $("#new_user_country").val();
    //new_user_birthday = new Date($('#years').val(),$("#months").val()-1,$("#days").val());
    new_user_gender =  $("#genero_register").val();
    
    console.log(new_user_country);
    if(date_nacimiento==null  || new_user_login == "" || new_user_pass == "" || new_user_name == "" || new_user_country==null || new_user_gender ==null){
        navigator.notification.alert('Debes definir todos los campos', null, 'Voz de Dios','Ok');
        return false;
    }
    new_user_birthday = new Date(date_nacimiento.getFullYear(),date_nacimiento.getMonth(),date_nacimiento.getDate());
    
    $("#button_register").addClass("loading");
    $.ajax({
           url: urlws,
           dataType: 'json',
           type: 'post',
           timeout:10000,
           data: {
           action: 'register_new_user_ws',
           app: 'La voz de Dios',
           user_birthday: new_user_birthday,
           user_gender: new_user_gender,
           user_email: new_user_login,
           user_login: new_user_login,
           user_pass: new_user_pass,
           user_name: new_user_name,
           user_img: "http://app.clx.mobi/wp-content/uploads/2015/08/Screen-Shot-2015-08-04-at-09.20.56.png",            
           user_token: user_token,
           user_platform: device.platform,
           user_uuid: device.uuid,
           user_version: device.version,
           pais: pais,
           timeOffset: timeOffset
           },
           success: function(a,b,c){
           console.log(JSON.stringify(a));
           user_data = a;
           },
           error: function(a,b,c){
           console.log(b+' '+c);
           user_data = {msj: 'Ocurrio un imprevisto, intenta de nuevo!'};
           },
           complete: function(a,b,c){
           console.log(a);
           $("#button_register").removeClass("loading");
           if(user_data.msj==undefined){
           
           window.localStorage.setItem("user_login",new_user_login);
           window.localStorage.setItem("user_pass",new_user_pass);
           $("#user_login").val(new_user_login);
           $("#user_pass").val(new_user_pass);
           screen_registro.hide();
           login_normal();
           //nuevo
           if(user_data.data.estado!='freemium' || user_data.data.estado!='premium'){
           user_data.data.estado = 'freemium';
           }
           window.localStorage.setItem('estado',user_data.data.estado);
           
           }else{
           window.localStorage.setItem("user_login","");
           window.localStorage.setItem("user_pass","");
           navigator.notification.alert(user_data.msj, null, 'Voz de Dios','ok');
           }
           new_user_login = "";
           $("#new_user_login").val("");
           new_user_pass = "";
           $("#new_user_pass").val("");
           }
           });
}
// END Screen Registro
//-----------------------------------------------------------------------
//17. Screen Terms
//Variables
var screen_terms = $("#screen_terms");
screen_terms.wrapper = screen_terms.find('wrapper');
//Funciones
screen_terms.show = function(){
    focus_trivia = false;
    var pais = $("#operador")[0].selectedIndex;
    if(pais==0){
        navigator.notification.alert('Debes seleccionar un operador', null, 'Voz de Dios','ok');
        return false;
    }
    var tel = $("#tel").val();
    if(tel==""){
        navigator.notification.alert('Debes ingresar un número de teléfono', null, 'Voz de Dios','ok');
        return false;
    }
    pais--;
    console.log(pais);
    screen_terms.wrapper.html(terms_conds[pais]);
    screen_terms.removeClass('downed');	
};
screen_terms.hide = function(){
    focus_trivia = true; screen_terms.addClass('downed');
};

// END Screen Terms
//-----------------------------------------------------------------------
//18. Screen Reglamento
//Variables
var screen_reglamento = $("#screen_reglamento");
//Funciones
screen_reglamento.show = function(){
    focus_trivia = false; 
    screen_reglamento.removeClass('downed');
    screen_to_hide.push(screen_reglamento);
    window.plugins.flurry.logEvent('Ver Reglamento',function(){},function(){});
};
screen_reglamento.hide = function(){focus_trivia = true;  screen_reglamento.addClass('downed');};

// END Screen Reglamento
//-----------------------------------------------------------------------
//19. Screen Faqs
//Variables
var screen_faqs = $("#screen_faqs");
var h2_top = $('#dejar_premier_h2').position().top;
screen_faqs.wrapper = screen_faqs.find('wrapper');
//Funciones
screen_faqs.show = function(){
    focus_trivia = false; 
    screen_faqs.removeClass('downed');
    screen_to_hide.push(screen_faqs);	
    window.plugins.flurry.logEvent('Ver FAQs',function(){},function(){});
};
screen_faqs.hide = function(){
    focus_trivia = true; screen_faqs.addClass('downed');
};

// END Screen Faqs
//-----------------------------------------------------------------------
//20. Screen Varios
//Variables
var user_id_search = null;
var screen_varios = $("#screen_varios");
screen_varios.wrapper = screen_varios.find('wrapper');
screen_varios.title = screen_varios.find('screen_title');
screen_varios.input = screen_varios.find('#search_people');
screen_varios.ajax_search = null;
//Funciones
function mostrar_diapositivas_gratis(){
    var re = window.localStorage.getItem("fremium"+user_login);
    //re = null;
    if(re==null){
        show_info('freemium');
        window.localStorage.setItem("fremium"+user_login,'ya');
    }
    
}

screen_varios.show = function(){	
    focus_trivia = false; 
    screen_varios.removeClass('downed');
    screen_to_hide.push(screen_varios);
};
screen_varios.hide = function(){
    screen_varios.title.html('<button class="close_window" onclick="screen_varios.hide();">x</button>');
    screen_varios.wrapper.html('');
    focus_trivia = true;
    screen_varios.addClass('downed');    
};

screen_varios.input.keyup(function(){
                          var dis = $(this);
                          var val = dis.val();
                          var type = dis.data('type');
                          
                          if(screen_varios.ajax_search!=null){
                          screen_varios.ajax_search.abort();
                          screen_varios.ajax_search = null;
                          }
                          
                          var data = 	{
                          action: 'search_followers',
                          app: 'La voz de Dios',
                          pais: pais,
                          timeOffset: timeOffset,
                          id_user: user_id_search,
                          s: val,
                          user_login: user_login,
                          user_pass: user_pass,
                          type: type
                          };
                          
                          console.log(urlws);
                          console.log(data);
                          
                          
                          screen_varios.wrapper.html('<br><img width="10%" style="margin: 0 auto; display: block;" src="img/loader.gif"/><br><br>');
                          screen_varios.ajax_search = $.ajax({
                                                             url: urlws,
                                                             dataType: 'text',
                                                             type: 'post',
                                                             data: data,
                                                             success: function(a,b,c){
                                                             screen_varios.wrapper.html(a);
                                                             },
                                                             error: function(a,b,c){
                                                             console.log(b+' '+c);
                                                             },
                                                             complete: function(a,b,c){
                                                             console.log(a);
                                                             }
                                                             });
                          
                          });

function show_followers(id_user){
    screen_varios.title.html('<button class="close_window" onclick="screen_varios.hide();">x</button>Seguidores');
    screen_varios.show();
    screen_varios.wrapper.html('<br><img width="10%" style="margin: 0 auto; display: block;" src="img/loader.gif"/><br><br>');
    screen_varios.input.data('type','seguidores');
    user_id_search = id_user;
    console.log(id_user+" followers");
    $.ajax({
           url: urlws,
           dataType: 'text',
           type: 'post',
           data: {
           action: 'get_followers',
           app: 'La voz de Dios',
           pais: pais,
           user_login: user_login,
           user_pass: user_pass,
           timeOffset: timeOffset,
           id_user: user_id_search
           },
           success: function(a,b,c){
           screen_varios.wrapper.html(a);
           },
           error: function(a,b,c){
           console.log(b+' '+c);
           },
           complete: function(a,b,c){
           }
           });
}

function show_following(id_user){
    screen_varios.title.html('<button class="close_window" onclick="screen_varios.hide();">x</button>Seguidos');
    screen_varios.show();
    screen_varios.wrapper.html('<br><img width="10%" style="margin: 0 auto; display: block;" src="img/loader.gif"/><br><br>');
    screen_varios.input.data('type','seguidos');
    screen_varios.input.val('');
    user_id_search = id_user;
    console.log(id_user+" followers");
    $.ajax({
           url: urlws,
           dataType: 'text',
           type: 'post',
           data: {
           action: 'get_following',
           app: 'La voz de Dios',
           pais: pais,
           user_login: user_login,
           user_pass: user_pass,
           timeOffset: timeOffset,
           id_user: user_id_search
           },
           success: function(a,b,c){
           screen_varios.wrapper.html(a);
           },
           error: function(a,b,c){
           console.log(b+' '+c);
           },
           complete: function(a,b,c){
           }
           });
}

function show_friends_search(){	
    screen_varios.input.val('');
    screen_varios.input.data('type','people');
    screen_varios.title.html('<button class="close_window" onclick="screen_varios.hide();">x</button>Buscar amigos');
    screen_varios.wrapper.html('<br><br><img width="10%" style="margin: 0 auto; display: block;" src="img/loader.gif"/><br><br>');
    screen_varios.show();
    //ejecutamos la función de facebook.
    FB.api(
           '/me/friends',
           { fields: 'installed' },
           function(response) {
           if (response.error) {
           console.log("error amigos facebok: "+JSON.stringify(response))
           screen_varios.wrapper.html('');
           } else {
           var fb_friends = [];
           //recorro la respuesta de Facebook y guardo los id’s de facegook en el arreglo fb_friends vienen en formato 12348764538.
           jQuery.each(response.data,function(idx,val){
                       if(val.installed==false) return true;
                       fb_friends.push(val.id);
                       });
           
           console.log(fb_friends);
           //si viene vacío muestro en la pantalla que no hay mara.
           if(fb_friends.length == 0){
           screen_varios.wrapper.html('<br><br><p style="text-align: center;">No se encontraron amigos</p>');
           return true;
           }
           
           
           
           //ejecuto la función que mira los amigos esta en functions-movil de LVD.
           jQuery.ajax({
                       url: urlws,
                       dataType: 'html',
                       type: 'post',
                       data: {
                       action: 'get_already_friends_lvd',
                       app: 'La voz de Dios',
                       user_login: user_login,
                       user_pass: user_pass,
                       timeOffset: timeOffset,
                       friends_id: fb_friends,
                       },
                       success: function(a,b,c){
                       screen_varios.wrapper.html(a);
                       
                       },
                       error: function(a,b,c){
                       screen_varios.wrapper.html('<br><br><p style="text-align: center;">Ocurrio un imprevisto, intenta de nuevo.</p>');
                       },
                       complete: function(a,b,c){
                       
                       }
                       });
           }
           }
           );    
}
// END Screen Varios
//-----------------------------------------------------------------------
//21. Screen Info
//Variables
var screen_info = $("#screen_info");
screen_info.promos = {};
screen_info.slider = null;

screen_info.wrapper = screen_info.find('wrapper');
screen_info.scroller = screen_info.find('scroller');
//Funciones
screen_info.show = function(){	
    screen_info.removeClass('uped');
    screen_to_hide.push(screen_info);
};
screen_info.hide = function(){
    screen_info.addClass('uped');	
};
function show_info(ac){
    if(ac=="premium"){
        
    }else if(ac=="freemium"){
        get_4_info();
        screen_info.show();
    }else{
        get_tribus_info();
        screen_info.show();
    }
}
function get_4_info(){
    screen_info.slider = null;
    screen_info.scroller.attr('style','');
    screen_info.scroller.css('width','100%');
    
    var width = $(window).width()*0.9;
    
    screen_info.scroller.html('');
    screen_info.scroller.css('width',(width*5)+'px');
    screen_info.scroller.append('<div class="slide_" style="width: '+width+'px !important;"> <div style="width: 90%; height: 90%;"><img style="display: block;" width="85%"  src="img/Bienvenida/1.png"/></div> </div>');
    screen_info.scroller.append('<div class="slide_" style="width: '+width+'px !important;"> <div style="width: 90%; height: 90%;"><img style="display: block; " width="85%" src="img/Bienvenida/2.png"/></div> </div>');
    screen_info.scroller.append('<div class="slide_" style="width: '+width+'px !important;"> <div style="width: 90%; height: 90%;"><img style="display: block; " width="85%" src="img/Bienvenida/3.png"/></div> </div>');
    screen_info.scroller.append('<div class="slide_" style="width: '+width+'px !important;"> <div style="width: 90%; height: 90%;"><img style="display: block; " width="85%" src="img/Bienvenida/4.png"/></div> </div>');
    screen_info.scroller.append('<div class="slide_" style="width: '+width+'px !important;"> <div style="width: 90%; height: 90%;"><img style="display: block; " width="85%" src="img/Bienvenida/5.png"/></div> </div>');
    
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

function get_tribus_info(){
    
    screen_info.slider = null;
    screen_info.scroller.attr('style','');
    screen_info.scroller.css('width','100%');
    var width = $(window).width()*0.9;
    
    screen_info.scroller.html('');
    screen_info.scroller.css('width',(width*5)+'px');
    screen_info.scroller.append('<div class="slide_" style="width: '+width+'px !important;"> <div style="width: 90%; height: 90%;"><img style="display: block;" width="85%"  src="img/Tribus/1.png"/></div> </div>');
    screen_info.scroller.append('<div class="slide_" style="width: '+width+'px !important;"> <div style="width: 90%; height: 90%;"><img style="display: block;" width="85%"  src="img/Tribus/2.png"/></div> </div>');
    screen_info.scroller.append('<div class="slide_" style="width: '+width+'px !important;"> <div style="width: 90%; height: 90%;"><img style="display: block; " width="85%"  src="img/Tribus/3.png"/></div> </div>');
    screen_info.scroller.append('<div class="slide_" style="width: '+width+'px !important;"> <div style="width: 90%; height: 90%;"><img style="display: block;" width="85%"  src="img/Tribus/4.png"/></div> </div>');
    screen_info.scroller.append('<div class="slide_" style="width: '+width+'px !important;"> <div style="width: 90%; height: 90%;"><img style="display: block;" width="85%"  src="img/Tribus/5.png"/></div> </div>');
    
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

// END Screen Info
//-----------------------------------------------------------------------
//22. Modal
//OMITIR ESTA SECCION. MODAL ESTA EN SCREEN TIMELINE
	//Variables
	//Funciones
// END Modal
//-----------------------------------------------------------------------
//23. Controller
	//Variables
var cur_screen = "#screen_timeline";
var timeOffset = 0;
var recordatorio = 0;
var screen_to_hide = [];
var scroll_suscripcion = false;

var internet_checked = false;


	//Funciones


function show_screen(screen){
	var misma = false;
	if(cur_screen==screen) {
    	misma = true;
    }else{
    	if(cur_screen == '#screen_trivia'){
            
            if(puntos_sesion>0 && show_points == true) {
            	navigator.notification.alert('¡Has acumulado '+puntos_sesion+' puntos en trivias! Sigue jugando para demostrar tu conocimiento sobre la biblia.', null, 'Voz de Dios','Ok');
            }
            puntos_sesion = 0;
            show_points = true;
            add_points('equis');
        }
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
    		offset = 0;
        	get_feeds();
        	
        }
    }else if(screen=="#screen_promos"){
    	$("#b3").addClass("selected");
    	if(misma) get_promos();
    }else if(screen=="#screen_perfil"){
    	console.log("entro screen perfil");
    	get_perfil(user_data.ID);
    	$("#b9").addClass("selected");
    	
    }
    
}

function on_load(img){
	var i = $(img);
    i.attr('style','opacity: 1;');
    i.parent().parent().css('background-image','none');
}

function swipedetect(el, callback){
  
    var touchsurface = el,
    swipedir,
    startX,
    startY,
    distX,
    distY,
    threshold = 150, //required min distance traveled to be considered swipe
    restraint = 100, // maximum distance allowed at the same time in perpendicular direction
    allowedTime = 300, // maximum time allowed to travel that distance
    elapsedTime,
    startTime,
    handleswipe = callback || function(swipedir){}
  
    touchsurface.addEventListener('touchstart', function(e){
        var touchobj = e.changedTouches[0];
        swipedir = 'none';
        dist = 0;
        startX = touchobj.pageX;
        startY = touchobj.pageY;
        startTime = new Date().getTime(); // record time when finger first makes contact with surface
        //e.preventDefault();
    }, false)
  
    touchsurface.addEventListener('touchmove', function(e){
        //e.preventDefault(); // prevent scrolling when inside DIV
    }, false)
  
    touchsurface.addEventListener('touchend', function(e){
        var touchobj = e.changedTouches[0]
        distX = touchobj.pageX - startX // get horizontal dist traveled by finger while in contact with surface
        distY = touchobj.pageY - startY // get vertical dist traveled by finger while in contact with surface
        elapsedTime = new Date().getTime() - startTime // get time elapsed
        if (elapsedTime <= allowedTime){ // first condition for awipe met
            if (Math.abs(distX) >= threshold && Math.abs(distY) <= restraint){ // 2nd condition for horizontal swipe met
                swipedir = (distX < 0)? 'left' : 'right' // if dist traveled is negative, it indicates left swipe
            }else{
            	swipedir = 'none';
            }
            /*
            else if (Math.abs(distY) >= threshold && Math.abs(distX) <= restraint){ // 2nd condition for vertical swipe met
                swipedir = (distY < 0)? 'up' : 'down' // if dist traveled is negative, it indicates up swipe
            }
        	*/
        }
        handleswipe(swipedir);
        e.preventDefault();
    }, false)
}

var sus_data = null;
function send_suscription(){
	if($("#send_suscription").hasClass('loading')) return false;
    
    var tel = $("#tel").val();
    var operador = $("#operador").val();
    
	$("#send_suscription").addClass("loading");
	$.ajax({
    	url: urlws,
        dataType: 'text',
        type: 'post',
        data: {
        	action: 'send_suscription',
            app: 'La voz de Dios',
            user_login: user_login,
            user_pass: user_pass,
            operador: operador,
            tel: tel,
            timeOffset: timeOffset
        },
        success: function(a,b,c){
        	console.log(a);
            if(a!="") user_data.data.premium = a;
            else{
           		user_data.data.premium = null;
            	delete user_data.data.premium;
            }
        },
        error: function(a,b,c){
        	console.log(b+' '+c);
            user_data.data.premium = null;
            delete user_data.data.premium;
        },
        complete: function(a,b,c){
        	console.log(a);
            if(user_data.data.premium != undefined){
           		navigator.notification.alert("Ahora participas automáticamente de todas nuestras promociones, acumulas dobles puntos en trivias acertadas, puedes compartir peticiones de oración y adicionalmente, cada semana recibirás vía mensaje de texto un acceso para descargar música cristiana e inspiradoras imágenes de fe.",
                function(){
                	show_perfil(true,user_data.ID);
                    show_info('premium');
                    get_feeds();
                }, '¡Felicidades ya eres Miembro Premier!','ok');
            }else{
           		navigator.notification.alert("Ocurrio un imprevisto, intenta de nuevo.", null, 'Voz de Dios','ok');
            }
            $("#send_suscription").removeClass("loading");
        }
    });
}


function send_desuscription(){
	
	$.ajax({
    	url: urlws,
        dataType: 'text',
        type: 'post',
        data: {
        	action: 'send_desuscription',
            app: 'La voz de Dios',
            user_login: user_login,
            user_pass: user_pass,			            
            timeOffset: timeOffset
        },
        success: function(a,b,c){        	
            if(a=="ok"){
           		user_data.data.premium = null;
            	delete user_data.data.premium;
            }
        },
        error: function(a,b,c){
        	console.log(b+' '+c);			            
        },
        complete: function(a,b,c){
        	console.log(a);
            if(user_data.data.premium == undefined){
           		navigator.notification.alert("Tu suscripcion ha sido cancelada", show_perfil(true,user_data.ID), 'Voz de Dios','ok');
            }else{
           		navigator.notification.alert("Ocurrio un imprevisto, intenta de nuevo.", null, 'Voz de Dios','ok');
            }
            $("#send_desuscription").removeClass("loading");
        }
    });
              		
}
var ajax_add_points = null;
function add_points(op){
	console.log(op);
	if(ajax_add_points!=null){return false;}
	ajax_add_points = $.ajax({
        url: urlws,
        dataType: 'html',
        type: 'post',
        data: {
            action: 'add_points',
            op: op,
            user_login: user_login,
            user_pass: user_pass,
            app: 'La voz de Dios',
            pais: pais,
            timeOffset: timeOffset
        },
        success: function(a,b,c){
        },
        error: function(a,b,c){
            console.log(b+' '+c);
        },
        complete: function(a,b,c){
        	ajax_add_points = null;
        	
        }
    });

}

function invite(){
	var url = 'http://vozdedios.mobi/descarga.html';
    window.plugins.socialsharing.share('Hola, te invito a descargar el APP VOZ DE DIOS para alimentar y fortalecer nuestra fe. '+url,null,null,null,function(){ add_points('invite'); console.log('no lo bajo');});
}


function recordatorio_fn(){
	
	
	console.log('recordatorio');
    checkInternet();
    var loggedin = window.localStorage.getItem("user_login");
    if(user_data==null || user_data==undefined || user_data=={}) return false;
    var re = window.localStorage.getItem("recordatorio");
    console.log("recordatorio re: "+re);
    if(re==null){
    	console.log("entro null recordatorio");
        if(internet==true && loggedin!='' && loggedin!=null){
        	console.log('entro timeout recordatorio null');
    		var timeout_recordatorio = setTimeout(show_recordatorio,120000);
    		var re2 = new Date();
            re2.setDate(re2.getDate()+1);
            window.localStorage.setItem("recordatorio",re2.getTime());
    	}
    }else{
    	console.log('entro else recordatorio');
    	if(internet==true && loggedin!='' && loggedin!=null){
    		console.log('entro true else recordatorio');
	        var now = new Date().getTime();
	        var diff = (now-re)/(1000*60*60*24);
	        if(diff >= 1){
	            //show_recordatorio();
	        	console.log('entro timeout recordatorio else');
	        	var timeout_recordatorio = setTimeout(show_recordatorio,120000);
	        	var re2 = new Date();
	            re2.setDate(re2.getDate()+1);
	            window.localStorage.setItem("recordatorio",re2.getTime());
	        }else{
	        	console.log('no entro timeout')
	        }
    	}
    }
    if(internet==true){
    onResume();
    }
}
function show_recordatorio(){		
	navigator.notification.confirm(
        '¿Te gustaría compartir ahora VOZ DE DIOS con algún amigo? Gana 3 puntos por cada invitación realizada',
        function onConfirm(buttonIndex) {
            if(buttonIndex==1){
            	window.plugins.flurry.logEventWithParameters('Invitar Amigos',{estado:user_estado,desde:'Recordatorio'},function(){},function(){});
                
                invite();
            }
            
        },
        'Voz de Dios',
        ['Sí, vamos','Cancelar']
    );
}
var ajax_resume = null;
function onResume() {
	
	if(user_login!='' && user_pass !=''){
		if(ajax_resume==null){
			ajax_resume = $.ajax({
	            url: urlws,
	            dataType: 'html',
	            type: 'post',
	            data: {
	                action: 'last_activity',
	                user_login: user_login,
	                user_pass: user_pass,
	                app: 'La voz de Dios'
	            },
	            success: function(a,b,c){
	                console.log("last activity: "+a);
	                if(a=='1'){
	                	//window.localStorage.setItem('estado','premium');
	                	user_estado = 'premium';
	                }else{
	                	//window.localStorage.setItem('estado','freemium');
	                	user_estado = 'freemium';
	                }
	            },
	            error: function(a,b,c){
	                console.log(b+' '+c);
	            },
	            complete: function(a,b,c){
	            	ajax_resume = null;
	            }
	        });
		}
	}
	
}


function backbutton(){
	if(screen_to_hide.length > 0){		
		screen_to_hide.pop().hide();
		SoftKeyboard.hide();
		return false;
	}else{
		navigator.app.exitApp();
	}	
	console.log(screen_login[0].outerHTML);	
	if(screen_login.hasClass('lefted')) {
		cordova.exec(function() {}, function(){}, 'Home', 'goHome', []);
		return false; 		
	}
	navigator.app.exitApp();
	return false;
}

function checkInternet(){
	/*
	var networkState = navigator.connection.type;
	console.log("networkstate "+JSON.stringify(networkState));
    if(networkState==Connection.UNKNOWN || networkState==Connection.NONE){
    	navigator.notification.alert('Necesitas acceso a internet para el uso del app',null,'La Voz Dios','Ok');
    	internet_checked=true;
    }*/
	var networkState = navigator.connection.type;
    if(networkState==Connection.UNKNOWN || networkState==Connection.NONE){
    	
    	internet=false;
    }
}
var internet = true;
function goesOffline(){
	internet = false;
	if(internet_checked==false){
		navigator.notification.alert('Necesitas acceso a internet para el uso del app',null,'Voz Dios','Ok');
		internet_checked=true;
	}
}

function goesOnline(){
	internet = true;
	internet_checked = false;
}

function deviceready() {
	
    window.plugins.flurry.startSession('ZKVFRRDKW29K4TF63BFP', function () {
                    console.log('Flurry Success!');
                    window.plugins.flurry.setSessionReportsOnCloseEnabled(true); // iOS only
                    window.plugins.flurry.setSessionReportsOnPauseEnabled(true); // iOS only
                }, function () {
                    console.log('Flurry Error!');
                });
	var d = new Date()
	var n = d.getTimezoneOffset()/60;
	timeOffset = parseInt(n*-1);
    console.log(timeOffset);

	window.onerror = function(message, url, lineNumber) {
        console.log("Error: "+message+" in "+url+" at line "+lineNumber);
    }
	document.addEventListener("pause", onPause, false);
    document.addEventListener("offline", goesOffline, false);
    document.addEventListener("online", goesOnline, false);
    document.addEventListener('resume', recordatorio_fn, false);
    document.addEventListener('backbutton', backbutton, false);    
    document.addEventListener('showkeyboard',function(){
    	if(!screen_perfil.hasClass('hidden')){
    		console.log('showkeyboard');
    		screen_perfil.wrapper.scrollTo('#tel');
    	}
    	});
    FastClick.attach(document.body);
    pushNotification = window.plugins.pushNotification;
    setPushes();   
    agregar_options();
    
}
$.fn.scrollTo = function( target, options, callback ){
	  if(typeof options == 'function' && arguments.length == 2){ callback = options; options = target; }
	  var settings = $.extend({
	    scrollTarget  : target,
	    offsetTop     : 50,
	    duration      : 500,
	    easing        : 'swing'
	  }, options);
	  return this.each(function(){
	    var scrollPane = $(this);
	    var scrollTarget = (typeof settings.scrollTarget == "number") ? settings.scrollTarget : $(settings.scrollTarget);
	    var scrollY = (typeof scrollTarget == "number") ? scrollTarget : scrollTarget.offset().top + scrollPane.scrollTop() - parseInt(settings.offsetTop);
	    scrollPane.animate({scrollTop : scrollY }, parseInt(settings.duration), settings.easing, function(){
	      if (typeof callback == 'function') { callback.call(this); }
	    });
	  });
	}
document.addEventListener('deviceready', deviceready, false);

//END Controller
//-----------------------------------------------------------------------

// Datepicker

	//Variables
var date_nacimiento = new Date();
var options = {
	    date: date_nacimiento,
	    mode: 'date',
	    maxdate: new Date()
	};
	//Funciones


	function onSuccessDate(date) {
		date_nacimiento = date;
		
	    //alert('Selected date: ' + date);
		$('#datePicker').val(date.getDate()+'/'+(date.getMonth()+1)+'/'+date.getFullYear());
	}

	function onErrorDate(error) { // Android only
	    console.log("error datepicker");
	}

	//datePicker.show(options, onSuccessDate, onErrorDate);
//END Datepicker
