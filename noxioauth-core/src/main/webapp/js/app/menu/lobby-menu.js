"use strict";
/* global main */

function LobbyMenu() {
  this.element = document.getElementById("lobby");
  
  /* Prototype functions for sub menus to use */
  var hide = function() {
    this.element.classList.remove("selected");
    if(this.info !== undefined) { this.info.style.display = "none"; }
    for(var i=0;i<this.items.length;i++) {
      this.items[i].style.display = "none";
    }
  };
  var show = function() {
    main.menu.lobby.hideAll();
    this.element.classList.add("selected");
    for(var i=0;i<this.items.length;i++) {
      this.items[i].style.display = "block";
    }
  };
  
  /* Creates sub menus */
  this.items = {
    leave: {
      element: document.getElementById("lobby-leave"),
      hide: hide,
      show: show,
      items: [],
      onEnter: function() {
         main.net.leaveServer();
      }
    }
  };
};

/* Shows this menu */
LobbyMenu.prototype.show = function() {
  main.menu.hideAll();
  document.getElementById("lobby-server").innerHTML = main.net.user + "@" + main.net.game.info.name;
  this.hideAll();
  this.element.style.display = "block";
};

/* Hide this menu */
LobbyMenu.prototype.hide = function() {
  this.element.style.display = "none";
};

/* Hides all sub menus in this menu */
LobbyMenu.prototype.hideAll = function() {
  this.items.leave.hide();
};