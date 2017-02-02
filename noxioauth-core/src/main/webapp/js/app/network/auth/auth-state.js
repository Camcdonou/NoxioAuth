"use strict";
/* global main */

function AuthState() {
  
};

AuthState.prototype.handlePacket = function(packet) {
  switch(packet.type) {
    case "a03" : { main.menu.warning.show(packet.message); return true; }
    case "a05" : { main.menu.warning.show(packet.message); return true; }
    case "a06" : { main.menu.warning.show("Account created successfully."); return true; }
    case "a07" : { this.salt = packet.salt; return true; }
    default : { return false; }
  }
};

AuthState.prototype.login = function(username, password) {
  if(this.salt === undefined) {
    main.menu.error.showError("Login Error", "Client never recieved salt from server. Aborting.");
    main.close();
    return;
  }
  this.send({type: "a01", user: username, hash: sha256(this.salt+sha256(password))});
};

AuthState.prototype.create = function(username, password) {
  this.send({type: "a00", user: username, hash: sha256(password)});
};

AuthState.prototype.ready = function() {
  this.send({type: "a08"});
  main.menu.auth.show();
};

AuthState.prototype.send = function(data) {
  main.net.auth.send(data);
};

AuthState.prototype.type = function() {
  return "a";
};

AuthState.prototype.destroy = function() {
  
};