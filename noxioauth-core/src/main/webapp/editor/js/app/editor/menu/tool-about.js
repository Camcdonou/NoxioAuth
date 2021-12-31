"use strict";
/* global main */

function ToolAbout(menu) {
  this.menu = menu;
  
  this.element = document.getElementById("tool-about");
}

ToolAbout.prototype.show = function() {
  if(!main.editor) { this.element.innerHTML += "<div class='tool-header'>Error!</div>"; }
  main.editor.tool = undefined;
  main.editor.settings.cursor = 1;
  main.editor.selection = undefined;
  
  this.menu.hideAll();
  this.element.style.display = "block";
};

ToolAbout.prototype.hide = function() {
  this.element.style.display = "none";
};