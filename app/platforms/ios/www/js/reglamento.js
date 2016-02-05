var screen_reglamento = $("#screen_reglamento");
screen_reglamento.show = function(){focus_trivia = false; screen_reglamento.removeClass('downed');};
screen_reglamento.hide = function(){focus_trivia = true;  screen_reglamento.addClass('downed');};