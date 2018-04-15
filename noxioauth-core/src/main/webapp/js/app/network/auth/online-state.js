"use strict";
/* global main */

function OnlineState() {
  
};

OnlineState.prototype.handlePacket = function(packet) {
  switch(packet.type) {
    case "o01" : { main.menu.online.items.server.showServerInfo(packet.servers); return true; }
    case "o04" : { main.unlocks.loadList(packet.unlocks); return true; }
    case "o08" : { this.unlockSuccess(); return true; }
    case "o09" : { this.unlockFail(packet.message); return true; }
    case "o21" : { this.requestPaymentRedirect(packet.redirect); return true; }
    case "o22" : { this.requestPaymentFail(packet.message); return true; }
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

OnlineState.prototype.requestUnlock = function(key) {
  this.send({type: "o07", key: key});
  main.menu.connect.show("Unlocking...", 0);
};

OnlineState.prototype.unlockSuccess = function() {
  main.menu.unlock.show();
};

OnlineState.prototype.unlockFail = function(message) {
  main.menu.warning.show(message);
  main.menu.unlock.show();
};

OnlineState.prototype.requestPayment = function(item) {
  this.send({type: "o20", item: item});
  main.menu.connect.show("Creating transaction", 0);
};

OnlineState.prototype.requestPaymentRedirect = function(redirect) {
  window.open(redirect);
  main.menu.online.show();
};

OnlineState.prototype.requestPaymentFail = function(message) {
  main.menu.warning.show(message);
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