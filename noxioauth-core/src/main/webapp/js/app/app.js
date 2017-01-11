"use strict";

/*  @FIXME @TODO
    There is a lot of jank here. 
    This should be refactored entirely to create new objects of each part
    instaed of creating them as pseudo classes like I'm doing here.
    This kind of design will lead to weird problems and is a bad idea.
 */

var main = {};

main.init = function() {
  menu.init();
  net.auth.establish(); /* Check server status and open a connection with NoxioAuth */
};

//Starts the engine
main.init();
