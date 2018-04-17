"use strict";
/* global main */

function AuthState() {
  
};

AuthState.prototype.handlePacket = function(packet) {
  switch(packet.type) {
    case "a03" : { main.menu.warning.show(packet.message); return true; }
    case "a05" : { this.loginError(packet); return true; }
    case "a06" : { this.createSuccess(); return true; }
    case "a07" : { /* Old salty packet. Deprecated. */ return true; }
    case "a11" : { this.sendEmail(); return true; }
    case "a12" : { this.verifyCode(); return true; }
    case "a14" : { this.failedSend(); return true; }
    case "a15" : { this.createFail(); return true; }
    case "a21" : { this.resetRequest(); return true; }
    case "a22" : { this.resetEmailSent(); return true; }
    case "a23" : { this.resetInvalid(packet); return true; }
    case "a24" : { this.resetSubmit(); return true; }
    case "a25" : { this.resetSuccess(); return true; }
    case "a26" : { this.resetFail(packet); return true; }
    case "a27" : { this.resetFailAndCancel(packet); return true; }
    default : { return false; }
  }
};

AuthState.prototype.login = function(username, password) {
  this.send({type: "a01", user: username, hash: sha256("20"+password+"xx")});
  main.menu.connect.show("Logging In", 0);
};

AuthState.prototype.loginError = function(packet) {
  main.menu.warning.show(packet.message);
  main.menu.auth.show();
};

AuthState.prototype.create = function(username, email, password) {
  this.send({type: "a00", user: username, email: email, hash: sha256("20"+password+"xx")});
};

AuthState.prototype.sendEmail = function() {
  main.menu.connect.show("Sending Verification Email", 0);
};

AuthState.prototype.failedSend = function() {
  main.menu.warning.show("Failed to send verification email.");
  main.menu.auth.show();
};

AuthState.prototype.verifyCode = function() {
  main.menu.verify.show();
};

AuthState.prototype.submitCode = function(code) {
  this.send({type: "a13", code: code});
};

AuthState.prototype.createSuccess = function(code) {
  main.menu.warning.show("Account created successfully.");
  main.menu.auth.show();
};

AuthState.prototype.createFail = function() {
  main.menu.warning.show("Failed to create account.");
  main.menu.auth.show();
};

AuthState.prototype.ready = function() {
  this.send({type: "a08"});
  main.menu.auth.show();
};

AuthState.prototype.resetRequest = function(user, email) {
  this.send({type: "a21", user: user, email: email});
  main.menu.connect.show("Sending Reset Email", 0);
};

AuthState.prototype.resetEmailSent = function() {
  main.menu.reset.showVerify();
};

AuthState.prototype.resetInvalid = function(data) {
  main.menu.warning.show(data.message);
  main.menu.reset.showRequest();
};

AuthState.prototype.resetSubmit = function(password, code) {
  this.send({type: "a24", hash: sha256("20"+password+"xx"), code: code});
  main.menu.connect.show("Verifying Reset", 0);
};

AuthState.prototype.resetSuccess = function() {
  main.menu.warning.show("Password reset.");
  main.menu.auth.show();
};

AuthState.prototype.resetFail = function(data) {
  main.menu.warning.show(data.message);
  main.menu.reset.showVerify();
};

AuthState.prototype.resetFailAndCancel = function(data) {
  main.menu.warning.show(data.message);
  main.menu.auth.show();
};

AuthState.prototype.send = function(data) {
  main.net.auth.send(data);
};

AuthState.prototype.type = function() {
  return "a";
};

AuthState.prototype.destroy = function() {
  
};