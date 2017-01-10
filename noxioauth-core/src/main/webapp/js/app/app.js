"use strict";

var main = {};

main.init = function() {
  menu.init();
  net.auth.establish(); /* Check server status and open a connection with NoxioAuth */
};

//Starts the engine
main.init();
