"use strict";
/* global main */

function ConnectMenu() {
  this.element = document.getElementById("connect");
  this.info = document.getElementById("connect-info");
};

/* icon params 
 * 0 - spin
 * 1 - error
 */
ConnectMenu.prototype.show = function(message, icon) {
  main.menu.hideAll();
  switch(icon) {
    case 1  : { this.info.innerHTML = message + " <img alt='Error.' src='img/aes/alert.svg' class='ico-con'/>"; break; }
    default : { this.info.innerHTML = message + " <img alt='Loading.' src='img/aes/spin-black.svg' class='ico-con'/>"; break; }
  }
  this.element.style.display = "block";
};

ConnectMenu.prototype.hide = function() {
  this.element.style.display = "none";
};