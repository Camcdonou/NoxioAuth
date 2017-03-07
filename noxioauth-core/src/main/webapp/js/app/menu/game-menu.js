"use strict";
/* global main */

function GameMenu() {
  this.element = document.getElementById("game");
};

GameMenu.prototype.show = function() {
  main.menu.hideAll();
  this.element.style.display = "block";
};

GameMenu.prototype.hide = function() {
  this.element.style.display = "none";
};