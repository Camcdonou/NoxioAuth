"use strict";
/* global main */

/*  @FIXME @TODO
    There is a lot of jank here. 
    This should be refactored entirely to create new objects of each part
    instaed of creating them as pseudo classes like I'm doing here.
    This kind of design will lead to weird problems and is a bad idea.
 */

/* Define Main Class */
function Main () {
  this.menu = new Menu();
  this.net = new Network();
};

/* We can't start the engine during the constructino of new Main() so we do it here instead. */
Main.prototype.init = function() {
  this.net.auth.establish();
};

/* Starts the Engine */
var main = new Main();
main.init();
