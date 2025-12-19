"use strict";
/* global main */
/* global WebSocket */

/* Define Auth Class */
function Auth () {
  
};

Auth.prototype.establish = function(socket) {
  /* Use current page's host and protocol */
  var address = window.location.host;
  var protocol = window.location.protocol; // http: or https:

  main.menu.connect.show("Checking server status @" + address, 0);
  $.ajax({
    url: protocol + "//" + address + "/nxc/status",
    type: 'GET',
    timeout: 3000,
    success: function() { main.net.auth.connect(address, socket); },
    error: function() { main.menu.connect.show("Failed to retrieve server status", 1); }
  });
};

Auth.prototype.isConnected = function () {
  return this.webSocket !== undefined && this.webSocket.readyState !== WebSocket.CLOSED;
};

Auth.prototype.connect = function(address, socket){
  if(this.isConnected()) {
    main.menu.error.showError("Connection Error", "Attempting to open multiple connections.");
    main.close();
    return;
  }

  // Use wss:// for HTTPS pages, ws:// for HTTP pages
  var wsProtocol = window.location.protocol === "https:" ? "wss://" : "ws://";
  this.webSocket = new WebSocket(wsProtocol + address + "/nxc/" + socket);
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
    case "s04" : { main.setStats(packet.stats); break; } /* User Stats Update */
    case "s05" : { main.unlocks.load(packet.unlocks); break; } /* User Unlocks Update */
    case "s06" : { this.accountUpdate(packet); break; } /* Account info update */
    case "s12" : { main.menu.connect.show("Login Failed", 1); main.menu.warning.show(packet.message); reset(3500); break; }
    case "s45" : { main.menu.warning.show(packet.message); break; } /* Global message from admin */
    case "x00" : { main.menu.error.showError("Connection Error", packet.message); main.close(); break; }
    case "x01" : { main.menu.error.showErrorException("Server Exception", packet.message, packet.trace); main.close(); break; }
    default : { main.menu.warning.show("Connection Error", "Recieved unexpected packet: " + packet.type); break; }
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
  main.net.display = packet.display;
  main.net.type = packet.userType;
  main.net.guest = packet.guest;
  main.settings.load(packet.settings);
  main.setStats(packet.stats);
  main.unlocks.load(packet.unlocks);

  /* Persistence: Save credentials if not a guest */
  if (!main.net.guest && main.net.tempHash) {
    localStorage.setItem("noxio_user", main.net.user);
    localStorage.setItem("noxio_hash", main.net.tempHash);
  }
  main.net.tempHash = undefined;
};

Auth.prototype.accountUpdate = function(packet) {
  main.net.user = packet.user;
  main.net.sid = packet.sid;
  main.net.display = packet.display;
  main.net.type = packet.userType;
  main.unlocks.load(packet.unlocks);
  
  main.menu.info.show("Thanks", "Thanks for contributing to 20xx.io!</br>I sincerly appreciate the support and I hope you continue to enjoy the game.</br></br>Have a great day!");
  main.menu.buy.updateButtons(); /* Slightly hacky, nothing awful tho */
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