"use strict";
/* global main */

function MenuEditor() {
  this.element = document.getElementById("editor");
  
  /* Register all tool menu classes here*/
  var m = [
    {id: "file", obj: new ToolFile(this)},
    {id: "properties", obj: new ToolProperties(this)},
    {id: "tiles", obj: new ToolTiles(this)},
    {id: "collision", obj: new ToolCollision(this)},
    {id: "doodad", obj: new ToolDoodad(this)},
    {id: "spawn", obj: new ToolSpawn(this)},
    {id: "palletetile", obj: new ToolPalleteTile(this)},
    {id: "palletedoodad", obj: new ToolPalleteDoodad(this)},
    {id: "options", obj: new ToolOptions(this)},
    {id: "about", obj: new ToolAbout(this)}
  ];
  
  this.menus = [];
  for(var i=0;i<m.length;i++) {
    this.menus[i] = (m[i].obj);
    this[m[i].id] = m[i].obj;
  }
  
  this.hideAll();
}

MenuEditor.prototype.show = function() {
  main.menu.hideAll();
  this.element.style.display = "block";
};

MenuEditor.prototype.hide = function() {
  this.element.style.display = "none";
};

MenuEditor.prototype.hideAll = function() {
  for(var i=0;i<this.menus.length;i++) {
    this.menus[i].hide();
  }
};