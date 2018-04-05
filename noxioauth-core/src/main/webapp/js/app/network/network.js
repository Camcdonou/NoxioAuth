"use strict";
/* global main */

/* Define Network Class */
function Network () {
  this.auth = new Auth();
  this.game = new Game();
  
  this.user = undefined;
  this.sid = undefined;
  this.guest = undefined;
};

/* Opens connection to noxioauth on normal user socket */
Network.prototype.connect = function() {
  if(this.loggedIn()) { main.close(); return; }
  if(this.auth.isConnected()) { this.auth.close(); }
  this.auth.establish("auth");
};

/* Opens connection to noxioauth on guest socket */
Network.prototype.connectGuest = function() {
  if(this.loggedIn()) { main.close(); return; }
  if(this.auth.isConnected()) { this.auth.close(); }
  this.auth.establish("guest");
};

/* Leave the current noxiogame server and return to noxioauth online state */
Network.prototype.leaveServer = function() {
  if(this.game.isConnected() && this.auth.isConnected() && this.game.state.type() === "b" && this.auth.state.type() === "o") {
    this.game.safeClose();
    this.game = new Game();
    main.endGame();
    main.menu.online.show();
  }
  else {
    main.menu.error.showError("State Error", "Client attempted to leave game server but the state was invalid!");
    main.close();
  }
};

Network.prototype.loggedIn = function() {
  return this.user;
};

Network.prototype.close = function() {
  this.auth.close();
  this.game.close();
};