"use strict";
/* global main */
/* global WebSocket */

/* Define Auth Class */
function Auth () {
  
};

Auth.prototype.establish = function() {
  /* List of adresses to attempt to connect on. 
     This is due to an oddity with Comcast where I cannot use an external IP from a local system.
     This code should be removed in production!
     @FIXME
  */
  var adresses = [
    "68.34.229.231",
    "localhost",
    "10.0.0.6"
  ];
  
  var getStatus = function(r) {
    if(r>=adresses.length) {
      main.menu.connect.show("Failed to retrieve server status...");
      return;
    }
    main.menu.connect.show("Checking server status @" + adresses[r] + "...");
    $.ajax({
      url: "http://" + adresses[r] + ":7001/noxioauth/status",
      type: 'GET',
      timeout: 3000,
      success: function() { main.net.auth.connect(adresses[r]); },
      error: function() { getStatus(++r); }
    });
  };
  
  getStatus(0);
};

Auth.prototype.isConnected = function () {
  return this.webSocket !== undefined && this.webSocket.readyState !== WebSocket.CLOSED;
};

Auth.prototype.connect = function(ws){
  if(this.isConnected()) {
    return;
  }

  this.webSocket = new WebSocket("ws://" + ws + ":7001/noxioauth/auth");
  main.menu.connect.show("Connecting @" + ws + "...");

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
  /* For Debug @FIXME */
  console.log(packet);
  
  /* Allow state to handle packet. If state returns false then packet was not handled and forward it to general handling. */
  if(this.state !== undefined) {
    if(this.state.handlePacket(packet)) {
      return;
    }
  }
  switch(packet.type) {
    case "s00" : { this.setState(packet.state); break; }
    case "s01" : { this.login(packet); break; }
    case "x00" : { main.menu.error.showError("Connection Error", packet.message); break; }
    case "x01" : { main.menu.error.showErrorException("Server Exception", packet.message, packet.trace); break; }
    default : { main.close(); main.menu.error.showErrorException("Connection Error", "Recieved invalid packet type: " + packet.type, JSON.stringify(packet)); break; }
  }
};

/*  State Ids
    - a = auth
    - o = online
 */
Auth.prototype.setState = function(state) {
  switch(state) {
    case "a" : { this.state = new AuthState(); break; }
    case "o" : { this.state = new OnlineState(); break; }
    default : { main.close(); main.menu.error.showError("Connection Error", "Received invalid state ID: " + state); return; }
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
  this.webSocket.close();
};