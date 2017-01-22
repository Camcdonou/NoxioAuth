"use strict";
/* global main */

function LobbyMenu() {
  this.element = document.getElementById("lobby");
  
  /* Game Lobby List */
  this.list = {
    element: document.getElementById("lobby-list-container"),
    refresh: function() {
      this.element.innerHTML = "<div class='right-menu-item btn'>Retrieving game lobby list...</div>";
      main.net.game.state.refreshLobbyList();
    },
    displayList: function(lobbies) {
      this.element.innerHTML = "";
      for(var i=0;i<lobbies.length;i++) {
        this.element.innerHTML += "<div class='right-menu-item btn' onclick='main.net.game.state.joinLobby(\"" + lobbies[i].lid + "\")'>" + lobbies[i].name + " | " + lobbies[i].gametype + " | " + lobbies[i].host +  " | " + lobbies[i].players + "/" + lobbies[i].maxPlayers + "</div>";
      }
    }
  };
  
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
    create: {
      element: document.getElementById("lobby-create"),
      hide: hide,
      show: show,
      onEnter: function() {
        var name = document.getElementById("lobby-create-name-input");
        main.net.game.state.createLobby(name.value);
      },
      items: [
        document.getElementById("lobby-create-name"),
        document.getElementById("lobby-create-create")
      ]
    },
    leave: {
      element: document.getElementById("lobby-leave"),
      hide: hide,
      show: show,
      onEnter: function() {
         main.net.leaveServer();
      },
      items: []
    }
  };
};

/* Shows this menu */
LobbyMenu.prototype.show = function() {
  main.menu.hideAll();
  document.getElementById("lobby-server").innerHTML = main.net.user + "@" + main.net.game.info.name;
  this.list.refresh();
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