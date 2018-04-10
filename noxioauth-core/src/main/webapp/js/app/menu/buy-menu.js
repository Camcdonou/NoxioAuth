"use strict";
/* global main */

function BuyMenu() {
  this.element = document.getElementById("buy");
};

BuyMenu.prototype.back = function() {
  main.menu.online.show();
};

BuyMenu.prototype.buyFull = function() {
  main.net.auth.state.requestPayment("FULL");
};

BuyMenu.prototype.buyLite = function() {
  main.net.auth.state.requestPayment("SPEC");
};

BuyMenu.prototype.show = function() {
  main.menu.hideAll();
  main.menu.credit.show();
  main.menu.rank.show();
  this.element.style.display = "block";
};

BuyMenu.prototype.hide = function() {
  this.element.style.display = "none";
};