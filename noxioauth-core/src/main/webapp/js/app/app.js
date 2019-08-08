"use strict";
/* global main */

/* Define Main Class */
function Main () {
  this.menu = new Menu();                // Handles HTML menus, does NOT handle ingame OpenGL menus.
  this.net = new Network();              // Manages websocket connections with server.
  this.settings = new Settings();        // Contains settings like rebindable controls, graphics quality, and sound volume.
  this.stats = undefined;                // Contains read only user account data like credits, total wins, and rank
  this.unlocks = new Unlocks();          // Contains read only user account data pertaining to unlockable content/features
  this.gauss = new Gauss();              // Animated background handler 
};

/* We can't start the engine during the construction of new Main() so we do it here instead. */
Main.prototype.init = function() {
  this.gauss.init();
  this.gauss.show();
  this.menu.init();
  this.gauss.status();
};

Main.prototype.setStats = function(stats) {
  this.stats = stats;
  this.menu.credit.update();
  this.menu.rank.update();
};

Main.prototype.startGame = function(name, settings, map) {
  if(!this.inGame() && main.net.game.address) {
    this.menu.connect.show("Downloading map file...", 0);
    $.ajax({
      url: "http://" + main.net.game.address + ":" + main.net.game.port + "/nxg/map/" + map,
      type: 'GET',
      timeout: 3000,
      success: function(data) {
        main.game = new NoxioGame(name, settings, data);
        main.menu.game.show();
      },
      error: function() {
        main.menu.error.showError("Map Error", "Server returned FNF(404) for map: " + map);
      }
    });
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
  this.menu.connect.show("Connection closed", 1);
};

/* Starts the Engine */
var main = new Main();
main.init();

/* Disconnect and reset page */
function reset(delay) {
  if(delay) { setTimeout(function() { reset(); }, delay); return; }
  
  main.close();
  location.reload();
};
