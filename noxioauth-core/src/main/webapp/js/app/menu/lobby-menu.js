"use strict";
/* global main */

function LobbyMenu() {
  this.element = document.getElementById("lobby");
  
  /* Game Lobby List */
  this.list = {
    element: document.getElementById("lobby-list-container"),
    refresh: function() {
      this.element.innerHTML = "<div class='menu sub'>Retrieving game lobby list...</div>";
      main.net.game.state.refreshLobbyList();
    },
    displayList: function(lobbies) {
      this.element.innerHTML = "";
      for(var i=0;i<lobbies.length;i++) {
        this.element.innerHTML += "<div class='menu sub btn' onclick='main.net.game.state.joinLobby(\"" + lobbies[i].lid + "\")'><span class='per30'>" + lobbies[i].name + "</span><span class='per30'>" + lobbies[i].gametype + "</span><span class='per30'>" + lobbies[i].host +  "</span><span class='per10'>" + lobbies[i].players + "/" + lobbies[i].maxPlayers + "</span></div>";
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

/* Resizes main center container to fit double menu thing */
LobbyMenu.prototype.resize = function() {
  if(this.element.style.display !== "none") {
    if(window.innerWidth - (335 + 600) > 150) { this.element.style.width = 335 + 600 + 75; }
    else { this.element.style.width = 600; }
  }
};

/* Shows this menu */
LobbyMenu.prototype.show = function() {
  main.menu.hideAll();
  document.getElementById("lobby-server").innerHTML = main.net.game.info.location;
  this.hideAll();
  this.list.refresh();
  this.items.create.show();
  this.element.style.display = "block";
  this.resize();
};

/* Hide this menu */
LobbyMenu.prototype.hide = function() {
  this.element.style.display = "none";
};

/* Hides all sub menus in this menu */
LobbyMenu.prototype.hideAll = function() {
  this.items.create.hide();
  this.items.leave.hide();
};