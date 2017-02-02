"use strict";
/* global main */
/* global WebSocket */

/* Define Auth Class */
function Auth () {
  
};

Auth.prototype.establish = function() {
  /* List of addresses to attempt to connect on. 
     This is due to an oddity with Comcast where I cannot use an external IP from a local system.
     This code should be removed in production!
     @FIXME
  */
  var addresses = [
    "68.34.229.231",
    "localhost",
    "10.0.0.6"
  ];
  
  var getStatus = function(r) {
    if(r>=addresses.length) {
      main.menu.connect.show("Failed to retrieve server status...");
      return;
    }
    main.menu.connect.show("Checking server status @" + addresses[r] + "...");
    $.ajax({
      url: "http://" + addresses[r] + ":7001/noxioauth/status",
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

  this.webSocket = new WebSocket("ws://" + address + ":7001/noxioauth/auth");
  main.menu.connect.show("Connecting @" + address + "...");

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