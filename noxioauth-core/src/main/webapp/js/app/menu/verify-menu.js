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
  main.menu.hideAll();
  this.element.style.display = "block";
};

VerifyMenu.prototype.hide = function() {
  this.element.style.display = "none";
};

VerifyMenu.prototype.submit = function() {
  main.net.auth.state.submitCode(this.input.value);
};