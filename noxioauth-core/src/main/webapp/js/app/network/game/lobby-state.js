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
  main.menu.connect.show(packet.message);
  setTimeout(function() { main.menu.lobby.show(); }, 2000); /* @FIXME Timeout used to show info before returning to main screen. */
};

LobbyState.prototype.joinLobby = function(lid) {
  this.send({type: "b04", lid: lid});
  main.menu.connect.show("Joining game lobby...");
};

LobbyState.prototype.createLobby = function(name) {
  this.send({type: "b03", name: name});
  main.menu.connect.show("Creating game lobby...");
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