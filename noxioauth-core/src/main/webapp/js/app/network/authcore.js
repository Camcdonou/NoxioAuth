"use strict";

net.auth = {};
net.auth.establish = function() {
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
      menu.connect.show("Failed to retrieve server status...");
      return;
    }
    menu.connect.show("Checking server status @" + adresses[r] + "...");
    $.ajax({
      url: "http://" + adresses[r] + ":7001/noxioauth/status",
      type: 'GET',
      timeout: 3000,
      success: function() { net.auth.connect(adresses[r]); },
      error: function() { getStatus(++r); }
    });
  };
  
  getStatus(0);
};


net.auth.isConnected = function() {
  return net.auth.webSocket !== undefined && net.auth.webSocket.readyState !== WebSocket.CLOSED;
};

net.auth.connect = function(ws){
  if(net.auth.isConnected()) {
    return;
  }

  net.auth.webSocket = new WebSocket("ws://" + ws + ":7001/noxioauth/auth");
  menu.connect.show("Connecting @" + ws + "...");

  net.auth.webSocket.onopen = function(event){
    if(event.type !== "open") {
      error.showError("Connection Error", "ws openEvent.type mismatch!");
      net.auth.close();
      return;
    }
  };

  net.auth.webSocket.onmessage = function(event){
    net.auth.handlePacket(JSON.parse(event.data));
  };

  net.auth.webSocket.onclose = function(event){
    menu.connect.show("Connection closed...");
    net.auth.webSocket = undefined;
  };
};

net.auth.handlePacket = function(packet) {
  /* For Debug @FIXME */
  console.log(packet);
  
  /* Allow state to handle packet. If state returns false then packet was not handled and forward it to general handling. */
  if(net.auth.state !== undefined) {
    if(net.auth.state.handlePacket(packet)) {
      return;
    }
  }
  switch(packet.type) {
    case "s00" : { net.auth.setState(packet.state); break; }
    case "s01" : { net.auth.login(packet); break; }
    case "x00" : { error.showError("Connection Error", packet.message); break; }
    case "x01" : { error.showErrorException("Server Exception", packet.message, packet.trace); break; }
    default : { net.auth.close(); error.showErrorException("Connection Error", "Recieved invalid packet type: " + packet.type, JSON.stringify(packet)); break; }
  }
};

/*  State Ids
    - a = auth
    - o = online
 */
net.auth.setState = function(state) {
  switch(state) {
    case "a" : { net.auth.state = net.auth.auth; break; }
    case "o" : { net.auth.state = net.auth.online; break; }
    default : { net.auth.close(); error.showError("Connection Error", "Received invalid state ID: " + state); return; }
  }
  net.auth.state.ready();
};

net.auth.login = function(packet) {
  net.user = packet.user;
  net.sid = packet.sid;
};

net.auth.send = function(packet){
  net.auth.webSocket.send(JSON.stringify(packet));
};

/* @FIXME if this is called for pretty much any reason we will need to shut down network.js as well likely. */
net.auth.close = function(){
  net.auth.webSocket.close();
};