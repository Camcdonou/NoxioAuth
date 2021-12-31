"use strict";
/* global main */

function ToolOptions(menu) {
  this.menu = menu;
  
  this.element = document.getElementById("tool-options");
  
  this.snap = document.getElementById("tool-options-snap");
  this.snap.value = "0.25";
}

ToolOptions.prototype.update = function() {
  main.editor.settings.snap = isNaN(parseFloat(this.snap.value)) ? 0.0 : parseFloat(this.snap.value);
};

ToolOptions.prototype.show = function() {
  if(!main.editor) { this.element.innerHTML += "<div class='tool-header'>Error!</div>"; }
  main.editor.tool = undefined;
  main.editor.settings.cursor = 1;
  main.editor.selection = undefined;
  
  this.menu.hideAll();
  this.element.style.display = "block";
};

ToolOptions.prototype.hide = function() {
  this.element.style.display = "none";
};