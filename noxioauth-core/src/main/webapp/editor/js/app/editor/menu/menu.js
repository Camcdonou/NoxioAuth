"use strict";
/* global main */

function Menu() {
  /* Register all menu classes here*/
  var m = [
    {id: "file", obj: new MenuFile()},
    {id: "editor", obj: new MenuEditor()}
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
  document.getElementById("load").style.display = "none";
};