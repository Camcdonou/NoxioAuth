"use strict";
/* global main */

function ToolPalleteDoodad(menu) {
  this.menu = menu;
  
  this.element = document.getElementById("tool-pallete-doodad");
  
  this.block = document.getElementById("tool-pallete-doodad-block");
}

ToolPalleteDoodad.prototype.update = function() {
  var dp = this.block.value.replace(/[\n\r]/g, "").split(";");
  var map = main.editor.map;
  var palleteData = [];
  for(var i=0;i<dp.length;i++) {
    var d = dp[i].split(",");
    palleteData.push({model: d[0], material: d[1]});
  }
  map.doodadPallete = map.loadPallete(main.editor.display, palleteData); // Reloads pallete set
  this.show();
};

ToolPalleteDoodad.prototype.show = function() {
  if(!main.editor) { this.element.innerHTML += "<div class='tool-header'>Error!</div>"; }
  main.editor.tool = undefined;
  main.editor.settings.cursor = 1;
  main.editor.selection = undefined;
  
  var pal = main.editor.map.doodadPallete;
  this.block.value = "";
  for(var i=0;i<pal.length;i++) {
    this.block.value += pal[i].model.name + "," + pal[i].material.name + (i+1<pal.length?";\n":"");
  }
  
  this.menu.hideAll();
  this.element.style.display = "block";
};

ToolPalleteDoodad.prototype.hide = function() {
  this.element.style.display = "none";
};