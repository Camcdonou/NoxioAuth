"use strict";
/* global main */

function ToolPalleteTile(menu) {
  this.menu = menu;
  
  this.element = document.getElementById("tool-pallete-tile");
  
  this.block = document.getElementById("tool-pallete-tile-block");
}

ToolPalleteTile.prototype.update = function() {
    /* Field#1 - Tile Set */
    var map = main.editor.map;
    var ts = this.block.value.replace(/[\n\r]/g, "").split(";");
    var tileSetData = [];
    for(var i=0;i<ts.length;i++) {
      var t = ts[i].split(",");
      tileSetData.push({model: t[0], material: t[1]});
    }
    map.pallete = map.loadPallete(main.editor.display, tileSetData); // Reloads tile set
    this.show();
};

ToolPalleteTile.prototype.show = function() {
  if(!main.editor) { this.element.innerHTML += "<div class='tool-header'>Error!</div>"; }
  main.editor.tool = undefined;
  main.editor.settings.cursor = 0;
  main.editor.selection = undefined;
  
  var pal = main.editor.map.pallete;
  this.block.value = "undefined,undefined;\n";
  for(var i=1;i<pal.length;i++) {
    this.block.value += pal[i].model.name + "," + pal[i].material.name + (i+1<pal.length?";\n":"");
  }
  
  this.menu.hideAll();
  this.element.style.display = "block";
};

ToolPalleteTile.prototype.hide = function() {
  this.element.style.display = "none";
};