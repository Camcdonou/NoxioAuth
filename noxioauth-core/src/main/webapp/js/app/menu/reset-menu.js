"use strict";
/* global main */

function ResetMenu() {
  this.element = document.getElementById("reset");
  
  this.input = document.getElementById("verify-input");
  this.button = document.getElementById("verify-submit");
  
  this.request = {
    element: document.getElementById("reset-request"),
    user: document.getElementById("reset-request-user"),
    email: document.getElementById("reset-request-email"),
    button: document.getElementById("reset-request-submit")
  };
  
  this.verify = {
    element: document.getElementById("reset-verify"),
    passwordA: document.getElementById("reset-verify-pass-a"),
    passwordB: document.getElementById("reset-verify-pass-b"),
    code: document.getElementById("reset-verify-code"),
    button: document.getElementById("reset-verify-submit")
  };

  /* ENTER keypress to SUBMIT on fields.*/
  var tmp = this;
  this.request.user.addEventListener("keyup", function(evt) { if(evt.keyCode === 13) { tmp.request.button.click(); } });
  this.request.email.addEventListener("keyup", function(evt) { if(evt.keyCode === 13) { tmp.request.button.click(); } });
  this.verify.passwordA.addEventListener("keyup", function(evt) { if(evt.keyCode === 13) { tmp.verify.button.click(); } });
  this.verify.passwordB.addEventListener("keyup", function(evt) { if(evt.keyCode === 13) { tmp.verify.button.click(); } });
  this.verify.code.addEventListener("keyup", function(evt) { if(evt.keyCode === 13) { tmp.verify.button.click(); } });
};

ResetMenu.prototype.submitRequest = function() {
  main.net.auth.state.resetRequest(this.request.user.value, this.request.email.value);
};

ResetMenu.prototype.submitVerify = function() {
  if(this.verify.passwordA.value !== this.verify.passwordB.value) {
    main.menu.warning.show("Passwords do not match!");
  }
  else {
    main.net.auth.state.resetSubmit(this.verify.passwordA.value, this.verify.code.value);
  }
  
  this.verify.passwordA.value = ""; this.verify.passwordB.value = "";
};

ResetMenu.prototype.showRequest = function() {
  main.menu.navigation("reset", "reset");
  main.menu.hideAll();
  this.element.style.display = "block";
  this.request.element.style.display = "block";
};

ResetMenu.prototype.showVerify = function() {
  main.menu.navigation("reset", "reset");
  main.menu.hideAll();
  this.element.style.display = "block";
  this.verify.element.style.display = "block";
};

ResetMenu.prototype.hide = function() {
  this.element.style.display = "none";
  this.request.element.style.display = "none";
  this.verify.element.style.display = "none";
};

ResetMenu.prototype.submit = function() {
  main.net.auth.state.submitCode(this.input.value);
};

/* Called when the back button is hit on this menu */
ResetMenu.prototype.onBack = function() {
  reset(); //This is a unique function call only used for restarting the JS client on a new session.
};