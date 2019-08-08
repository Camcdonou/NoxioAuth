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
  main.menu.connect.show("Sending Reset Email", 0);
  $.ajax({
    url: "http://" + window.location.host + "/nxc/auth/reset/request",
    type: 'POST',
    data: JSON.stringify({user: this.request.user.value, email: this.request.email.value}),
    contentType : 'application/json',
    timeout: 120000,
    success: function() {
      main.menu.reset.showVerify();
      main.menu.warning.show("Check your spam folder if you can't find the email.");
    },
    error: function(data) {
      if(data) { main.menu.warning.show(data.responseJSON.message); main.menu.reset.showRequest(); }
      else { main.menu.connect.show("Request Timed Out", 1); }
    }
  });
};

ResetMenu.prototype.submitVerify = function() {
  if(this.verify.passwordA.value !== this.verify.passwordB.value) {
    main.menu.warning.show("Passwords do not match!");
  }
  else {
    main.menu.connect.show("Verifying", 0);
    $.ajax({
      url: "http://" + window.location.host + "/nxc/auth/reset/process",
      type: 'POST',
      data: JSON.stringify({hash: sha256("20"+this.verify.passwordA.value+"xx"), verification: this.verify.code.value}),
      contentType : 'application/json',
      timeout: 120000,
      success: function() {
        main.menu.warning.show("Password Reset Successfully");
        main.menu.auth.show();
      },
      error: function(data) {
        if(data) { main.menu.warning.show(data.responseJSON.message); main.menu.reset.showVerify(); }
        else { main.menu.connect.show("Request Timed Out", 1); }
      }
    });
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