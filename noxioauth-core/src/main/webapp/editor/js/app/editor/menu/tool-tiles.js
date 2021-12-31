"use strict";
/* global main */

function ToolTiles(menu) {
  this.menu = menu;
  
  this.element = document.getElementById("tool-tiles");
}

ToolTiles.prototype.show = function() {
  if(!main.editor) { this.element.innerHTML += "<div class='tool-header'>Error!</div>"; }
  main.editor.tool = undefined;
  main.editor.settings.cursor = 0;
  this.toolInd = 0;
  this.rot = 0;
  
  var pal = main.editor.map.pallete;
  this.element.innerHTML = "";
  this.element.innerHTML += "<div class='tool-header'>Tile Pallete</div>";
  this.element.innerHTML += "N <input id='tool-tiles-n' onchange='main.menu.editor.tiles.setRot(0)' type='radio' name='rotation' value=0> ";
  this.element.innerHTML += "S <input id='tool-tiles-s' onchange='main.menu.editor.tiles.setRot(2)' type='radio' name='rotation' value=2> ";
  this.element.innerHTML += "E <input id='tool-tiles-e' onchange='main.menu.editor.tiles.setRot(1)' type='radio' name='rotation' value=1> ";
  this.element.innerHTML += "W <input id='tool-tiles-w' onchange='main.menu.editor.tiles.setRot(3)' type='radio' name='rotation' value=3> </br>";
  this.element.innerHTML += "<div class='tool-button sm' onclick='main.menu.editor.tiles.setTool(" + 0 + ");'>" + "NULL" + "</div>";
  for(var i=1;i<pal.length;i++) {
    this.element.innerHTML += "<div class='tool-button sm' onclick='main.menu.editor.tiles.setTool(" + i + ");'>" + pal[i].model.name + ":" + pal[i].material.name + "</div>";
  }
  
  this.radios = [
    document.getElementById("tool-tiles-n"),
    document.getElementById("tool-tiles-e"),
    document.getElementById("tool-tiles-s"),
    document.getElementById("tool-tiles-w")
  ];
  
  this.setTool(0);
  
  this.menu.hideAll();
  this.element.style.display = "block";
};

ToolTiles.prototype.hide = function() {
  this.element.style.display = "none";
};

ToolTiles.prototype.setTool = function(index) {
  this.toolInd = index;
  this.update();
};

ToolTiles.prototype.setRot = function(val) {
  this.rot = val;
  this.update();
};

ToolTiles.prototype.setCombo = function(index, val) {
  this.toolInd = index;
  this.rot = val;
  this.update();
};

ToolTiles.prototype.update = function() {
  for(var i=0;i<this.radios.length;i++) {
    this.radios[i].checked = false;
  }
  this.radios[this.rot].checked = true;
  main.editor.tool = new EditorToolTiles(main.editor, this, this.toolInd, this.rot);
};

function EditorToolTiles(editor, menu, index, rot) {
  this.editor = editor;
  this.menu = menu;
  this.index = index;
  this.rot = rot;
}

EditorToolTiles.prototype.handleMouse = function(mouse, selection) {
  if(mouse.lmb) {
    var tile = {x: parseInt(Math.floor(selection.x)), y: parseInt(Math.floor(selection.y))};
    if(tile.x < 0 || tile.x >= this.editor.map.size.x || tile.y < 0 || tile.y >= this.editor.map.size.y) { return; }
    this.editor.map.data[tile.y][tile.x].ind = this.index;
    this.editor.map.data[tile.y][tile.x].rot = this.rot;
  }
  if(mouse.rmb) {
    var tile = {x: parseInt(Math.floor(selection.x)), y: parseInt(Math.floor(selection.y))};
    if(tile.x < 0 || tile.x >= this.editor.map.size.x || tile.y < 0 || tile.y >= this.editor.map.size.y) { return; }
    
    this.menu.setCombo(this.editor.map.data[tile.y][tile.x].ind, this.editor.map.data[tile.y][tile.x].rot);
  }
};

EditorToolTiles.prototype.handleKeyboard = function(keyboard, imp) {
  for(var i=0;i<imp.length;i++) {
    switch(imp[i]) {
      case 82 : { this.menu.setRot(++this.rot<=3?this.rot:0); break; }
      default : { break; }
    }
  }
};