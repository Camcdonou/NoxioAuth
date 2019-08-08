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
    case "o31" : { main.net.connectGameAuto(packet.servers); return true; }
    case "o41" : { this.adminInfo(packet); return true; }
    default : { return false; }
  }
};

OnlineState.prototype.getServerInfo = function() {
  this.send({type: "o02"});
};

/* Checks the status of game servers via AJAX */
OnlineState.prototype.checkServerStatus = function(ind, info) {
  $.ajax({
    url: "http://" + info.domain + ":" + info.port + "/nxg/info",
    type: 'GET',
    timeout: 5000,
    success: function(data) { main.menu.online.items.server.updateServerInfo(ind, info, data); },
    error: function() { main.menu.online.items.server.updateServerInfo(ind, info); }
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

OnlineState.prototype.requestQuickInfo = function() {
  this.send({type: "o30"});
  main.menu.connect.show("Requesting Info...", 0);
};

OnlineState.prototype.requestAdminMenu = function() {
  this.send({type: "o40"});
};

OnlineState.prototype.adminInfo = function(info) {
  main.menu.admin.generate(info);
};

OnlineState.prototype.adminBan = function(uid, length) {
  this.send({type: "o42", uid: uid, length: length});
};

OnlineState.prototype.adminSetUserType = function(uid, userType) {
  this.send({type: "o43", uid: uid, userType: userType});
};

OnlineState.prototype.adminSetUserSupport = function(uid) {
  this.send({type: "o44", uid: uid});
};

OnlineState.prototype.send = function(data) {
  main.net.auth.send(data);
};

OnlineState.prototype.type = function() {
  return "o";
};

OnlineState.prototype.destroy = function() {
  
};