"use strict";
/* global main */

function AuthState() {
  
};

AuthState.prototype.handlePacket = function(packet) {
  switch(packet.type) {
    default : { return false; }
  }
};

AuthState.prototype.ready = function() { };

AuthState.prototype.send = function(data) {
  main.net.auth.send(data);
};

AuthState.prototype.type = function() {
  return "a";
};

AuthState.prototype.destroy = function() {
  
};