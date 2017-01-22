"use strict";
/* global main */

function GameState() {
  this.info = {};
};

GameState.prototype.handlePacket = function(packet) {
  switch(packet.type) {
    case "g01" : { this.gameInfo(packet); return true; }
    case "g04" : { this.playerList(packet); return true; }
    case "g05" : { return true; } //@FIXME DEBUG TICK RATE
    case "g06" : { this.joinGameError(packet); return true; }
    default : { return false; }
  }
};

GameState.prototype.joinGameError = function(packet) {
  main.menu.connect.show(packet.message);
};

GameState.prototype.gameInfo = function(packet) {
  this.info.name = packet.name;
  this.info.maxPlayers = packet.maxPlayers;
  main.menu.game.show();
};

GameState.prototype.playerList = function(packet) {
  main.menu.game.updatePlayerList(this.info.maxPlayers, packet.players);
};

GameState.prototype.ready = function() {
  this.send({type: "g00"});
};

GameState.prototype.leaveGame = function() {
  this.send({type: "g03"});
};

GameState.prototype.send = function(data) {
  main.net.game.send(data);
};

GameState.prototype.type = function() {
  return "g";
};