"use strict";
/* global main */

function GameState() {
  this.info = {};
};
var DELTA_TIME_TEST = new Date().getTime();
GameState.prototype.handlePacket = function(packet) {
  if(packet.type === "g10") {
    var now = new Date().getTime();
    console.log(now-DELTA_TIME_TEST + " :: " + TIME_TEST_COUNT + " :: " + packet.data.length*2 + " bytes");
    TIME_TEST_COUNT = 0;
    DELTA_TIME_TEST = now;
  }
  switch(packet.type) {
    /* Session Type Packets g0x */
    case "g01" : { this.gameInfo(packet); return true; }
    case "g06" : { this.joinGameError(packet); return true; }
    case "g08" : { this.leftGame(packet); return true; }
    case "g17" : { this.newGame(packet); return true; }
    default : { return main.inGame() ? this.gameData(packet) : false; }
  }
};

GameState.prototype.newGame = function(packet) {
  main.menu.connect.show("Loading...");
  main.endGame();
  main.startGame(packet.name, "STUB", "STUB", packet.maxPlayer, packet.map);
  main.menu.game.show();
  this.send({type: "g07"});
};

GameState.prototype.gameData = function(packet) {
  return main.game.handlePacket(packet); /* Returns false if failed to parse. */
};

GameState.prototype.joinGameError = function(packet) {
  main.menu.warning.show(packet.message);
  main.endGame();
};

GameState.prototype.gameInfo = function(packet) {
  this.info.name = packet.name;
  this.info.maxPlayers = packet.maxPlayers;
  main.menu.connect.show("Loading...");
  main.startGame(packet.name, "STUB", "STUB", packet.maxPlayer, packet.map);
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

GameState.prototype.leftGame = function() {
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