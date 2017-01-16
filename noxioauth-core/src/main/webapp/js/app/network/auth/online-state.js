"use strict";
/* global main */

function OnlineState() {
  
};

OnlineState.prototype.handlePacket = function(packet) {
  switch(packet.type) {
    case "o01" : { main.menu.online.items.server.showServerInfo(packet); return true; }
    default : { return false; }
  }
};

OnlineState.prototype.getServerInfo = function() {
  this.send({type: "o02"});
};

OnlineState.prototype.ready = function() {
  this.send({type: "o03"});
  main.menu.online.show();
};

OnlineState.prototype.send = function(data) {
  main.net.auth.send(data);
};