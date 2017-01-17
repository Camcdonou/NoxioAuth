"use strict";
/* global main */

function Menu() {
  /* Register all menu classes here*/
  var m = [
    {id: "error", obj: new ErrorMenu()}, //Unique in that it displays on top as a modal.
    {id: "connect", obj: new ConnectMenu()},
    {id: "auth", obj: new AuthMenu()},
    {id: "online", obj: new OnlineMenu()},
    {id: "lobby", obj: new LobbyMenu()}
  ];
  
  this.menus = [];
  for(var i=0;i<m.length;i++) {
    this.menus[i] = (m[i].obj);
    this[m[i].id] = m[i].obj;
  }
  
  this.hideAll();
};

Menu.prototype.hideAll = function() {
  for(var i=0;i<this.menus.length;i++) {
    this.menus[i].hide();
  }
};