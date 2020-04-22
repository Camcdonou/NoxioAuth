"use strict";
/* global main */

function FooterMenu() {
  this.element = document.getElementById("footer");
  this.supportBtn = document.getElementById("footer-support");
  
  var tmp = this;
  this.supportBtn.onclick = function() { 
    main.menu.info.show('Support', 'Having trouble? Check out the <span class="tos-btn" onclick="window.open(\'./help.html\')">Help Document</span> or drop us an email at support@20xx.io');
  };
};

FooterMenu.prototype.show = function() {
  this.element.style.display = "block";
};

FooterMenu.prototype.hide = function() {
  this.element.style.display = "none";
};