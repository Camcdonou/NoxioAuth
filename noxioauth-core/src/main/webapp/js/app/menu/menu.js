"use strict";

var menu = {};

menu.init = function() {
  /* Registers all menus here so they can be managed */
  menu.menus = [
    menu.connect,
    menu.auth
  ];
  menu.hideAll();
};

menu.hideAll = function() {
  for(var i=0;i<menu.menus.length;i++) {
    menu.menus[i].hide();
  }
};