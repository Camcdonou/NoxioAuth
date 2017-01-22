"use strict";
/* global main */

function GameMenu() {
  this.element = document.getElementById("game");
  
  /* @FIXME for debug */
  this.title = document.getElementById("game-name");
  this.leave = document.getElementById("game-leave");
  this.playerList = document.getElementById("game-players");
};

GameMenu.prototype.leaveGameButton = function() {
  main.net.game.state.leaveGame();
};

GameMenu.prototype.updatePlayerList = function(maxPlayers, players) {
  this.playerList.innerHTML = "Players: " + players.length + "/" + maxPlayers + "<br/>";
  for(var i=0;i<players.length;i++) {
    this.playerList.innerHTML += players[i] + "<br/>";
  }
};

GameMenu.prototype.show = function() {
  main.menu.hideAll();
  this.title.innerHTML = main.net.user + "@" + main.net.game.info.name + "@" + main.net.game.state.info.name;
  this.element.style.display = "block";
};

GameMenu.prototype.hide = function() {
  this.element.style.display = "none";
};