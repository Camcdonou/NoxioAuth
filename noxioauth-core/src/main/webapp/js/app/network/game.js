"use strict";
/* global main */
/* global WebSocket */

/* Define Game Class */
function Game () {
  this.safe = false;
};

Game.prototype.establish = function(address, port) {
  if(main.net.sid === undefined) {
    main.menu.error.showError("Connection Error", "Client has no Session ID.");
    main.close();
    return;
  }
  
  this.connect(address, port);
};

Game.prototype.isConnected = function () {
  return this.webSocket !== undefined && this.webSocket.readyState !== WebSocket.CLOSED;
};

Game.prototype.connect = function(address, port) {
  if(this.isConnected()) {
    main.menu.error.showError("Connection Error", "Attempting to open multiple connections.");
    main.close();
    return;
  }

  this.webSocket = new WebSocket("ws://" + address + ":" + port + "/noxiogame/game");
  main.menu.connect.show("Connecting @" + address + ":" + port + "...");

  this.webSocket.onopen = function(event){
    if(event.type !== "open") {
      main.menu.error.showError("Connection Error", "ws openEvent.type mismatch!");
      main.close();
      return;
    }
  };

  this.webSocket.onmessage = function(event){
    main.net.game.handlePacket(JSON.parse(event.data));
  };

  this.webSocket.onclose = function(event){
    if(this.safe === false) {
      main.close();
    }
    this.safe = false;
    main.net.game.webSocket = undefined;
  };
};

Game.prototype.handlePacket = function(packet) {
  /* Allow state to handle packet. If state returns false then packet was not handled and forward it to general handling. */
  if(this.state !== undefined) {
    if(this.state.handlePacket(packet)) { return; }
  }
  switch(packet.type) {
    case "s00" : { this.setState(packet.state); break; }
    case "s01" : { this.handleBlob(packet.packets); break; }
    case "x00" : { main.menu.error.showError("Connection Error", packet.message); main.close(); break; }
    case "x01" : { main.menu.error.showErrorException("Server Exception", packet.message, packet.trace); main.close(); break; }
    default : { main.menu.error.showErrorException("Connection Error", "Recieved invalid packet type: " + packet.type, JSON.stringify(packet)); main.close(); break; }
  }
};

/*  State Ids
    - l = login
 */
Game.prototype.setState = function(state) {
  if(this.state !== undefined) { this.state.destroy(); }
  switch(state) {
    case "l" : { this.state = new LoginState(); break; }
    case "b" : { this.state = new LobbyState(); break; }
    case "g" : { this.state = new GameState(); break; }
    default : { main.menu.error.showError("Connection Error", "Received invalid state ID: " + state); main.close(); return; }
  }
  this.state.ready();
};

Game.prototype.handleBlob = function(packets) {
  for(var i=0;i<packets.length;i++) {
    this.handlePacket(packets[i]);
  }
};

Game.prototype.send = function(packet){
  this.webSocket.send(JSON.stringify(packet));
};

/* This should never be called directly, only network.js should call this. Use main.close() instead. */
Game.prototype.close = function(){
  if(this.webSocket !== undefined) {
    this.webSocket.close();
  }
};

/* This should never be called directly, only network.js should call this. Use main.close() instead. */
Game.prototype.safeClose = function(){
  this.safe = true;
  if(this.webSocket !== undefined) {
    this.webSocket.close();
  }
};