"use strict";
/* global main */

function LoginState() {
  
};

LoginState.prototype.handlePacket = function(packet) {
  switch(packet.type) {
    case "l01" : { this.serverInfo(packet); return true; }
    default : { return false; }
  }
};

LoginState.prototype.serverInfo = function(packet) {
  main.net.game.info = {name: packet.info.name, location: packet.info.location, description: packet.info.description};
};

LoginState.prototype.ready = function() {
  this.send({type: "l00", user: main.net.user, sid: main.net.sid});
  main.menu.connect.show("Logging into game server", 0);
};

LoginState.prototype.send = function(data) {
  main.net.game.send(data);
};

LoginState.prototype.type = function() {
  return "l";
};

LoginState.prototype.destroy = function() {
  
};