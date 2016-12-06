var screen_write = $("#screen_write");
screen_write.wrapper = screen_write.find('wrapper');
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
    
    if(content==""){
    	return false;
    }
    
    jQuery(".publish").addClass('loading');
    
    if(jQuery('.attach').length > 0){ //cuando hay archivo
        var url = urlws;
        var options = new FileUploadOptions();
        var params = {};
        var IMG_URI = $('.attach').attr('src');
        var id = $('.attach').attr('id');
        
        if(id == "video_user") {
            options.mimeType = 'video/quicktime';
            params.image_user = "false";
            params.video_user = "true";
        }else{
            options.mimeType = 'image/jpeg';
            params.image_user = "true";
            params.video_user = "false";
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
        if(oracion_idx!= "" && motivo_idx != ""){ params.plegaria = "1";}
        else{ params.plegaria = "0";}
    
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
            	jQuery(".publish").removeClass('loading');
                screen_write.hide();
                offset = 0;
                get_feeds();
            },
            function(error) {
            	jQuery(".publish").removeClass('loading');
                navigator.notification.alert('Ocurio un imprevisto, intente de nuevo.',null,'Voz de Dios','ok');
            }, options
        );
    }else{
    	var plegaria = "0";
    	if(oracion_idx!= "" && motivo_idx != "") plegaria = "1";
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
                
                screen_write.wrapper.find('textarea').val('');
                screen_write.wrapper.find('input').val('');
                
                if(plegaria=='0' && user_estado == 'freemium'){
                
                	navigator.notification.confirm(
                            'Conviértete en Miembro Premier para acumular puntos por cada like que obtengas en tus publicaciones',
                            function onConfirm(buttonIndex) {
                            	if(buttonIndex==1){
                            		
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

/*parte premium*//*parte premium*//*parte premium*/
/*parte premium*//*parte premium*//*parte premium*/

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

jQuery('#motivador').change(function(){
	
    //if(user_data.data.premium == undefined){
	if(user_estado == 'freemium'){
        navigator.notification.confirm(
            'Debes ser MIEMBRO PREMIER para poder compartir peticiones de oración, ¿Deseas suscribirte?',
            function onConfirm(buttonIndex) {
            	if(buttonIndex==1){
            		
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