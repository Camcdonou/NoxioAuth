"use strict";
/* global main */

function GameState() {
  this.info = {};
};

GameState.prototype.handlePacket = function(packet) {
  switch(packet.type) {
    /* Session Type Packets g0x */
    case "g01" : { this.gameInfo(packet); return true; }
    case "g06" : { this.transveralError(packet); return true; }
    case "g08" : { this.leftGame(packet); return true; }
    case "g11" : { this.joinGameSuccess(packet); return true; }
    case "g17" : { this.newGame(packet); return true; }
    default : { return main.inGame() ? this.gameData(packet) : false; }
  }
};

GameState.prototype.newGame = function(packet) {
  this.info.name = packet.name;
  
  var settings = {
    name: packet.name,
    gametype: packet.gametype,
    maxplayers: packet.maxPlayers,
    scoreToWin: packet.scoreToWin,
    teams: packet.teams,
    objective: packet.objective
  };
  
  main.menu.connect.show("Loading...");
  main.endGame();
  main.startGame(packet.name, settings, packet.map);
  main.menu.game.show();
  this.send({type: "g07"});
};

GameState.prototype.gameData = function(packet) {
  return main.game.handlePacket(packet); /* Returns false if failed to parse. */
};

GameState.prototype.transveralError = function(packet) {                // Error message when failing to join/leave a game or whatever!
  main.menu.warning.show(packet.message);
};

GameState.prototype.joinGameSuccess = function(packet) {
  main.game.serverReady = true;
};

GameState.prototype.gameInfo = function(packet) {
  this.info.name = packet.name;
  
  var settings = {
    name: packet.name,
    gametype: packet.gametype,
    maxplayers: packet.maxPlayers,
    scoreToWin: packet.scoreToWin,
    teams: packet.teams,
    objective: packet.objective
  };
  
  main.menu.connect.show("Loading...");
  main.startGame(packet.name, settings, packet.map);
  main.menu.game.show();
  this.send({type: "g07"});
};

GameState.prototype.ready = function() {
  this.send({type: "g00"});
};

GameState.prototype.leaveGame = function() {
  main.menu.connect.show("Leaving game...");
  this.send({type: "g03"});
};

GameState.prototype.leftGame = function(packet) {
  main.endGame();
  this.send({type: "g09"});
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