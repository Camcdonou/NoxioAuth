"use strict";

net.auth.online = {};

net.auth.online.handlePacket = function(packet) {
  switch(packet.type) {
    case "o01" : { menu.online.items.server.showServerInfo(packet); return true; }
    default : { return false; }
  }
};

net.auth.online.getServerInfo = function() {
  net.auth.send({type: "o02"});
};

net.auth.online.ready = function() {
  net.auth.send({type: "o03"});
  menu.online.show();
};