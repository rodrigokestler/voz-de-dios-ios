var screen_zoom = null;
function show_zoom(img){
	var html = '<screen id="screen_zoom" class="no_normal">'+
                    '<wrapper id="img_zoom_wrapper"><div id="img_zoom_scroller"><img width="100%" src="'+img+'"/></div></wrapper>'+
                    '<button class="close_window" onclick="hide_zoom()">x</button>'+
                '</screen>';
	screen_zoom = jQuery(html);
    
    jQuery('body').append(screen_zoom);
    
    screen_zoom.zoom = new IScroll('#img_zoom_wrapper', {
		zoom: true,
		scrollX: true,
		scrollY: true,
		mouseWheel: true,
		wheelAction: 'zoom'
	});
}

function hide_zoom(){
	screen_zoom.zoom.destroy();
	screen_zoom.remove();
    screen_zoom = null;
}