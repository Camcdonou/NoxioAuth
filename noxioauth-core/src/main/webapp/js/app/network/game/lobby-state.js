"use strict";
/* global main */

function LobbyState() {
  
};

LobbyState.prototype.handlePacket = function(packet) {
  switch(packet.type) {
    default : { return false; }
  }
};

LobbyState.prototype.ready = function() {
  this.send({type: "b00"});
  main.menu.lobby.show();
};

LobbyState.prototype.send = function(data) {
  main.net.game.send(data);
};

LobbyState.prototype.type = function() {
  return "b";
};