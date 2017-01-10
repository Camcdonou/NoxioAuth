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
    setTimeout(function(){ menu.auth.show(); }, 1000);
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
  console.log(packet);
  switch(packet.type) {
    case "x00" : { error.showError("Connection Error", packet.message); break; }
    case "x01" : { error.showErrorException("Server Exception", packet.message, packet.trace); break; }
    /* @FIXME Please seperate this into states as to match the design of the server side */
    case "a03" : { break; }
    case "a04" : { break; }
    case "a05" : { break; }
    case "a06" : { break; }
    case "a07" : { net.auth.salt = packet.salt; break; }
    default : { net.auth.close(); error.showErrorException("Connection Error", "Recieved invalid packet type: " + packet.type, JSON.stringify(packet)); break; }
  }
};

/* @FIXME Please seperate some of these functions into states as to match the design of the server side */
net.auth.login = function(username, password) {
  if(net.auth.salt === undefined) {
    error.showError("Login Error", "Client never recieved salt from server. Aborting.");
    net.auth.close();
    return;
  }
  net.auth.send({type: "a01", user: username, hash: sha256(net.auth.salt+sha256(password))});
};

net.auth.create = function(username, password) {
  net.auth.send({type: "a00", user: username, hash: sha256(password)});
};

net.auth.send = function(packet){
  net.auth.webSocket.send(JSON.stringify(packet));
};

net.auth.close = function(){
  net.auth.webSocket.close();
};