"use strict";
/* global main */

/* Define Main Class */
function Main () {
  this.menu = new Menu();
  this.net = new Network();
};

/* We can't start the engine during the constructino of new Main() so we do it here instead. */
Main.prototype.init = function() {
  this.net.auth.establish();
};

Main.prototype.startGame = function() {
  this.game = new NoxioGame();
};

Main.prototype.inGame = function() {
  return this.game !== undefined;
};

Main.prototype.endGame = function() {
  if(this.inGame()) {
    this.game.destroy();
    this.game = undefined;
  }
};

/* Close connections and stop page */
Main.prototype.close = function() {
  this.net.close();
  this.endGame();
  this.menu.connect.show("Connection closed.");
};

/* Starts the Engine */
var main = new Main();
main.init();

/* Disconnect and reset page */
function reset() {
  main.close();
  main = new Main();
  main.init();
};
