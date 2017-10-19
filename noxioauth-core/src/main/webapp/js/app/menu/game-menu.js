"use strict";
/* global main */

function GameMenu() {
  this.element = document.getElementById("game");
  this.loadElement = document.getElementById("game-load");
};

GameMenu.prototype.loading = function(html) {
  this.loadElement.innerHTML = html;
};

GameMenu.prototype.show = function() {
  main.menu.hideAll();
  this.element.style.display = "block";
};

GameMenu.prototype.hide = function() {
  this.element.style.display = "none";
};