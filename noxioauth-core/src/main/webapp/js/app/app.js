"use strict";
/* global main */

/* Define Main Class */
function Main () {
  this.menu = new Menu();                // Handles HTML menus, does NOT handle ingame OpenGL menus.
  this.net = new Network();              // Manages websocket connections with server.
  this.settings = new Settings();        // Contains settings like rebindable controls, graphics quality, and sound volume.
  this.gauss = new Gauss();
};

/* We can't start the engine during the construction of new Main() so we do it here instead. */
Main.prototype.init = function() {
  this.gauss.init();
  this.gauss.show();
  this.net.auth.establish();
};

Main.prototype.startGame = function(name, settings, map) {
  if(!this.inGame()) {
    this.game = new NoxioGame(name, settings, map);
    this.menu.game.show();
  }
  else { this.menu.error.showError("State Error", "Attempted to start a game while a game was running."); this.close(); }
};

Main.prototype.inGame = function() {
  return this.game !== undefined;
};

Main.prototype.endGame = function() {
  if(this.inGame()) {
    this.game.destroy();
    this.game = undefined;
    this.gauss.show();
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
