"use strict";
/* global main */


/* The part of this class (95% of it) that handles custom game creation menus is egregious */
/* Delet this pls, rewrite it @TODO */
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
  
  var tmp = this;
  
  /* Creates sub menus */
  this.items = {
    name: {
      element: document.getElementById("lobby-name"),
      hide: hide,
      show: show,
      onEnter: function() { },
      items: []
    },
    custom: {
      element: document.getElementById("lobby-custom"),
      hide: hide,
      show: show,
      onEnter: function() { },
      items: [
        document.getElementById("lobby-custom-1"),
        document.getElementById("lobby-custom-2")]
    },
    private: {
      element: document.getElementById("lobby-private"),
      hide: hide,
      show: show,
      onEnter: function() { tmp.privateJoin(); },
      items: [
        document.getElementById("lobby-private-pass"),
        document.getElementById("lobby-private-enter")
      ]
    },
    leave: {
      element: document.getElementById("lobby-leave"),
      hide: hide,
      show: show,
      onEnter: function() { main.net.leaveServer(); },
      items: []
    }
  };
};

LobbyMenu.prototype.privateJoin = function() {
  var lobnam = document.getElementById("lobby-private-pass-inp").value;
  main.net.game.state.joinLobbyByName(lobnam);
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
  main.menu.navigation("lobby", "lobby");
  main.menu.hideAll();
  document.getElementById("lobby-server").innerHTML = main.net.game.info.location;
  this.hideAll();
  this.list.refresh();
  main.menu.credit.show();
  main.menu.rank.show();
  this.items.custom.element.style.display = main.unlocks.has("FT_LOBBY") ? "block" : "none";
  this.items.name.element.innerHTML = main.net.display;
  this.element.style.display = "block";
  this.resize();
};

/* Hide this menu */
LobbyMenu.prototype.hide = function() {
  this.element.style.display = "none";
};

/* Hides all sub menus in this menu */
LobbyMenu.prototype.hideAll = function() {
  this.items.custom.hide();
  this.items.private.hide();
  this.items.leave.hide();
};

/* Called when the back button is hit on this menu */
LobbyMenu.prototype.onBack = function() {
  main.net.leaveServer();
};