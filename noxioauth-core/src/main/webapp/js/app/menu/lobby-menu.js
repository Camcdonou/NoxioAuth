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
    create: {
      element: document.getElementById("lobby-create"),
      hide: function() { tmp.dropDownHide(); hide.call(this); },
      show: show,
      onEnter: function() {
        tmp.customGame.game_name = document.getElementById("lobby-create-name-input").value;
//        
        if(!tmp.customGame.rotation[0].gametype || !tmp.customGame.rotation[0].map_name) {
          main.menu.warning.show("You must select a gametype and map."); return;
        }
        if(!tmp.customGame.game_name) {
          main.menu.warning.show("You must set a name."); return;
        }
        
        var val;
        val = tmp.settings.max_players.value;
        if(val) { tmp.customGame.max_player = val; }
        val = tmp.settings.score_to_win.value;
        if(val) { tmp.customGame.rotation[0].score_to_win = val; }
        val = tmp.settings.respawn_time.value;
        if(val) { tmp.customGame.rotation[0].respawn_time = Math.round(parseFloat(val)*30); }
        val = tmp.settings.static_hill.value;
        if(val) { tmp.customGame.rotation[0].static_hill = val === "On" ? 0 : 1; }
        val = tmp.settings.score_to_move.value;
        if(val) { tmp.customGame.rotation[0].score_to_move = val; }
        
        main.net.game.state.createLobby(tmp.customGame);
      },
      items: [
        document.getElementById("lobby-create-name"),
        document.getElementById("lobby-create-gametype"),
        document.getElementById("lobby-create-map"),
        document.getElementById("lobby-create-settings"),
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
  
  this.drops = {
    gametype: {
      button: document.getElementById("lobby-create-gametype"),
      container: document.getElementById("lobby-create-gametype-container")
    },
    map: {
      button: document.getElementById("lobby-create-map"),
      container: document.getElementById("lobby-create-map-container")
    },
    settings: {
      button: document.getElementById("lobby-create-settings"),
      container: document.getElementById("lobby-create-settings-container")
    }
  };
  
  this.settings = {
    max_players: document.getElementById("lobby-create-settings-maxplayers"),
    score_to_win: document.getElementById("lobby-create-settings-scoretowin"),
    respawn_time: document.getElementById("lobby-create-settings-respawntime"),
    static_hill: document.getElementById("lobby-create-settings-statichill"),
    score_to_move: document.getElementById("lobby-create-settings-scoretomove")
  };
  
  /* CONST */
  this.gametypes = [
    {name: "Deathmatch", value: "deathmatch", settings: ["max_players", "respawn_time", "score_to_win"]},
    {name: "Team Deathmatch", value: "teamdeathmatch", settings: ["max_players", "respawn_time", "score_to_win"]},
    {name: "Capture The Flag", value: "capturetheflag", settings: ["max_players", "respawn_time", "score_to_win"]},
    {name: "King", value: "king", settings: ["max_players", "respawn_time", "score_to_win", "static_hill", "score_to_move"]},
    {name: "Team King", value: "teamking", settings: ["max_players", "respawn_time", "score_to_win", "score_to_move"]},
    {name: "Ultimate Lifeform", value: "ultimate", settings: ["max_players", "respawn_time", "score_to_win"]}
  ];
  
  /* RETRIVE FROM SERVER @TODO */
  this.maps = [
    {name: "Final Destination", value: "final"},
    {name: "Battle Field", value: "battle"},
    {name: "War Ground", value: "war"},
    {name: "Combat Zone", value: "combat"},
    {name: "Penultimate Platform", value: "penultimate"}
  ];
  
  this.customGame = {
    rotation: [{}]
  };
};

LobbyMenu.prototype.dropDownHide = function() {
  this.drops.gametype.container.style.display = "none";
  this.drops.map.container.style.display = "none";
  this.drops.settings.container.style.display = "none";

  for(var i=0;i<this.items.create.items.length;i++) {
    this.items.create.items[i].classList.remove("selected");
  }
};

LobbyMenu.prototype.dropDownGametype = function() {
  var button = this.drops.gametype.button;
  var container = this.drops.gametype.container;
  
  this.dropDownHide();
  
  button.classList.add("selected");
  container.style.display = "block";
  container.innerHTML = "";
  for(var i=0;i<this.gametypes.length;i++) {
    container.innerHTML += "<div class='menu sub drop' id='lobby-create-gametype-"+i+"' onclick='main.menu.lobby.dropDownGametypeSelect("+i+")'>"+this.gametypes[i].name+"</div>";
  }
};

LobbyMenu.prototype.dropDownGametypeSelect = function(index) {
  var gt = this.gametypes[index];
  this.drops.gametype.button.innerHTML = gt.name;
  this.customGame.rotation[0].gametype = gt.value;
  
  this.dropDownSettingsHideAll();
  for(var i=0;i<gt.settings.length;i++) {
    this.settings[gt.settings[i]].parentElement.style.display = "block";
  }
  this.drops.settings.button.style.display = "block";
    
  this.dropDownHide();
};

LobbyMenu.prototype.dropDownMap = function() {
  var button = this.drops.map.button;
  var container = this.drops.map.container;
  
  this.dropDownHide();
  
  button.classList.add("selected");
  container.style.display = "block";
  container.innerHTML = "";
  for(var i=0;i<this.maps.length;i++) {
    container.innerHTML += "<div class='menu sub drop' id='lobby-create-map-"+i+"' onclick='main.menu.lobby.dropDownMapSelect("+i+")'>"+this.maps[i].name+"</div>";
  }
};

LobbyMenu.prototype.dropDownMapSelect = function(index) {
  this.drops.map.button.innerHTML = this.maps[index].name;
  this.customGame.rotation[0].map_name = this.maps[index].value;
  this.dropDownHide();
};

LobbyMenu.prototype.dropDownSettings = function() {
  var button = this.drops.settings.button;
  var container = this.drops.settings.container;
  
  this.dropDownHide();
  
  button.classList.add("selected");
  container.style.display = "block";
};

LobbyMenu.prototype.dropDownSettingsHideAll = function() {
    this.settings.max_players.parentElement.style.display = "none";
    this.settings.score_to_win.parentElement.style.display = "none";
    this.settings.respawn_time.parentElement.style.display = "none";
    this.settings.static_hill.parentElement.style.display = "none";
    this.settings.score_to_move.parentElement.style.display = "none";
};

/*LobbyMenu.prototype.forceNum = function(id) {
  var fld = this.settings[id];
  fld.value = fld.value.replace(/[^0-9]/g, "");
};*/

LobbyMenu.prototype.toggleSetting = function(setnam) {
  this.settings[setnam].value = this.settings[setnam].value === 'On' ? 'Off' : 'On';
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
  main.menu.credit.show();
  this.element.style.display = "block";
  if(!this.customGame.rotation[0].gametype) { this.drops.settings.button.style.display = "none"; }
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