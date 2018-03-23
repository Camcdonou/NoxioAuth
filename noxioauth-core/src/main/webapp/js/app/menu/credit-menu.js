"use strict";
/* global main */

/* Handles the credit display on the top right of some menus. */
function CreditMenu() {
  this.element = document.getElementById("credit");
  this.number = document.getElementById("credit-num");
}

CreditMenu.prototype.update = function() {
  this.number.innerHTML = main.stats.credits;
};

/* Shows this menu */
CreditMenu.prototype.show = function() {
  this.update();
  this.element.style.display = "block";
};

/* Hide this menu */
CreditMenu.prototype.hide = function() {
  this.element.style.display = "none";
};
