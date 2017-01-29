"use strict";
/* global main */

function GameState() {
  this.info = {};
};

GameState.prototype.handlePacket = function(packet) {
  switch(packet.type) {
    /* Session Type Packets g0x */
    case "g01" : { this.gameInfo(packet); return true; }
    case "g04" : { this.playerList(packet); return true; }
    case "g06" : { this.joinGameError(packet); return true; }
    case "g15" : { this.gameMessages(packet); return true; } /* @FIXME bad packet handling on this oen */
    default : { return this.gameData(packet); }
  }
};

GameState.prototype.gameMessages = function(packet) {
  main.menu.game.updateMessages(packet.message);
};

GameState.prototype.gameData = function(packet) {
  return main.game.update(packet); /* Returns false if failed to parse. */
};

GameState.prototype.joinGameError = function(packet) {
  main.menu.connect.show(packet.message);
};

GameState.prototype.gameInfo = function(packet) {
  this.info.name = packet.name;
  this.info.maxPlayers = packet.maxPlayers;
  main.startGame();
  main.menu.game.show();
};

GameState.prototype.playerList = function(packet) {
  //main.menu.game.updatePlayerList(this.info.maxPlayers, packet.players);
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

GameState.prototype.destroy = function() {
  main.endGame();
};