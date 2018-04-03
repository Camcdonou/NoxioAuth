"use strict";
/* global main */

function FooterMenu() {
  this.element = document.getElementById("footer");
};

FooterMenu.prototype.show = function() {
  this.element.style.display = "block";
};

FooterMenu.prototype.hide = function() {
  this.element.style.display = "none";
};