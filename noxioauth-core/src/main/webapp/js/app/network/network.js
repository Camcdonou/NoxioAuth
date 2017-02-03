"use strict";
/* global main */

/* Define Network Class */
function Network () {
  this.auth = new Auth();
  this.game = new Game();
  
  this.user = "Not Logged In";
  this.sid = undefined;
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

Network.prototype.close = function() {
  this.auth.close();
  this.game.close();
};