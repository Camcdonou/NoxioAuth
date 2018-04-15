"use strict";
/* global main */

function BuyMenu() {
  this.element = document.getElementById("buy");
  this.button = {
    full: document.getElementById("buy-full"),
    lite: document.getElementById("buy-lite")
  };
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

/* Disables buttons to buy something you already have */
BuyMenu.prototype.updateButtons = function() {
  if(main.net.type >= 2) { this.button.full.onclick=function(){}; this.button.full.innerHTML = "Purchased"; }
  if(main.net.type >= 1) { this.button.lite.onclick=function(){}; this.button.lite.innerHTML = "Purchased"; }
};

BuyMenu.prototype.show = function() {
  main.menu.hideAll();
  main.menu.credit.show();
  main.menu.rank.show();
  this.updateButtons();
  this.element.style.display = "block";
};

BuyMenu.prototype.hide = function() {
  this.element.style.display = "none";
};