"use strict";
/* global main */

function LobbyState() {
  
};

LobbyState.prototype.handlePacket = function(packet) {
  switch(packet.type) {
    case "b01" : { main.menu.lobby.list.displayList(packet.lobbies); return true; }
    case "b05" : { this.joinLobbyError(packet); return true; }
    default : { return false; }
  }
};

LobbyState.prototype.joinLobbyError = function(packet) {
  main.menu.warning.show(packet.message);
  main.menu.lobby.show();
};

LobbyState.prototype.joinLobby = function(lid) {
  this.send({type: "b04", lid: lid});
  main.menu.connect.show("Joining game lobby", 0);
};

LobbyState.prototype.createLobby = function(settings) {
  this.send({type: "b03", settings: "lobby: " + JSON.stringify(settings)});
  main.menu.connect.show("Creating game lobby", 0);
};

LobbyState.prototype.ready = function() {
  main.menu.lobby.show();
};

LobbyState.prototype.refreshLobbyList = function() {
  this.send({type: "b00"});
};

LobbyState.prototype.send = function(data) {
  main.net.game.send(data);
};

LobbyState.prototype.type = function() {
  return "b";
};

LobbyState.prototype.destroy = function() {
  
};