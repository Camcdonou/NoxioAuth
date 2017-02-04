"use strict";
/* global main */

function GameMenu() {
  this.element = document.getElementById("game");
  
  /* @FIXME for debug */
  this.title = document.getElementById("game-name");
  this.leave = document.getElementById("game-leave");
  this.log = document.getElementById("game-messages");
  
  this.messages = [];
};

GameMenu.prototype.leaveGameButton = function() {
  main.net.game.state.leaveGame();
};

GameMenu.prototype.updateMessages = function(message) {
  var max = 6;
  
  this.log.innerHTML = "";
  this.messages.push(message);
  if(this.messages.length > max) { this.messages.splice(0,1); }
  for(var i=0;i<this.messages.length;i++) {
    this.log.innerHTML += this.messages[i] + "</br>";
  }
};

GameMenu.prototype.show = function() {
  main.menu.hideAll();
  this.title.innerHTML = main.net.user + "@" + main.net.game.state.info.name + "@" + main.net.game.info.name;
  this.messages = [];
  this.log.innerHTML = "";
  this.element.style.display = "block";
};

GameMenu.prototype.hide = function() {
  this.element.style.display = "none";
};