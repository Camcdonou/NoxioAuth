"use strict";
/* global main */

/* Define Main Class */
function Main () {
  this.file = new File();
  this.menu = new Menu();
};

/* We can't start the engine during the construction of new Main() so we do it here instead. */
Main.prototype.init = function() {
  this.menu.file.show();
};

/* Load a parsed map file so we can begin editing. */
Main.prototype.load = function(map) {
  this.menu.editor.show();
  this.editor = new NoxioEditor(map);
};

/* Stops program */
Main.prototype.close = function() {

};

/* Starts the Engine */
var main = new Main();
main.init();
