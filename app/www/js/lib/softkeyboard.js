function SoftKeyboard() {}

SoftKeyboard.show = function(win, fail) {
  return cordova.exec(
      function (args) { if(win) { win(args); } },
      function (args) { if(fail) { fail(args); } },
      "SoftKeyboard", "show", []);
};

SoftKeyboard.hide = function(win, fail) {
  return cordova.exec(
      function (args) { if(win) { win(args); } },
      function (args) { if(fail) { fail(args); } },
      "SoftKeyboard", "hide", []);
};

SoftKeyboard.isShowing = function(win, fail) {
  return cordova.exec(
      function (isShowing) { 
        if(win) { 
          isShowing = isShowing === 'true' ? true : false
          win(isShowing); 
        } 
      },
      function (args) { if(fail) { fail(args); } },
      "SoftKeyboard", "isShowing", []);
};

SoftKeyboard.sendKey = function (keyCode, win, fail) {
  return cordova.exec(
      function (args) { if (win) { win(args); } },
      function (args) { if (fail) { fail(args); } },
      "SoftKeyboard", "sendKey", [ keyCode ]);
};
