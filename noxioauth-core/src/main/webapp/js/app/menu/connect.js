"use strict";

menu.connect = {};

menu.connect.element = document.getElementById("connect");
menu.connect.info = document.getElementById("connect-info");

menu.connect.show = function(message) {
  menu.hideAll();
  menu.connect.info.innerHTML = message;
  menu.connect.element.style.display = "block";
};

menu.connect.hide = function() {
  menu.connect.element.style.display = "none";
};