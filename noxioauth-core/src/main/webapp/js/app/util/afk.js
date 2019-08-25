"use strict";
/* global main */
/* global util */

/* Simple util that checks for any input. If there is no input of any kind for more than 5 minutes you are automatically disconnected. */

function AFK() {
  this.onInput();
  
  var tmp = this;
  var ff = function() { tmp.onInput(); return true; };
  
  document.onmousemove = ff;
  document.addEventListener("mousewheel", ff, false); // IE9, Chrome, Safari, Opera
  document.addEventListener("DOMMouseScroll", ff, false); // Firefox
  document.onkeydown = ff;
  document.addEventListener('touchmove', ff, true);
}

AFK.IDLE_KICK_TIME = 420000;   // Kick at 7 minutes
AFK.IDLE_WARN_TIME = 300000;   // Warn at 5 minutes
AFK.IDLE_CHECK_DELAY = 60000;  // Check idle once a minute

AFK.prototype.init = function() {
  this.checkLast();
};

AFK.prototype.onInput = function() {
  this.lastInput = util.time.now();
};

AFK.prototype.checkLast = function() {
  var tmp = main.afk;
  
  var idle = util.time.now() - tmp.lastInput;
  if(!main.net.loggedIn()) { tmp.onInput(); }
  else if(idle >= AFK.IDLE_KICK_TIME) {
    main.menu.warning.show("You are being automatically logged out...");
    reset(3000);
  }
  else if(idle >= AFK.IDLE_WARN_TIME) {
    main.menu.warning.show("You have been AFK for 5 minutes...");
  }
  
  this.timeout = setTimeout(tmp.checkLast, AFK.IDLE_CHECK_DELAY);
};

AFK.prototype.destroy = function() {
  clearTimeout(this.timeout);
};