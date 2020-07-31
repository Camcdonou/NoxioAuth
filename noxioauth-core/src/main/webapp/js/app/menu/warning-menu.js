"use strict";
/* global main */

function WarningMenu() {
  this.element = document.getElementById("warning");
  this.hide();
  
  this.timeout = undefined;
};

WarningMenu.prototype.show = function(message) {
  this.element.style.display = "block";
  this.element.innerHTML = "<img src='img/aes/warn.png' style='height: 20px;'/> " + message;
  console.warn("##WARN## " + message);

  if(this.timeout) { clearTimeout(this.timeout); }
  var tmp = this.element;
  this.timeout = setTimeout(function() { tmp.style.display = "none"; }, 7000);
};

WarningMenu.prototype.hide = function() {
  this.element.style.display = "none";
};