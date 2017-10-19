"use strict";
/* global main */

function OnlineState() {
  
};

OnlineState.prototype.handlePacket = function(packet) {
  switch(packet.type) {
    case "o01" : { main.menu.online.items.server.showServerInfo(packet.servers); return true; }
    default : { return false; }
  }
};

OnlineState.prototype.getServerInfo = function() {
  this.send({type: "o02"});
};

/* Checks the status of game servers via AJAX */
OnlineState.prototype.checkServerStatus = function(id, address, port, info) {
  $.ajax({
    url: "http://" + info.address + ":" + info.port + "/noxiogame/info",
    type: 'GET',
    timeout: 5000,
    success: function(data) { main.menu.online.items.server.updateServerInfo(id, address, port, data); },
    error: function() { main.menu.online.items.server.updateServerInfo(id, address, port, undefined); }
  });
};

OnlineState.prototype.ready = function() {
  this.send({type: "o03"});
  main.menu.online.show();
};

OnlineState.prototype.send = function(data) {
  main.net.auth.send(data);
};

OnlineState.prototype.type = function() {
  return "o";
};

OnlineState.prototype.destroy = function() {
  
};