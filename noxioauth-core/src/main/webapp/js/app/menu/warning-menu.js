"use strict";
/* global main */

function WarningMenu() {
  this.element = document.getElementById("warning");
  this.hide();
};

WarningMenu.prototype.show = function(message) {
  this.element.style.display = "block";
  this.element.innerHTML = "<img src='img/aes/warn.png' style='height: 16px;'/> " + message;
  console.warn("##WARN## " + message);
    /*  Animation will not replay unless the DOM is given a chance to update.
        This is a hacky fix for that problem. It doesn't work exactly as it should.
        tmp is created because of javascript being literal cancer with scopes @FIXME
    */
    this.element.classList.remove("info-animate");
    var tmp = this.element;
    setTimeout(function() { tmp.classList.add("info-animate"); }, 1);
};

WarningMenu.prototype.hide = function() {
  this.element.style.display = "none";
};