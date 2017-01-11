"use strict";

net.auth.auth = {};

net.auth.auth.handlePacket = function(packet) {
  switch(packet.type) {
    case "a03" : { menu.auth.items.create.showInfo(packet.message); return true; }
    case "a05" : { menu.auth.items.login.showInfo(packet.message); return true; }
    case "a06" : { menu.auth.items.create.showInfo("Account created susccessfully."); return true; }
    case "a07" : { net.auth.auth.salt = packet.salt; return true; }
    default : { return false; }
  }
};

net.auth.auth.login = function(username, password) {
  if(net.auth.auth.salt === undefined) {
    error.showError("Login Error", "Client never recieved salt from server. Aborting.");
    net.auth.close();
    return;
  }
  net.auth.send({type: "a01", user: username, hash: sha256(net.auth.auth.salt+sha256(password))});
};

net.auth.auth.create = function(username, password) {
  net.auth.send({type: "a00", user: username, hash: sha256(password)});
};

net.auth.auth.ready = function() {
  net.auth.send({type: "a08"});
  setTimeout(function(){ menu.auth.show(); }, 1000); /* @FIXME For debug so I can see where I connected */
};