var ajax_falla = false;
var callback = function(){};
$("#enviar_falla").click(function(e){
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
                                navigator.notification.alert("Gracias! Tu mensaje ha sido enviado.",callback,'La Voz de Dios','Aceptar');
                                $('#textarea_form_falla').val('');
                                $('input[name="falla"]:checked', '#form_falla').prop('checked', false);
                                },
                                error: function(a,b,c){
                                console.log(b+' '+c);
                                navigator.notification.alert("Ha ocurrido un error. Por favor intenta de nuevo, es importante para nosotros.",callback,'La Voz de Dios','Aceptar');
                                },
                                complete: function(a,b,c){
                                ajax_falla = false;
                                jQuery(".publish").removeClass('loading');
                                $('#textarea_form_falla').val('');
                                }
                                });
                         }
                         e.preventDefault();
                         
                         });
var ajax_sugerencia = false;
$("#enviar_sugerencia").click(function(e){
                              
                              if(!ajax_sugerencia){
                              ajax_sugerencia = true;
                              var sugerencia =$('#textarea_form_sugerencia').val();
                              jQuery(".publish").addClass('loading');
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
                                     navigator.notification.alert("Gracias! Tu mensaje ha sido enviado.",callback,'La Voz de Dios','Aceptar');
                                     $('#textarea_form_sugerencia').val('');
                                     },
                                     error: function(a,b,c){
                                     console.log(b+' '+c);
                                     navigator.notification.alert("Ha ocurrido un error. Por favor intenta de nuevo, es importante para nosotros.",callback,'La Voz de Dios','Aceptar');
                                     },
                                     complete: function(a,b,c){
                                     ajax_sugerencia = false;
                                     jQuery(".publish").removeClass('loading');
                                     
                                     }
                                     });
                              }
                              e.preventDefault();
                              });