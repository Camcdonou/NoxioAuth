"use strict";
/* global main */
/* global WebSocket */

/* Define Auth Class */
function Auth () {
  
};

Auth.prototype.establish = function() {
  /* List of addresses to attempt to connect on. 
     Try current domain first then a list of backup addresses for testing & etc...
  */
  var addresses = [
    window.location.host,
    "infernoplus.com",
    "localhost:7001",
    "68.32.112.73:7001",
    "10.0.0.253:7001"
  ];
  
  var getStatus = function(r) {
    if(r>=addresses.length) {
      main.menu.connect.show("Failed to retrieve server status", 1);
      return;
    }
    main.menu.connect.show("Checking server status @" + addresses[r], 0);
    $.ajax({
      url: "http://" + addresses[r] + "/noxioauth/status",
      type: 'GET',
      timeout: 3000,
      success: function() { main.net.auth.connect(addresses[r]); },
      error: function() { getStatus(++r); }
    });
  };
  
  getStatus(0);
};

Auth.prototype.isConnected = function () {
  return this.webSocket !== undefined && this.webSocket.readyState !== WebSocket.CLOSED;
};

Auth.prototype.connect = function(address){
  if(this.isConnected()) {
    main.menu.error.showError("Connection Error", "Attempting to open multiple connections.");
    main.close();
    return;
  }

  this.webSocket = new WebSocket("ws://" + address + "/noxioauth/auth");
  main.menu.connect.show("Connecting @" + address, 0);

  this.webSocket.onopen = function(event){
    if(event.type !== "open") {
      main.menu.error.showError("Connection Error", "ws openEvent.type mismatch!");
      main.close();
      return;
    }
  };

  this.webSocket.onmessage = function(event){
    main.net.auth.handlePacket(JSON.parse(event.data));
  };

  this.webSocket.onclose = function(event){
    main.close();
    main.net.auth.webSocket = undefined;
  };
};

Auth.prototype.handlePacket = function(packet) {  
  /* Allow state to handle packet. If state returns false then packet was not handled and forward it to general handling. */
  if(this.state !== undefined) {
    if(this.state.handlePacket(packet)) {
      return;
    }
  }
  switch(packet.type) {
    case "s00" : { this.setState(packet.state); break; }
    case "s01" : { this.login(packet); break; }
    case "s02" : { break; } /* Keep alive packet */
    case "s04" : { main.stats = packet.stats; main.menu.credit.update(); break; } /* User Stats Update */
    case "s05" : { main.unlocks.load(packet.unlocks); break; } /* User Unlocks Update */
    case "x00" : { main.menu.error.showError("Connection Error", packet.message); main.close(); break; }
    case "x01" : { main.menu.error.showErrorException("Server Exception", packet.message, packet.trace); main.close(); break; }
    default : { main.menu.error.showErrorException("Connection Error", "Recieved invalid packet type: " + packet.type, JSON.stringify(packet)); main.close(); break; }
  }
};

/*  State Ids
    - a = auth
    - o = online
 */
Auth.prototype.setState = function(state) {
  if(this.state !== undefined) { this.state.destroy(); }
  switch(state) {
    case "a" : { this.state = new AuthState(); break; }
    case "o" : { this.state = new OnlineState(); break; }
    default : { main.menu.error.showError("Connection Error", "Received invalid state ID: " + state); main.close(); return; }
  }
  this.state.ready();
};

Auth.prototype.login = function(packet) {
  main.net.user = packet.user;
  main.net.sid = packet.sid;
  main.settings.load(packet.settings);
  main.stats = packet.stats; main.menu.credit.update();
  main.unlocks.load(packet.unlocks);
};

Auth.prototype.send = function(packet){
  this.webSocket.send(JSON.stringify(packet));
};

/* This should never be called directly, only network.js should call this. Use main.close() instead. */
Auth.prototype.close = function(){
  if(this.webSocket !== undefined) {
    this.webSocket.close();
  }
};