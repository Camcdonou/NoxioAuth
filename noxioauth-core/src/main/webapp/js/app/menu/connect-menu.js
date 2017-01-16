"use strict";
/* global main */

function ConnectMenu() {
  this.element = document.getElementById("connect");
  this.info = document.getElementById("connect-info");
};

ConnectMenu.prototype.show = function(message) {
  main.menu.hideAll();
  this.info.innerHTML = message;
  this.element.style.display = "block";
};

ConnectMenu.prototype.hide = function() {
  this.element.style.display = "none";
};