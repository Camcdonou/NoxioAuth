"use strict";
/* global main */

function GameState() {
  
};

GameState.prototype.handlePacket = function(packet) {
  switch(packet.type) {
    default : { return false; }
  }
};

GameState.prototype.ready = function() {
  main.menu.game.show();
};

GameState.prototype.send = function(data) {
  main.net.game.send(data);
};

GameState.prototype.type = function() {
  return "g";
};