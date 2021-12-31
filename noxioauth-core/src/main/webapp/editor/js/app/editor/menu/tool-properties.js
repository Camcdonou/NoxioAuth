"use strict";
/* global main */

function ToolProperties(menu) {
  this.menu = menu;
  
  this.element = document.getElementById("tool-properties");
  
  this.block = document.getElementById("tool-properties-block");
}

ToolProperties.prototype.update = function() {
  var spl = this.block.value.replace(/(?:\r\n|\r|\n)/g, "").split(";");
  main.editor.map.name = spl[0];
  main.editor.map.description = spl[1];
  main.editor.map.gametypes = spl[2].split(",");
  console.log(main.editor.map);
};

ToolProperties.prototype.show = function() {
  if(!main.editor) { this.element.innerHTML += "<div class='tool-header'>Error!</div>"; }
  main.editor.tool = undefined;
  main.editor.settings.cursor = 1;
  main.editor.selection = undefined;
  
  var map = main.editor.map;
  
  this.block.innerHTML = map.name + ";\n" + map.description + ";\n";
  for(var i=0;i<map.gametypes.length;i++) {
    this.block.innerHTML += map.gametypes[i] + (i<map.gametypes.length-1 ? ",\n" : "");
  }
  
  this.menu.hideAll();
  this.element.style.display = "block";
};

ToolProperties.prototype.hide = function() {
  this.element.style.display = "none";
};