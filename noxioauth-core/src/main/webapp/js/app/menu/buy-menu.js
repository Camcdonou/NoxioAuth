"use strict";
/* global main */

function BuyMenu() {
  this.element = document.getElementById("buy");
  this.button = {
    game: document.getElementById("buy-game")
  };
  this.price = document.getElementById("buy-price");
};

BuyMenu.prototype.back = function() {
  main.menu.online.show();
};

BuyMenu.prototype.buyGame = function() {
  main.net.auth.state.requestPayment("SPEC");
};

/* Disables buttons to buy something you already have */
BuyMenu.prototype.updateButtons = function() {
  if(main.net.type >= 1) { this.button.game.style.display = "none"; this.price.innerHTML = "Purchased"; }
};

BuyMenu.prototype.show = function() {
  main.menu.navigation("buy", "buy");
  main.menu.hideAll();
  main.menu.credit.show();
  main.menu.rank.show();
  this.updateButtons();
  this.element.style.display = "block";
};

BuyMenu.prototype.hide = function() {
  this.element.style.display = "none";
};

/* Called when the back button is hit on this menu */
BuyMenu.prototype.onBack = function() {
  this.back();
};