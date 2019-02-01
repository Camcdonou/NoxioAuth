"use strict";
/* global main */

function VerifyMenu() {
  this.element = document.getElementById("verify");
  this.input = document.getElementById("verify-input");
  this.button = document.getElementById("verify-submit");
  
  /* ENTER keypress to SUBMIT on fields.*/
  var tmp = this;
  this.input.addEventListener("keyup", function(evt) { if(evt.keyCode === 13) { tmp.button.click(); } });
};

VerifyMenu.prototype.show = function() {
  main.menu.navigation("verify", "verify");
  main.menu.hideAll();
  this.element.style.display = "block";
};

VerifyMenu.prototype.hide = function() {
  this.element.style.display = "none";
};

VerifyMenu.prototype.submit = function() {
  main.net.auth.state.submitCode(this.input.value);
};

/* Called when the back button is hit on this menu */
VerifyMenu.prototype.onBack = function() {
  reset(); //This is a unique function call only used for restarting the JS client on a new session.
};